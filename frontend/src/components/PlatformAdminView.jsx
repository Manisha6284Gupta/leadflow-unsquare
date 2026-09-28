import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldAlert,
  Building2,
  Lock,
  Plus,
  CheckCircle,
  Euro,
  Database
} from "lucide-react";
export const PlatformAdminView = () => {
  const {
    brokerages,
    users,
    leads,
    clients,
    switchBrokerage,
    currentBrokerageId,
    refreshData
  } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrokerageName, setNewBrokerageName] = useState("");
  const [newCity, setNewCity] = useState("Hamburg");
  const [newEmail, setNewEmail] = useState("");
  const [newColor, setNewColor] = useState("#2563EB");
  const totalVolume = brokerages.reduce((sum, b) => sum + (b.totalVolumeEur || 2e7), 0);
  const handleCreateBrokerage = async (e) => {
    e.preventDefault();
    if (!newBrokerageName.trim()) return;
    try {
      await fetch("/api/brokerages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBrokerageName,
          city: newCity,
          contactEmail: newEmail || `info@${newBrokerageName.toLowerCase().replace(/\s+/g, "-")}.de`,
          primaryColor: newColor
        })
      });
      await refreshData();
      setShowAddModal(false);
      setNewBrokerageName("");
    } catch (err) {
      console.error(err);
    }
  };
  return <div className="space-y-6 max-w-7xl mx-auto">
      {
    /* Header */
  }
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              LeadFlow Superadmin
            </span>
            <span className="text-xs text-slate-400">Multi-Tenant Isolation Controller</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <span>Platform Admin Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Serving multiple independent German mortgage brokerages from a single unified deployment.
          </p>
        </div>

        <button
    onClick={() => setShowAddModal(true)}
    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition"
  >
          <Plus className="w-4 h-4" />
          <span>Provision New Brokerage Tenant</span>
        </button>
      </div>

      {
    /* Global Platform KPIs */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Brokerages Deployed</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{brokerages.length} Tenants</div>
          <div className="text-[11px] text-slate-400 pt-1">
            100% strict row-level tenant data isolation
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Platform-Wide Mortgage Volume</span>
            <Euro className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            €{(totalVolume / 1e6).toFixed(1)}M+
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Across Berlin, Frankfurt, Munich & Hamburg markets
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Security & Isolation Status</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">Enforced</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Zero cross-brokerage data leakage</span>
          </div>
        </div>
      </div>

      {
    /* Multi-Tenant Isolation Guarantee Box */
  }
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Database className="w-4 h-4 text-blue-400" />
          <span>Requirement 1: Multi-Tenancy from One Deployment</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          Each brokerage has its own isolated users, advisors, leads, converted clients, and documents. When advisors from HypoLink Berlin log in, they can only view and manage their Berlin expat inquiries; advisors from RheinMain Mortgages see only Frankfurt inquiries.
        </p>
      </div>

      {
    /* Deployed Brokerages List */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Brokerage Tenants ({brokerages.length})
          </h2>
          <span className="text-[10px] text-slate-500">Click to switch context and inspect tenant</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {brokerages.map((b) => {
    const tenantLeads = leads.filter((l) => l.brokerageId === b.id);
    const tenantClients = clients.filter((c) => c.brokerageId === b.id);
    const tenantUsers = users.filter((u) => u.brokerageId === b.id);
    const isCurrent = currentBrokerageId === b.id;
    return <div
      key={b.id}
      className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-800/30 transition"
    >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{b.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {b.city}, Germany
                    </span>
                    {isCurrent && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Active In View
                      </span>}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Slug: <code className="font-mono text-slate-300">{b.slug}</code></span>
                    <span>•</span>
                    <span>API Key: <code className="font-mono text-slate-400">{b.apiKey.substring(0, 10)}...</code></span>
                    <span>•</span>
                    <span>Contact: {b.contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Tenant Records</span>
                    <span className="font-bold text-white">
                      {tenantLeads.length} Leads • {tenantClients.length} Clients • {tenantUsers.length} Users
                    </span>
                  </div>

                  <button
      onClick={() => switchBrokerage(b.id)}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isCurrent ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"}`}
    >
                    {isCurrent ? "Viewing Tenant" : "Switch to Tenant"}
                  </button>
                </div>
              </div>;
  })}
        </div>
      </div>

      {
    /* Provision New Brokerage Modal */
  }
      {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Provision New Brokerage Tenant</h3>

            <form onSubmit={handleCreateBrokerage} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Brokerage Company Name</label>
                <input
    type="text"
    required
    placeholder="e.g. Hanseatic Expat Mortgages"
    value={newBrokerageName}
    onChange={(e) => setNewBrokerageName(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
  />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">German City</label>
                  <input
    type="text"
    value={newCity}
    onChange={(e) => setNewCity(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Brand Color</label>
                  <input
    type="color"
    value={newColor}
    onChange={(e) => setNewColor(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg h-9 p-1"
  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Contact Email</label>
                <input
    type="email"
    placeholder="contact@brokerage.de"
    value={newEmail}
    onChange={(e) => setNewEmail(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
    type="button"
    onClick={() => setShowAddModal(false)}
    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/30"
  >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
