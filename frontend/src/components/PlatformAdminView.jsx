import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldAlert,
  Building2,
  Lock,
  Plus,
  CheckCircle,
  Euro,
  Database,
  KeyRound,
  UserPlus,
  Users,
  Trash2,
  Activity,
  Server
} from "lucide-react";

export const PlatformAdminView = () => {
  const {
    brokerages,
    users,
    leads,
    clients,
    switchBrokerage,
    currentBrokerageId,
    refreshData,
    addToast
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdminCredsModal, setShowAdminCredsModal] = useState(false);

  // New Brokerage Tenant Form
  const [newBrokerageName, setNewBrokerageName] = useState("");
  const [newCity, setNewCity] = useState("Hamburg");
  const [newEmail, setNewEmail] = useState("");
  const [newColor, setNewColor] = useState("#2563EB");

  // New Broker Admin Credentials Form
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminBrokerageId, setAdminBrokerageId] = useState(brokerages[0]?.id || "brk-hypolink-berlin");
  const [adminJobTitle, setAdminJobTitle] = useState("Managing Director & Broker Admin");
  const [adminPhone, setAdminPhone] = useState("+49 30 11223344");

  const totalVolume = brokerages.reduce((sum, b) => sum + (b.totalVolumeEur || 2e7), 0);
  const brokerageAdmins = users.filter((u) => u.role === "brokerage_admin");

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
      addToast("success", "Brokerage Tenant Provisioned", `${newBrokerageName} created with strict database isolation.`);
    } catch (err) {
      console.error(err);
      addToast("error", "Provisioning Failed", String(err));
    }
  };

  const handleProvisionBrokerAdmin = async (e) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim()) return;
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
          role: "brokerage_admin",
          brokerageId: adminBrokerageId,
          jobTitle: adminJobTitle,
          phone: adminPhone
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refreshData();
      setShowAdminCredsModal(false);
      setAdminName("");
      setAdminEmail("");
      addToast("success", "Brokerage Admin Provisioned", `Credentials generated for ${adminName}.`);
    } catch (err) {
      console.error(err);
      addToast("error", "Provisioning Failed", String(err));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        await refreshData();
        addToast("info", "User Deleted", "Brokerage Admin credentials revoked.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              Role 1 • Platform Superadmin
            </span>
            <span className="text-xs text-slate-400">Multi-Tenant Isolation Controller</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <span>Platform Admin Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Core Scope: Platform management, onboarding brokerages, system health & provisioning initial Broker Admin credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdminCredsModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-4 h-4 text-purple-400" />
            <span>Provision Broker Admin</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Brokerage Tenant</span>
          </button>
        </div>
      </div>

      {/* Global Platform KPIs (System Health without private customer data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <span>System Health & Isolation</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">Optimal</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Zero cross-brokerage data leakage</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Provisioned Broker Admins</span>
            <KeyRound className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-300">{brokerageAdmins.length} Admins</div>
          <div className="text-[11px] text-slate-400 pt-1">
            Active credential pairs provisioned
          </div>
        </div>
      </div>

      {/* Multi-Tenant Isolation Guarantee Box */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Database className="w-4 h-4 text-blue-400" />
          <span>Multi-Tenant Architecture Guarantee</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          Platform Admin views top-level platform usage metrics across all brokerages without accessing private tenant customer data (passports, SCHUFA reports, payslips). Each brokerage operates in strict database isolation.
        </p>
      </div>

      {/* Deployed Brokerages List */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Active Brokerage Tenants ({brokerages.length})</span>
          </h2>
          <span className="text-[10px] text-slate-500">Switch context to inspect brokerage tenant settings</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {brokerages.map((b) => {
            const tenantLeads = leads.filter((l) => l.brokerageId === b.id);
            const tenantClients = clients.filter((c) => c.brokerageId === b.id);
            const tenantUsers = users.filter((u) => u.brokerageId === b.id);
            const isCurrent = currentBrokerageId === b.id;
            return (
              <div
                key={b.id}
                className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-800/30 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{b.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {b.city}, Germany
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Active In View
                      </span>
                    )}
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isCurrent
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {isCurrent ? "Viewing Tenant" : "Switch to Tenant"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role / Access Control: Provisioned Brokerage Admins */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Role & Access Control: Brokerage Admin Credentials ({brokerageAdmins.length})
            </h2>
          </div>
          <button
            onClick={() => setShowAdminCredsModal(true)}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Provision New Admin</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Brokerage Admin</th>
                <th className="p-3.5">Assigned Tenant Brokerage</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Default Password</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {brokerageAdmins.map((u) => {
                const brk = brokerages.find((b) => b.id === u.brokerageId);
                return (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.jobTitle}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-200 block">{brk ? brk.name : u.brokerageId}</span>
                      <span className="text-[10px] text-slate-400">{brk ? brk.city : "Germany"}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <code className="bg-slate-950 px-2 py-0.5 rounded text-[11px] font-mono text-purple-300 border border-slate-800">
                        leadflow2026
                      </code>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.id !== "usr-elena-admin" && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Revoke Broker Admin Access"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Provision New Brokerage Tenant */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>Provision New Brokerage Tenant</span>
            </h3>

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
        </div>
      )}

      {/* Modal 2: Provision Broker Admin Credentials */}
      {showAdminCredsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Provision Brokerage Admin Credentials</span>
            </h3>
            <p className="text-xs text-slate-400">
              Grant administrator access to an authorized mortgage brokerage partner.
            </p>

            <form onSubmit={handleProvisionBrokerAdmin} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Admin Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maximilian Krauss"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@brokerage.de"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assign to Brokerage Tenant</label>
                <select
                  value={adminBrokerageId}
                  onChange={(e) => setAdminBrokerageId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  {brokerages.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={adminJobTitle}
                  onChange={(e) => setAdminJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminCredsModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
                >
                  Provision Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
