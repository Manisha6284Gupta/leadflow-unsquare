import { useApp } from "../context/AppContext";
import { DEFAULT_STAGES } from "../constants";
import {
  TrendingUp,
  Euro,
  CheckCircle2,
  Building,
  ShieldCheck,
  Flame
} from "lucide-react";
export const DashboardAnalytics = () => {
  const {
    metrics,
    leads,
    tasks,
    documents,
    currentBrokerage
  } = useApp();
  const formatEuro = (amt = 0) => {
    if (amt >= 1e6) return `\u20AC${(amt / 1e6).toFixed(2)}M`;
    if (amt >= 1e3) return `\u20AC${Math.round(amt / 1e3)}k`;
    return `\u20AC${amt.toLocaleString()}`;
  };
  const wonLeads = leads.filter((l) => l.stageId === "won");
  const activePipelineVolume = metrics?.activePipelineVolumeEur || leads.filter((l) => l.stageId !== "won" && l.stageId !== "lost").reduce((s, l) => s + (l.requestedLoanAmount || 0), 0);
  const wonVolume = metrics?.wonVolumeEur || wonLeads.reduce((s, l) => s + (l.requestedLoanAmount || 0), 0);
  const visaStats = {};
  leads.forEach((l) => {
    visaStats[l.visaStatus] = (visaStats[l.visaStatus] || 0) + 1;
  });
  const cityStats = {};
  leads.forEach((l) => {
    const c = l.propertyCity.split("(")[0].trim() || "Berlin";
    cityStats[c] = (cityStats[c] || 0) + 1;
  });
  return <div className="space-y-6 max-w-7xl mx-auto">
      {
    /* Header */
  }
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Real-Time Mortgage Pipeline Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated metrics for {currentBrokerage?.name}. Kept live via Server-Sent Events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Never Out-of-Date Live Engine</span>
          </span>
        </div>
      </div>

      {
    /* KPI Cards Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {
    /* Active Pipeline Volume */
  }
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Pipeline Volume</span>
            <Euro className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatEuro(activePipelineVolume)}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
            <span className="text-blue-400 font-semibold">{leads.length - wonLeads.length} active leads</span>
            <span>in German lender underwriting</span>
          </div>
        </div>

        {
    /* Won Loan Volume */
  }
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Closed & Notarized Loans</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{formatEuro(wonVolume)}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
            <span className="text-emerald-400 font-semibold">{wonLeads.length} deals closed</span>
            <span>({metrics?.conversionRatePercent || 15}% conversion)</span>
          </div>
        </div>

        {
    /* Avg Loan Request */
  }
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Average Expat Mortgage</span>
            <Building className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-200">
            {formatEuro(metrics?.avgLoanAmountEur || 48e4)}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
            <span>Average ~80% Loan-to-Value (LTV)</span>
          </div>
        </div>

        {
    /* Overdue Tasks Alert */
  }
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Overdue Speed-to-Lead Tasks</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">
            {metrics?.overdueTasksCount || tasks.filter((t) => t.isOverdue && !t.completed).length}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
            <span className="text-rose-400 font-semibold">Immediate attention</span>
            <span>to keep expat SLAs</span>
          </div>
        </div>
      </div>

      {
    /* Stage Distribution Funnel */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          Pipeline Stage Funnel Velocity
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DEFAULT_STAGES.map((st) => {
    const count = leads.filter((l) => l.stageId === st.id).length;
    const volume = leads.filter((l) => l.stageId === st.id).reduce((s, l) => s + (l.requestedLoanAmount || 0), 0);
    return <div
      key={st.id}
      className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2"
    >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                  <span className="text-xs font-bold text-white truncate">{st.name}</span>
                </div>
                <div className="text-lg font-black text-slate-200">{count}</div>
                <div className="text-[10px] text-slate-400">{formatEuro(volume)}</div>
              </div>;
  })}
        </div>
      </div>

      {
    /* Expat Demographic Breakdown */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {
    /* Visa & Permit Status Distribution */
  }
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Expat Residency & Permit Distribution</span>
          </h2>

          <div className="space-y-2.5">
            {Object.entries(visaStats).map(([visa, count]) => {
    const pct = Math.round(count / leads.length * 100);
    return <div key={visa} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{visa.replace(/_/g, " ")}</span>
                    <span className="text-slate-400 font-semibold">{count} expat(s) ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>;
  })}
          </div>
        </div>

        {
    /* Top German Property Locations */
  }
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Top German Purchase Locations</span>
          </h2>

          <div className="space-y-2.5">
            {Object.entries(cityStats).map(([city, count]) => {
    const pct = Math.round(count / leads.length * 100);
    return <div key={city} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{city}</span>
                    <span className="text-slate-400 font-semibold">{count} inquiry(ies)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>;
  })}
          </div>
        </div>
      </div>
    </div>;
};
