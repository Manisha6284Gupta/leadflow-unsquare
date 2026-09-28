import { useApp } from "../context/AppContext";
import { DEFAULT_STAGES } from "../constants";
import { AdvisorNotesSection } from "./AdvisorNotesSection";
import {
  X,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Euro,
  Sparkles,
  ArrowRight,
  Clock
} from "lucide-react";
export const LeadDetailDrawer = ({
  lead: initialLead,
  onClose,
  onOpenClientPortal
}) => {
  const {
    leads,
    users,
    tasks,
    emailLogs,
    moveLeadStage,
    convertLeadToClient,
    toggleTask,
    clients
  } = useApp();
  if (!initialLead) return null;
  const lead = leads.find((l) => l.id === initialLead.id) || initialLead;
  const advisor = users.find((u) => u.id === lead.assignedAdvisorId);
  const clientCase = clients.find((c) => c.leadId === lead.id || c.id === lead.convertedToClientId);
  const leadTasks = tasks.filter((t) => t.leadId === lead.id);
  const leadEmails = emailLogs.filter((e) => e.leadId === lead.id);
  const ltv = lead.propertyPrice > 0 ? Math.round(lead.requestedLoanAmount / lead.propertyPrice * 100) : 80;
  return <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col text-slate-100 shadow-2xl animate-in slide-in-from-right duration-200">
        {
    /* Header */
  }
        <div className="p-6 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Lead ID: {lead.id}
              </span>
              <span className="text-xs text-slate-400">
                Ingested {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">{lead.name}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
              <span>{lead.nationality} Expat</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">Source: {lead.source}</span>
            </p>
          </div>

          <button
    onClick={onClose}
    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Content Body */
  }
        <div className="p-6 space-y-6 flex-1">
          {
    /* DUPLICATE LEAD DETECTION BANNER */
  }
          {lead.duplicateInfo?.isDuplicate && <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>Known Expat Lead Detected! Duplicate Notice</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {lead.duplicateInfo.details}
              </p>
              <div className="pt-2 border-t border-amber-500/20 text-[11px] grid grid-cols-2 gap-2 text-amber-300/80">
                <div>
                  <span className="text-amber-400 font-semibold">Matched Contact: </span>
                  {lead.duplicateInfo.matchedName} ({lead.duplicateInfo.matchedEmail})
                </div>
                <div>
                  <span className="text-amber-400 font-semibold">Previously Handled By: </span>
                  {lead.duplicateInfo.matchedAdvisorName}
                </div>
              </div>
            </div>}

          {
    /* Turn Lead into Client CTA Box */
  }
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>
                  {clientCase ? "Active Mortgage Client Portal" : "Turn Lead into Client"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {clientCase ? `Case #${clientCase.caseNumber} \u2022 PIN: ${clientCase.accessPin} \u2022 Expat can upload documents` : "Generates client portal credentials and German bank document checklist."}
              </p>
            </div>

            {clientCase ? <button
    onClick={() => {
      if (onOpenClientPortal) onOpenClientPortal(clientCase.id);
    }}
    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition shrink-0"
  >
                <span>Open Client Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button> : <button
    onClick={async () => {
      const newClient = await convertLeadToClient(lead.id);
      if (newClient && onOpenClientPortal) {
        onOpenClientPortal(newClient.id);
      }
    }}
    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition shrink-0"
  >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Convert to Client Now</span>
              </button>}
          </div>

          {
    /* Stage Progression Bar */
  }
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Pipeline Stage: <span className="text-white font-bold">{DEFAULT_STAGES.find((s) => s.id === lead.stageId)?.name}</span>
            </h4>
            <div className="grid grid-cols-4 gap-1.5">
              {DEFAULT_STAGES.slice(0, 6).map((st) => {
    const isActive = lead.stageId === st.id;
    return <button
      key={st.id}
      onClick={() => moveLeadStage(lead.id, st.id)}
      className={`py-2 px-2 rounded-lg text-[11px] font-semibold text-center border transition ${isActive ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800"}`}
    >
                    {st.name}
                  </button>;
  })}
            </div>
          </div>

          {
    /* Expat Financing Profile Details */
  }
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Euro className="w-4 h-4 text-blue-400" />
              <span>German Mortgage Parameters</span>
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Requested Loan</span>
                <span className="text-base font-extrabold text-white">€{lead.requestedLoanAmount.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Property Price</span>
                <span className="text-base font-extrabold text-slate-200">€{lead.propertyPrice.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Down Payment (Equity)</span>
                <span className="text-base font-extrabold text-emerald-400">€{lead.downPayment.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">LTV: {ltv}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Monthly Net Income</span>
                <span className="text-sm font-bold text-slate-200">€{lead.monthlyNetIncome.toLocaleString()}/mo</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Visa & Residency</span>
                <span className="text-xs font-semibold text-indigo-300 block">{lead.visaStatus.replace("_", " ")}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Target Location</span>
                <span className="text-xs font-semibold text-slate-200 block">{lead.propertyCity}</span>
              </div>
            </div>
          </div>

          {
    /* Contact & Advisor assignment */
  }
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expat Contact Details</span>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href={`mailto:${lead.email}`} className="hover:underline truncate">{lead.email}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{lead.propertyCity}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Advisor</span>
              <div className="flex items-center gap-2.5 pt-1">
                <img
    src={advisor?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
    alt={advisor?.name}
    className="w-8 h-8 rounded-full object-cover"
  />
                <div>
                  <span className="font-bold text-white block">{advisor?.name}</span>
                  <span className="text-[10px] text-slate-400 block">{advisor?.jobTitle}</span>
                </div>
              </div>
            </div>
          </div>

          {
    /* Rich-Text Advisor Notes & Expat Financial Nuances */
  }
          <AdvisorNotesSection lead={lead} />

          {
    /* Stage Triggered Tasks for this Lead */
  }
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Automated Stage Tasks ({leadTasks.length})</span>
              </h4>
            </div>

            {leadTasks.length === 0 ? <div className="p-3 text-center text-xs text-slate-500 bg-slate-950 rounded-lg border border-slate-800">
                No active tasks linked to this lead.
              </div> : <div className="space-y-2">
                {leadTasks.map((task) => <div
    key={task.id}
    className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${task.isOverdue && !task.completed ? "bg-rose-500/10 border-rose-500/40 text-rose-200" : task.completed ? "bg-slate-950/60 border-slate-800/60 text-slate-500 line-through" : "bg-slate-950 border-slate-800 text-slate-300"}`}
  >
                    <div className="flex items-start gap-2.5">
                      <input
    type="checkbox"
    checked={task.completed}
    onChange={() => toggleTask(task.id)}
    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
  />
                      <div>
                        <div className="font-semibold text-white">{task.title}</div>
                        {task.description && <div className="text-[11px] text-slate-400 mt-0.5">{task.description}</div>}
                        <div className="text-[10px] text-slate-400 mt-1">
                          Due: {new Date(task.dueDate).toLocaleString()}
                          {task.isOverdue && !task.completed && <span className="ml-2 font-bold text-rose-400 uppercase">🔥 Overdue!</span>}
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>

          {
    /* Email Activity History for this Lead */
  }
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Automated Email Dispatches ({leadEmails.length})</span>
            </h4>

            {leadEmails.length === 0 ? <div className="p-3 text-center text-xs text-slate-500 bg-slate-950 rounded-lg border border-slate-800">
                No emails triggered yet.
              </div> : <div className="space-y-2">
                {leadEmails.map((email) => <div key={email.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span>Template: {email.templateName}</span>
                      <span>{new Date(email.sentAt).toLocaleString()}</span>
                    </div>
                    <div className="font-bold text-white">{email.subject}</div>
                    <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800/80 whitespace-pre-line max-h-24 overflow-y-auto">
                      {email.body}
                    </p>
                  </div>)}
              </div>}
          </div>
        </div>

        {
    /* Footer */
  }
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Assigned: {advisor?.name}
          </span>
          <button
    onClick={onClose}
    className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
  >
            Close
          </button>
        </div>
      </div>
    </div>;
};
