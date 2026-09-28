import { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  ShieldCheck,
  Building2,
  UserCheck,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Compass,
  FileCheck2,
  Kanban,
  UploadCloud
} from "lucide-react";

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState("roles"); // "roles" | "credentials"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("leadflow2026");
  const [selectedBrokerageId, setSelectedBrokerageId] = useState("brk-hypolink-berlin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [demoUsers, setDemoUsers] = useState([]);

  useEffect(() => {
    fetch("/api/auth/demo-users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) {
          setDemoUsers(data.users);
        }
      })
      .catch((err) => console.error("Could not fetch demo users", err));
  }, []);

  if (!isOpen) return null;

  const handleRoleQuickLogin = async (targetEmail, targetBrokerageId) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail.trim(),
          password: "leadflow2026",
          brokerageId: targetBrokerageId
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("leadflow_token", data.token);
      localStorage.setItem("leadflow_user", JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          brokerageId: selectedBrokerageId
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("leadflow_token", data.token);
      localStorage.setItem("leadflow_user", JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const rolesCatalog = [
    {
      role: "platform_admin",
      label: "1. Platform Admin (Super Admin)",
      name: "Henrik Lindemann",
      email: "henrik@leadflow-platform.de",
      brokerageId: "all",
      brokerageName: "Central Platform HQ",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      buttonBg: "hover:border-purple-500/60 hover:bg-purple-950/20",
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      scope: "Platform management & multi-tenant isolation.",
      duties: [
        "Onboarding Brokerages (Creates & manages tenant accounts)",
        "System Health (Views platform usage across all brokerages)",
        "Role/Access Control (Provisions credentials for Brokerage Admins)"
      ]
    },
    {
      role: "brokerage_admin",
      label: "2. Brokerage Admin",
      name: "Elena Rostova",
      email: "elena@hypolink-berlin.de",
      brokerageId: "brk-hypolink-berlin",
      brokerageName: "HypoLink Berlin",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      buttonBg: "hover:border-blue-500/60 hover:bg-blue-950/20",
      icon: <Building2 className="w-5 h-5 text-blue-400" />,
      scope: "Workspace setup, workflow rules & team management.",
      duties: [
        "Defines pipeline stages & column rules",
        "Sets up Email Templates with {{client_name}}, {{advisor_name}}",
        "Sets up Email Triggers & 2-Hour Task Triggers on pipeline columns",
        "Invites & manages Advisor accounts and reviews performance"
      ]
    },
    {
      role: "advisor",
      label: "3. Advisor (Mortgage Specialist)",
      name: "Marcus Weber",
      email: "marcus@hypolink-berlin.de",
      brokerageId: "brk-hypolink-berlin",
      brokerageName: "HypoLink Berlin",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      buttonBg: "hover:border-emerald-500/60 hover:bg-emerald-950/20",
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      scope: "Lead conversion, live pipeline, onboarding & document audit.",
      duties: [
        "Lead Ingestion & Anti-Duplicate Warning alerts",
        "Live Kanban Pipeline management (real-time updates via SSE)",
        "Auto-generated tasks & overdue deadline tracking",
        "Converts Lead to Client (generates buyer portal access)",
        "Reviews 15–40 documents with background Pass/Fail/Pending statuses"
      ]
    },
    {
      role: "client",
      label: "4. Client (Home Buyer / Expat)",
      name: "Liam Davies",
      email: "liam.davies@techcorp.io",
      brokerageId: "brk-hypolink-berlin",
      brokerageName: "HypoLink Berlin Case #DE-BER-2024",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      buttonBg: "hover:border-cyan-500/60 hover:bg-cyan-950/20",
      icon: <User className="w-5 h-5 text-cyan-400" />,
      scope: "Case tracking & non-blocking document submission.",
      duties: [
        "Secure PIN/Credential Authentication into personal mortgage portal",
        "Asynchronous, non-blocking upload of 15–40 German bank files",
        "Live status updates as background workers OCR & verify each file"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Sign In to LeadFlow</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Select Role
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose a role to sign in and experience its dedicated scope and workflows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("roles")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeTab === "roles" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                1-Click Role Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("credentials")}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeTab === "credentials" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Email & Password
              </button>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="m-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: 4 USER ROLES SIGN IN */}
        {activeTab === "roles" && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {rolesCatalog.map((r) => (
                <div
                  key={r.role}
                  className={`bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition group ${r.buttonBg}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          {r.icon}
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${r.badgeColor}`}>
                            {r.label}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">{r.name}</h4>
                          <span className="text-[11px] text-slate-400">{r.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <p className="text-[11px] font-medium text-slate-300 mb-1.5">
                        {r.scope}
                      </p>
                      <ul className="space-y-1 text-[10px] text-slate-400">
                        {r.duties.map((duty, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{duty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleRoleQuickLogin(r.email, r.brokerageId)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition disabled:opacity-50"
                  >
                    <span>Sign In as {r.role === "platform_admin" ? "Platform Superadmin" : r.role === "brokerage_admin" ? "Broker Admin" : r.role === "advisor" ? "Mortgage Advisor" : "Expat Client"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL EMAIL & PASSWORD LOGIN */}
        {activeTab === "credentials" && (
          <div className="p-6 max-w-md mx-auto">
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advisor@hypolink-berlin.de"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brokerage Workspace (Tenant)
                </label>
                <select
                  value={selectedBrokerageId}
                  onChange={(e) => setSelectedBrokerageId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="brk-hypolink-berlin">HypoLink Berlin</option>
                  <option value="brk-rheinmain-frankfurt">RheinMain Expat Mortgages (Frankfurt)</option>
                  <option value="brk-bavaria-munich">Bavaria Expat Financing (Munich)</option>
                  <option value="all">Platform Super Admin (All Brokerages)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>GDPR Compliant • Multi-Tenant Isolation Enforced • German BaFin §34i Ready</span>
          <span className="text-slate-500">Default demo password: <code>leadflow2026</code></span>
        </div>
      </div>
    </div>
  );
};
