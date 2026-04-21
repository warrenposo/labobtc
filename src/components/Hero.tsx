import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bitcoin, ArrowRight, Activity, Cpu, Zap, TrendingUp, Lock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Ticker ───────────────────────────────────────────────────────────────────
const CG_TICKER_IDS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "binancecoin", symbol: "BNB" },
  { id: "solana", symbol: "SOL" },
  { id: "cardano", symbol: "ADA" },
] as const;

const FALLBACK_TICKER = [
  { symbol: "BTC", price: "—", change: "—" },
  { symbol: "ETH", price: "—", change: "—" },
  { symbol: "BNB", price: "—", change: "—" },
  { symbol: "SOL", price: "—", change: "—" },
  { symbol: "ADA", price: "—", change: "—" },
  { symbol: "BTC", price: "—", change: "—" },
  { symbol: "ETH", price: "—", change: "—" },
  { symbol: "BNB", price: "—", change: "—" },
  { symbol: "SOL", price: "—", change: "—" },
  { symbol: "ADA", price: "—", change: "—" },
];

function formatUsdPrice(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Mining simulation helpers ────────────────────────────────────────────────
const HEX = "0123456789abcdef";
const randHex = (len: number) => Array.from({ length: len }, () => HEX[Math.floor(Math.random() * 16)]).join("");
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

type LogEntry = { ts: string; type: "ok" | "warn" | "info" | "block"; msg: string };

function nowTs() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function makeLogEntry(): LogEntry {
  const r = Math.random();
  if (r < 0.55) {
    return { ts: nowTs(), type: "ok", msg: `Share accepted  nonce=${randHex(8)}  diff=${randInt(18, 32)}` };
  } else if (r < 0.65) {
    return { ts: nowTs(), type: "warn", msg: `Stale share rejected  age=${randInt(1, 4)}s` };
  } else if (r < 0.78) {
    return { ts: nowTs(), type: "info", msg: `Stratum job #${randInt(100, 999)}  target=0000${randHex(4)}` };
  } else if (r < 0.88) {
    return { ts: nowTs(), type: "info", msg: `Pool ping ${randInt(8, 28)}ms  peers=${randInt(3, 8)}` };
  } else if (r < 0.95) {
    return { ts: nowTs(), type: "info", msg: `Difficulty updated → ${randInt(52, 68)}G` };
  } else {
    return { ts: nowTs(), type: "block", msg: `★ Block found!  reward +${(Math.random() * 0.0004 + 0.00042).toFixed(5)} BTC` };
  }
}

const INITIAL_LOGS: LogEntry[] = [
  { ts: "—", type: "info",  msg: "btcn-miner v2.3.1 starting up…" },
  { ts: "—", type: "info",  msg: `Connecting to pool.btcnminingbase.com:3333` },
  { ts: "—", type: "ok",   msg: "Stratum connection established" },
  { ts: "—", type: "info",  msg: `Stratum job #042  target=00003a8f` },
  { ts: "—", type: "ok",   msg: `Share accepted  nonce=a3f9c12d  diff=24` },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const Hero = () => {
  // Ticker
  const [tickerItems, setTickerItems] = useState(FALLBACK_TICKER);

  const fetchTicker = useCallback(async () => {
    try {
      const url =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano&vs_currencies=usd&include_24hr_change=true";
      const res = await fetch(url);
      if (!res.ok) return;
      const data = (await res.json()) as Record<string, { usd?: number; usd_24h_change?: number | null }>;
      const built = CG_TICKER_IDS.map(({ id, symbol }) => {
        const d = data[id];
        if (!d || typeof d.usd !== "number") return { symbol, price: "—", change: "—" };
        const pct = typeof d.usd_24h_change === "number" && Number.isFinite(d.usd_24h_change) ? d.usd_24h_change : 0;
        return { symbol, price: formatUsdPrice(d.usd), change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` };
      });
      setTickerItems([...built, ...built]);
    } catch { /* keep fallback */ }
  }, []);

  useEffect(() => {
    void fetchTicker();
    const id = setInterval(() => void fetchTicker(), 60_000);
    return () => clearInterval(id);
  }, [fetchTicker]);

  // ── Mining sim state ─────────────────────────────────────────────────────
  const [hashrate, setHashrate]       = useState(142.7);
  const [nonce, setNonce]             = useState(randHex(16));
  const [blockPct, setBlockPct]       = useState(0);
  const [accepted, setAccepted]       = useState(312);
  const [rejected, setRejected]       = useState(4);
  const [earnings, setEarnings]       = useState(0.00284);
  const [flashBlock, setFlashBlock]   = useState(false);
  const [logs, setLogs]               = useState<LogEntry[]>(INITIAL_LOGS);
  const logBoxRef = useRef<HTMLDivElement>(null);

  // Nonce flicker — fast
  useEffect(() => {
    const id = setInterval(() => setNonce(randHex(16)), 120);
    return () => clearInterval(id);
  }, []);

  // Hashrate drift
  useEffect(() => {
    const id = setInterval(() => {
      setHashrate(h => parseFloat(Math.max(135, Math.min(155, h + (Math.random() - 0.48) * 0.8)).toFixed(1)));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Block progress — fills up then resets (simulates finding a block)
  useEffect(() => {
    const id = setInterval(() => {
      setBlockPct(p => {
        if (p >= 100) {
          setFlashBlock(true);
          setTimeout(() => setFlashBlock(false), 1200);
          return 0;
        }
        return parseFloat(Math.min(100, p + Math.random() * 1.8 + 0.3).toFixed(1));
      });
    }, 300);
    return () => clearInterval(id);
  }, []);

  // Log entries appended periodically
  useEffect(() => {
    const id = setInterval(() => {
      const entry = makeLogEntry();
      if (entry.type === "ok") setAccepted(a => a + 1);
      if (entry.type === "warn") setRejected(r => r + 1);
      if (entry.type === "block") setEarnings(e => parseFloat((e + parseFloat((Math.random() * 0.0004 + 0.00042).toFixed(5))).toFixed(5)));
      setLogs(prev => [...prev.slice(-40), entry]);
    }, 1600);
    return () => clearInterval(id);
  }, []);

  // Earnings drift up slowly
  useEffect(() => {
    const id = setInterval(() => {
      setEarnings(e => parseFloat((e + 0.000001).toFixed(6)));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  const total = accepted + rejected;
  const acceptRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : "100.0";

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#060d1a]">
      {/* Dot-matrix background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      {/* Diagonal gold slash */}
      <div
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{ background: "linear-gradient(135deg, transparent 45%, rgba(245,158,11,0.04) 45%, rgba(245,158,11,0.04) 55%, transparent 55%)" }}
      />
      {/* Ambient glows */}
      <div className="orb w-[500px] h-[500px] bg-yellow-500/8 top-[-80px] right-[-60px]" />
      <div className="orb w-[400px] h-[400px] bg-emerald-500/6 bottom-[-60px] left-[-80px]" />

      {/* Live price ticker */}
      <div className="relative z-10 w-full bg-black/30 border-b border-white/8 backdrop-blur-sm mt-16 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-2.5">
          {tickerItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-10 text-xs font-mono">
              <Bitcoin className="w-3 h-3 text-yellow-400" />
              <span className="text-white/90 font-bold tracking-wider">{item.symbol}</span>
              <span className="text-white/55">{item.price}</span>
              <span className={item.change === "—" ? "text-white/30" : item.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}>
                {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center px-4 py-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-emerald-400 text-xs font-semibold tracking-wide">NETWORK LIVE — 50,000+ MINERS ACTIVE</span>
              </div>

              <div>
                <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                  <span className="text-white block">The Smarter</span>
                  <span className="text-white block">Way to</span>
                  <span className="text-gradient-gold block mt-1">Mine Bitcoin.</span>
                </h1>
              </div>

              <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-md">
                Professional cloud mining infrastructure. No hardware. No electricity bills.
                Just daily BTC earnings — straight to your wallet.
              </p>

              <ul className="space-y-3">
                {[
                  { icon: Zap,        text: "Start earning within minutes of signing up" },
                  { icon: Lock,       text: "Bank-grade security & cold storage protection" },
                  { icon: TrendingUp, text: "Daily automatic BTC payouts, zero fees" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-white/65">
                    <span className="flex-shrink-0 w-6 h-6 rounded-md bg-yellow-500/15 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-yellow-400" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/login">
                  <Button size="lg" className="text-sm px-7 py-5 bg-gradient-gold hover:shadow-glow transition-all duration-300 hover:scale-105 font-bold text-black gap-2 rounded-lg">
                    Start Mining Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="text-sm px-7 py-5 text-white/70 border border-white/12 hover:border-yellow-500/40 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-lg">
                    View Plans
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-white/8">
                {[{ value: "$2.4M+", label: "Paid Out" }, { value: "250+ BTC", label: "Mined" }, { value: "150+", label: "Countries" }].map(s => (
                  <div key={s.label}>
                    <div className="text-lg font-bold text-gradient-gold">{s.value}</div>
                    <div className="text-white/35 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Live mining simulation terminal */}
            <div className="hidden lg:flex justify-end">
              <div className={`w-full max-w-[460px] rounded-2xl border bg-black/50 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 ${flashBlock ? "border-yellow-400/60 shadow-yellow-500/20" : "border-white/10"}`}>

                {/* Terminal title bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-white/[0.04] border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-white/40 text-xs font-mono tracking-wider">btcn-miner v2.3.1 — running</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                  <div className="px-4 py-3.5 text-center">
                    <div className="text-base font-bold font-mono text-yellow-400 tabular-nums">{hashrate} TH/s</div>
                    <div className="text-white/30 text-[10px] mt-0.5 flex items-center justify-center gap-1"><Cpu className="w-2.5 h-2.5" /> Hashrate</div>
                  </div>
                  <div className="px-4 py-3.5 text-center">
                    <div className="text-base font-bold font-mono text-emerald-400">{acceptRate}%</div>
                    <div className="text-white/30 text-[10px] mt-0.5">Accept Rate</div>
                  </div>
                  <div className="px-4 py-3.5 text-center">
                    <div className="text-base font-bold font-mono text-blue-400">12 / 12</div>
                    <div className="text-white/30 text-[10px] mt-0.5">Workers</div>
                  </div>
                </div>

                {/* Nonce scanner */}
                <div className="px-5 py-3.5 border-b border-white/8 bg-black/30">
                  <div className="flex justify-between text-[10px] text-white/30 font-mono mb-2 uppercase tracking-widest">
                    <span>Scanning nonce space</span>
                    <span className="text-yellow-400/60 animate-pulse">● searching</span>
                  </div>
                  <div className="font-mono text-sm tracking-widest text-center py-1">
                    <span className="text-white/20">0x</span>
                    <span className="text-yellow-300/90">{nonce.slice(0, 8)}</span>
                    <span className="text-yellow-500/50">{nonce.slice(8)}</span>
                  </div>
                </div>

                {/* Block progress */}
                <div className="px-5 py-3 border-b border-white/8">
                  <div className="flex justify-between text-[10px] text-white/30 font-mono mb-1.5">
                    <span>Block search progress</span>
                    <span className={flashBlock ? "text-yellow-400 font-bold" : "text-white/40"}>{flashBlock ? "★ BLOCK FOUND!" : `${blockPct.toFixed(1)}%`}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${flashBlock ? "bg-yellow-400" : "bg-gradient-to-r from-yellow-500 to-orange-400"}`}
                      style={{ width: `${flashBlock ? 100 : blockPct}%` }}
                    />
                  </div>
                </div>

                {/* Shares + earnings row */}
                <div className="grid grid-cols-2 divide-x divide-white/8 border-b border-white/8">
                  <div className="px-5 py-3">
                    <div className="text-[10px] text-white/30 font-mono mb-1.5 uppercase tracking-widest">Shares</div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> {accepted}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-mono text-red-400/70">
                        <XCircle className="w-3 h-3" /> {rejected}
                      </span>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-emerald-500/[0.04]">
                    <div className="text-[10px] text-white/30 font-mono mb-1.5 uppercase tracking-widest">Today's Earnings</div>
                    <div className="text-base font-black font-mono text-emerald-400 tabular-nums">+{earnings.toFixed(5)} BTC</div>
                  </div>
                </div>

                {/* Scrolling live log */}
                <div className="px-5 pt-3 pb-1">
                  <div className="text-[10px] text-white/25 font-mono mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Output
                  </div>
                  <div
                    ref={logBoxRef}
                    className="h-[118px] overflow-y-auto space-y-1 scrollbar-none"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {logs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] font-mono leading-relaxed">
                        <span className="text-white/20 flex-shrink-0 w-16 tabular-nums">{log.ts}</span>
                        {log.type === "ok"    && <CheckCircle2 className="w-3 h-3 text-emerald-500/70 flex-shrink-0 mt-px" />}
                        {log.type === "warn"  && <AlertTriangle className="w-3 h-3 text-yellow-500/70 flex-shrink-0 mt-px" />}
                        {log.type === "block" && <span className="text-yellow-400 flex-shrink-0">★</span>}
                        {log.type === "info"  && <span className="text-blue-400/50 flex-shrink-0 text-[10px] mt-px">›</span>}
                        <span className={
                          log.type === "ok"    ? "text-emerald-400/80" :
                          log.type === "warn"  ? "text-yellow-400/70" :
                          log.type === "block" ? "text-yellow-300 font-semibold" :
                                                 "text-white/40"
                        }>
                          {log.msg}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 py-4">
                  <Link to="/login">
                    <button className="w-full py-2.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/50 text-yellow-400 text-sm font-semibold transition-all duration-200">
                      Connect Your Wallet →
                    </button>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
