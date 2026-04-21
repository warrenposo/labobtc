import { useState } from "react";
import { Zap, Shield, DollarSign, BarChart3, Globe, MessageCircle, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    tag: "Performance",
    title: "High-Performance Mining Hardware",
    description:
      "Our state-of-the-art ASIC rigs run custom-optimised firmware 24/7, delivering industry-leading hash rates without any setup on your end.",
    detail: "Up to 155 TH/s per unit · SHA-256 optimised · Auto-tuning firmware",
    stat: { value: "155 TH/s", label: "Peak Hash Rate" },
    color: "yellow",
    gradFrom: "#F59E0B",
    gradTo: "#EA580C",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/25",
    ring: "ring-yellow-500/30",
    text: "text-yellow-400",
    bar: "from-yellow-500 to-orange-400",
    pct: 94,
  },
  {
    icon: Shield,
    tag: "Security",
    title: "Bank-Grade Asset Protection",
    description:
      "Every account is protected by multi-factor authentication, hardware-enforced cold-storage vaults, and end-to-end TLS encryption on all API calls.",
    detail: "MFA · Cold storage vaults · AES-256 encryption · ISO 27001",
    stat: { value: "0 Breaches", label: "Security Record" },
    color: "blue",
    gradFrom: "#3B82F6",
    gradTo: "#06B6D4",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    ring: "ring-blue-500/30",
    text: "text-blue-400",
    bar: "from-blue-500 to-cyan-400",
    pct: 100,
  },
  {
    icon: DollarSign,
    tag: "Payouts",
    title: "Automatic Daily BTC Payouts",
    description:
      "Mining rewards are calculated every hour and deposited directly into your wallet every 24 hours — zero manual steps, zero hidden fees.",
    detail: "Every 24 h · No minimum · Direct to wallet · Zero platform fees",
    stat: { value: "Daily", label: "Payout Frequency" },
    color: "emerald",
    gradFrom: "#10B981",
    gradTo: "#14B8A6",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    ring: "ring-emerald-500/30",
    text: "text-emerald-400",
    bar: "from-emerald-500 to-teal-400",
    pct: 100,
  },
  {
    icon: BarChart3,
    tag: "Analytics",
    title: "Real-Time Analytics Dashboard",
    description:
      "Live hash rate graphs, per-worker diagnostics, earnings forecasts, and historical reports — all in one clean, mobile-friendly dashboard.",
    detail: "1-second refresh · Per-worker stats · Earnings forecast · CSV export",
    stat: { value: "1-sec", label: "Data Refresh Rate" },
    color: "purple",
    gradFrom: "#8B5CF6",
    gradTo: "#EC4899",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    ring: "ring-purple-500/30",
    text: "text-purple-400",
    bar: "from-purple-500 to-pink-400",
    pct: 88,
  },
  {
    icon: Globe,
    tag: "Infrastructure",
    title: "Global Mining Infrastructure",
    description:
      "Data centres on 5 continents, connected via redundant 10 Gbps links. Automatic failover keeps your miners running even during regional outages.",
    detail: "5 continents · 10 Gbps links · Auto-failover · 99.9% SLA",
    stat: { value: "99.9%", label: "Guaranteed Uptime" },
    color: "sky",
    gradFrom: "#0EA5E9",
    gradTo: "#6366F1",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    ring: "ring-sky-500/30",
    text: "text-sky-400",
    bar: "from-sky-500 to-indigo-400",
    pct: 99,
  },
  {
    icon: MessageCircle,
    tag: "Support",
    title: "24 / 7 Expert Support Team",
    description:
      "Dedicated mining specialists are available round-the-clock via live chat, email, and Telegram — in your timezone, in your language.",
    detail: "Live chat · Email · Telegram · Avg. reply < 3 min",
    stat: { value: "< 3 min", label: "Avg. Response Time" },
    color: "rose",
    gradFrom: "#F43F5E",
    gradTo: "#EF4444",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    ring: "ring-rose-500/30",
    text: "text-rose-400",
    bar: "from-rose-500 to-red-400",
    pct: 97,
  },
];

export const Features = () => {
  const [active, setActive] = useState(0);
  const f = features[active];

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060d1a 0%, #070f1e 100%)" }}
    >
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,158,11,0.05), transparent)" }}
      />

      <div className="container mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block text-xs font-bold tracking-widest text-yellow-400/60 uppercase mb-3">
            — Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Everything You Need to
            <span className="text-gradient-gold"> Mine Smarter.</span>
          </h2>
        </div>

        {/* Two-column showcase */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">

          {/* LEFT — feature list (2 cols wide) */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              const isActive = i === active;
              return (
                <button
                  key={feat.tag}
                  onClick={() => setActive(i)}
                  className={`group w-full text-left rounded-xl px-4 py-3.5 border transition-all duration-200 flex items-center gap-3.5
                    ${isActive
                      ? `${feat.bg} ${feat.border} ring-1 ${feat.ring}`
                      : "border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12"
                    }`}
                >
                  {/* Icon bubble */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={
                      isActive
                        ? { background: `linear-gradient(135deg, ${feat.gradFrom}, ${feat.gradTo})` }
                        : { background: "rgba(255,255,255,0.05)" }
                    }
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/60"}`} />
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isActive ? feat.text : "text-white/30 group-hover:text-white/50"}`}>
                      {feat.tag}
                    </div>
                    <div className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-white/50 group-hover:text-white/70"}`}>
                      {feat.title}
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${isActive ? `${feat.text} opacity-100` : "text-white/20 group-hover:text-white/40"}`} />
                </button>
              );
            })}
          </div>

          {/* RIGHT — detail panel (3 cols wide) */}
          <div className="lg:col-span-3">
            <div
              key={active}
              className={`rounded-2xl border ${f.border} ${f.bg} overflow-hidden`}
              style={{ animation: "fadeSlideIn 0.25s ease-out" }}
            >
              {/* Top colour bar */}
              <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${f.gradFrom}, ${f.gradTo})` }}
              />

              <div className="p-8">
                {/* Tag + Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-widest ${f.text} mb-3`}
                    >
                      {f.tag}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight max-w-sm">
                      {f.title}
                    </h3>
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${f.gradFrom}, ${f.gradTo})` }}
                  >
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/55 text-base leading-relaxed mb-6">
                  {f.description}
                </p>

                {/* Detail chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {f.detail.split(" · ").map((chip) => (
                    <span
                      key={chip}
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${f.border} ${f.bg} ${f.text}`}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Stat + progress */}
                <div className={`rounded-xl border ${f.border} bg-black/20 p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className={`text-3xl font-black font-mono ${f.text}`}>{f.stat.value}</div>
                      <div className="text-white/35 text-xs mt-0.5">{f.stat.label}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/25 text-xs font-mono mb-1">Performance index</div>
                      <div className={`text-lg font-bold ${f.text}`}>{f.pct}%</div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${f.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-5">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-200 ${i === active ? `w-5 h-2 ${features[i].bg} border ${features[i].border}` : "w-2 h-2 bg-white/15 hover:bg-white/30"}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};
