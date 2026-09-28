import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Award
} from "lucide-react";

export const TeamManagementAdmin = () => {
  const {
    users,
    leads,
    tasks,
    currentBrokerage,
    refreshData,
    addToast
  } = useApp();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("Expat Mortgage Specialist");
  const [phone, setPhone] = useState("+49 30 84729105");

  const advisors = users.filter(
    (u) => u.brokerageId === currentBrokerage?.id && u.role === "advisor"
  );

  const handleInviteAdvisor = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role: "advisor",
          brokerageId: currentBrokerage.id,
          jobTitle,
          phone
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await refreshData();
      setShowInviteModal(false);
      setName("");
      setEmail("");
      addToast("success", "Advisor Account Created", `${name} can now log in and manage mortgage leads.`);
    } catch (err) {
      console.error(err);
      addToast("error", "Invite Failed", String(err));
    }
  };

  const handleRemoveAdvisor = async (advisorId) => {
    try {
      const res = await fetch(`/api/users/${advisorId}`, { method: "DELETE" });
      if (res.ok) {
        await refreshData();
        addToast("info", "Advisor Account Removed", "Access revoked.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              Role 2 • Brokerage Admin
            </span>
            <span className="text-xs text-slate-400">Team Management</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Mortgage Advisor Team & Quotas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Invite, configure permissions, and monitor advisory caseloads for {currentBrokerage?.name}.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Mortgage Advisor</span>
        </button>
      </div>

      {/* Advisory Team Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advisors.map((adv) => {
          const advLeads = leads.filter((l) => l.assignedAdvisorId === adv.id);
          const advTasks = tasks.filter((t) => t.assignedAdvisorId === adv.id);
          const pendingTasks = advTasks.filter((t) => !t.completed);
          const activeLoanVolume = advLeads.reduce((s, l) => s + (l.requestedLoanAmount || 0), 0);

          return (
            <div
              key={adv.id}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={adv.avatar}
                      alt={adv.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">{adv.name}</h3>
                      <span className="text-[11px] text-blue-300 font-medium">{adv.jobTitle}</span>
                    </div>
                  </div>

                  {adv.id !== "usr-marcus-weber" && (
                    <button
                      onClick={() => handleRemoveAdvisor(adv.id)}
                      title="Remove Advisor"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{adv.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{adv.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Assigned Leads</span>
                    <span className="font-bold text-white text-sm">{advLeads.length} Expats</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Pending Tasks</span>
                    <span className="font-bold text-amber-400 text-sm">{pendingTasks.length} Tasks</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Active Pipeline:</span>
                <span className="font-bold text-emerald-400">€{(activeLoanVolume / 1e3).toFixed(0)}k Volume</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              <span>Invite Mortgage Advisor to {currentBrokerage?.name}</span>
            </h3>

            <form onSubmit={handleInviteAdvisor} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Advisor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christian Becker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="christian@hypolink-berlin.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Direct Phone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30"
                >
                  Grant Advisor Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
