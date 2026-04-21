import { Users, TrendingUp, Clock, Globe, Bitcoin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Miners",
    sub: "Across 150+ countries",
    pct: 82,
    color: "text-yellow-400",
    bar: "from-yellow-500 to-orange-400",
    bg: "bg-yellow-500/8",
    border: "border-yellow-500/15",
  },
  {
    icon: TrendingUp,
    value: "250+ BTC",
    label: "Total Mined",
    sub: "Since launch in 2020",
    pct: 68,
    color: "text-emerald-400",
    bar: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/15",
  },
  {
    icon: Clock,
    value: "99.9%",
    label: "Platform Uptime",
    sub: "Guaranteed SLA",
    pct: 99,
    color: "text-blue-400",
    bar: "from-blue-500 to-cyan-400",
    bg: "bg-blue-500/8",
    border: "border-blue-500/15",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries Served",
    sub: "Global reach",
    pct: 75,
    color: "text-purple-400",
    bar: "from-purple-500 to-pink-400",
    bg: "bg-purple-500/8",
    border: "border-purple-500/15",
  },
];

const highlights = [
  { label: "Total Paid Out", value: "$2.4M+", icon: Bitcoin },
  { label: "Avg. Daily Yield", value: "0.8% – 3%", icon: TrendingUp },
  { label: "Pools Connected", value: "12 Global", icon: Globe },
];

export const Statistics = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#060d1a]">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/25 to-transparent" />

      {/* Subtle radial */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.05), transparent)" }} />

      <div className="container mx-auto relative z-10">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-yellow-400/70 uppercase mb-4">
              — By the Numbers
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Proof in Every
              <span className="text-gradient-gold block">Statistic.</span>
            </h2>
          </div>
          <Link to="/login">
            <button className="flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-yellow-400 border border-white/10 hover:border-yellow-500/30 rounded-lg px-5 py-2.5 transition-all duration-200">
              Join the Network <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Stat cards with progress bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`group relative rounded-2xl border ${stat.border} ${stat.bg} p-7 overflow-hidden hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className={`text-4xl md:text-5xl font-black font-mono ${stat.color} leading-none`}>
                    {stat.value}
                  </div>
                  <div className="text-white font-semibold text-base mt-2">{stat.label}</div>
                  <div className="text-white/35 text-xs mt-0.5">{stat.sub}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-white/25 mb-1.5 font-mono">
                  <span>Performance index</span>
                  <span>{stat.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.bar} rounded-full transition-all duration-1000`}
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
              </div>

              {/* Subtle corner glow */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${stat.bar} opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none blur-2xl`} />
            </div>
          ))}
        </div>

        {/* Highlights strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.025] px-6 py-5"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <h.icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-none">{h.value}</div>
                <div className="text-white/35 text-xs mt-1">{h.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-yellow-500/15 bg-yellow-500/[0.04] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-white font-bold text-xl mb-1">Ready to start earning?</div>
            <div className="text-white/40 text-sm">Join 50,000+ miners already using BtcNMiningBase — setup takes under 2 minutes.</div>
          </div>
          <Link to="/login">
            <button className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-400 hover:to-orange-300 text-black font-bold text-sm rounded-lg px-7 py-3.5 transition-all duration-200 hover:scale-105 shadow-lg">
              Create Free Account <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};
