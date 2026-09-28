import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { DEFAULT_STAGES } from "../constants";
import {
  Search,
  AlertTriangle,
  Plus,
  Sparkles,
  Flame,
  CheckCircle2,
  FileText
} from "lucide-react";
export const PipelineBoard = ({ onSelectLead, onOpenCreateLead }) => {
  const {
    leads,
    tasks,
    automations,
    templates,
    moveLeadStage,
    convertLeadToClient,
    currentBrokerage,
    users
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("all");
  const [visaFilter, setVisaFilter] = useState("all");
  const [duplicateOnly, setDuplicateOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const leadsWithOverdue = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    tasks.forEach((t) => {
      if (t.leadId && t.isOverdue && !t.completed) {
        set.add(t.leadId);
      }
    });
    return set;
  }, [tasks]);
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesEmail = lead.email.toLowerCase().includes(q);
        const matchesCity = lead.propertyCity.toLowerCase().includes(q);
        const matchesNat = lead.nationality.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCity && !matchesNat) return false;
      }
      if (advisorFilter !== "all" && lead.assignedAdvisorId !== advisorFilter) {
        return false;
      }
      if (visaFilter !== "all" && lead.visaStatus !== visaFilter) {
        return false;
      }
      if (duplicateOnly && !lead.duplicateInfo?.isDuplicate) {
        return false;
      }
      if (overdueOnly && !leadsWithOverdue.has(lead.id)) {
        return false;
      }
      return true;
    });
  }, [leads, searchQuery, advisorFilter, visaFilter, duplicateOnly, overdueOnly, leadsWithOverdue]);
  const stageStats = useMemo(() => {
    const stats = {
      new: { count: 0, volume: 0 },
      contacted: { count: 0, volume: 0 },
      docs_needed: { count: 0, volume: 0 },
      under_review: { count: 0, volume: 0 },
      bank_submitted: { count: 0, volume: 0 },
      won: { count: 0, volume: 0 },
      lost: { count: 0, volume: 0 }
    };
    filteredLeads.forEach((lead) => {
      if (stats[lead.stageId]) {
        stats[lead.stageId].count++;
        stats[lead.stageId].volume += lead.requestedLoanAmount || 0;
      }
    });
    return stats;
  }, [filteredLeads]);
  const formatEuro = (amt) => {
    if (amt >= 1e6) return `\u20AC${(amt / 1e6).toFixed(2)}M`;
    if (amt >= 1e3) return `\u20AC${Math.round(amt / 1e3)}k`;
    return `\u20AC${amt}`;
  };
  const getVisaBadge = (visa) => {
    switch (visa) {
      case "EU_BLUE_CARD":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">EU Blue Card</span>;
      case "EU_CITIZEN":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">EU Citizen</span>;
      case "PERMANENT_RESIDENCY":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Permanent (PR)</span>;
      case "WORK_VISA":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Work Visa</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">Expat</span>;
    }
  };
  return <div className="flex flex-col h-full space-y-4">
      {
    /* Top Filter and Actions Toolbar */
  }
      <div className="bg-slate-900/80 backdrop-blur rounded-xl p-4 border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {
    /* Search & Quick Filters */
  }
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    placeholder="Search expat name, email, city, nationality..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
  />
          </div>

          {
    /* Advisor Filter */
  }
          <select
    value={advisorFilter}
    onChange={(e) => setAdvisorFilter(e.target.value)}
    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
  >
            <option value="all">All Advisors</option>
            {users.filter((u) => u.brokerageId === currentBrokerage?.id && u.role === "advisor").map((u) => <option key={u.id} value={u.id}>
                  {u.name}
                </option>)}
          </select>

          {
    /* Visa Status Filter */
  }
          <select
    value={visaFilter}
    onChange={(e) => setVisaFilter(e.target.value)}
    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
  >
            <option value="all">All Visa Types</option>
            <option value="EU_BLUE_CARD">EU Blue Card</option>
            <option value="EU_CITIZEN">EU Citizen</option>
            <option value="PERMANENT_RESIDENCY">Permanent Residency (PR)</option>
            <option value="WORK_VISA">Work Visa</option>
          </select>

          {
    /* Duplicate Warnings Filter Button */
  }
          <button
    onClick={() => setDuplicateOnly(!duplicateOnly)}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition ${duplicateOnly ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"}`}
  >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Duplicate Alerts Only</span>
          </button>

          {
    /* Overdue Tasks Filter Button */
  }
          <button
    onClick={() => setOverdueOnly(!overdueOnly)}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition ${overdueOnly ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"}`}
  >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Overdue Tasks ({leadsWithOverdue.size})</span>
          </button>
        </div>

        {
    /* Right CTA */
  }
        <div className="flex items-center gap-2">
          <button
    onClick={onOpenCreateLead}
    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
  >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {
    /* Kanban Board Container (Horizontally Scrollable) */
  }
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1750px] items-start">
          {DEFAULT_STAGES.map((stage) => {
    const stageLeads = filteredLeads.filter((l) => l.stageId === stage.id);
    const stats = stageStats[stage.id] || { count: 0, volume: 0 };
    const automation = automations.find((a) => a.brokerageId === currentBrokerage?.id && a.stageId === stage.id);
    return <div
      key={stage.id}
      className="w-80 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col max-h-[calc(100vh-210px)]"
    >
                {
      /* Column Header */
    }
                <div className="p-3.5 border-b border-slate-800/80 flex flex-col gap-1.5 bg-slate-900/90 rounded-t-xl sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                      <h3 className="font-bold text-xs text-white uppercase tracking-wide">{stage.name}</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {stats.count}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Volume:</span>
                    <span className="font-semibold text-slate-200">{formatEuro(stats.volume)}</span>
                  </div>

                  {
      /* Stage Automation Pill */
    }
                  {automation && (automation.sendEmailTemplateId || automation.autoCreateTasks && automation.autoCreateTasks.length > 0) && <div className="mt-1 flex items-center gap-1 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400">
                      <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">
                        Auto: {automation.sendEmailTemplateId ? "Email" : ""}
                        {automation.sendEmailTemplateId && automation.autoCreateTasks.length ? " + " : ""}
                        {automation.autoCreateTasks.length ? `${automation.autoCreateTasks.length} Task(s)` : ""}
                      </span>
                    </div>}
                </div>

                {
      /* Cards List */
    }
                <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
                  {stageLeads.length === 0 ? <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800/70 rounded-lg">
                      No expat leads in this stage
                    </div> : stageLeads.map((lead) => {
      const advisor = users.find((u) => u.id === lead.assignedAdvisorId);
      const isOverdue = leadsWithOverdue.has(lead.id);
      const isDuplicate = lead.duplicateInfo?.isDuplicate;
      return <div
        key={lead.id}
        className={`bg-slate-950 rounded-xl p-3 border transition-all duration-150 hover:border-slate-600 hover:shadow-lg relative group cursor-pointer ${isDuplicate ? "border-amber-500/60 bg-gradient-to-b from-amber-950/20 to-slate-950" : isOverdue ? "border-rose-500/60" : "border-slate-800/90"}`}
        onClick={() => onSelectLead(lead)}
      >
                          {
        /* Duplicate Lead Warning Badge */
      }
                          {isDuplicate && <div className="mb-2 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-start gap-1.5 text-[11px] text-amber-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <div className="leading-tight">
                                <span className="font-bold">Returning Expat Contact!</span>
                                <p className="text-[10px] text-amber-200/80 mt-0.5 line-clamp-2">
                                  {lead.duplicateInfo?.details || "Already known by brokerage."}
                                </p>
                              </div>
                            </div>}

                          {
        /* Overdue Task Alert */
      }
                          {isOverdue && <div className="mb-2 p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center gap-1.5 text-[11px] text-rose-300 font-semibold">
                              <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                              <span>Overdue Task Pending!</span>
                            </div>}

                          {
        /* Top Row: Lead Name & Converted Pill */
      }
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                                {lead.name}
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                {lead.nationality} • {lead.propertyCity}
                              </p>
                            </div>

                            {lead.convertedToClientId ? <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Client</span>
                              </span> : null}
                          </div>

                          {
        /* Financials & Target Property */
      }
                          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                            <div>
                              <span className="text-slate-400 text-[10px] block">Loan Requested</span>
                              <span className="font-bold text-white text-xs">
                                €{lead.requestedLoanAmount.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] block">Net Income</span>
                              <span className="font-semibold text-slate-300">
                                €{lead.monthlyNetIncome.toLocaleString()}/mo
                              </span>
                            </div>
                          </div>

                          {
        /* Tags: Visa & Source */
      }
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            {getVisaBadge(lead.visaStatus)}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 truncate max-w-[130px]">
                              {lead.source}
                            </span>
                            {lead.advisorNotes && lead.advisorNotes.length > 0 && <span
        className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1"
        title={`${lead.advisorNotes.length} advisor note(s) & financial nuances recorded`}
      >
                                <FileText className="w-2.5 h-2.5" />
                                <span>{lead.advisorNotes.length}</span>
                              </span>}
                          </div>

                          {
        /* Bottom Row: Advisor & Stage Mover Controls */
      }
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <img
        src={advisor?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
        alt={advisor?.name}
        className="w-4 h-4 rounded-full object-cover"
      />
                              <span className="truncate max-w-[90px]">{advisor?.name?.split(" ")[0]}</span>
                            </div>

                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              {
        /* One-click Convert Lead to Client if not converted */
      }
                              {!lead.convertedToClientId && <button
        onClick={() => convertLeadToClient(lead.id)}
        title="Turn lead into Client (generates portal access & document checklist)"
        className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 transition"
      >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Convert</span>
                                </button>}

                              {
        /* Stage Selector dropdown */
      }
                              <select
        value={lead.stageId}
        onChange={(e) => moveLeadStage(lead.id, e.target.value)}
        className="bg-slate-900 border border-slate-700/80 rounded px-1.5 py-1 text-[10px] text-slate-300 hover:text-white focus:outline-none"
      >
                                {DEFAULT_STAGES.map((s) => <option key={s.id} value={s.id}>
                                    Move: {s.name}
                                  </option>)}
                              </select>
                            </div>
                          </div>
                        </div>;
    })}
                </div>
              </div>;
  })}
        </div>
      </div>
    </div>;
};
