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
  EyeOff
} from "lucide-react";

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
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

  const handleLogin = async (e) => {
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

      // Store auth session
      localStorage.setItem("leadflow_token", data.token);
      localStorage.setItem("leadflow_user", JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoUser = (user) => {
    setEmail(user.email);
    setSelectedBrokerageId(user.brokerageId);
    setPassword("leadflow2026");
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row text-slate-100">
        {/* Left Side: Brand & Context */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-900/60 via-indigo-950/70 to-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-blue-500/30">
                LF
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight text-white">LeadFlow CRM</h2>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                  German Mortgage OS
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Secure multi-tenant authentication protecting sensitive SCHUFA credit reports, salary statements, and passport verifications.
            </p>

            <div className="space-y-2.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Strict multi-tenant brokerage data isolation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Role-based access: Advisor, Admin & Expat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>GDPR & German banking compliance</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
            <span>Demo credentials pre-configured for instant one-click login.</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Sign In</span>
                </h3>
                <p className="text-xs text-slate-400">Enter your credentials or choose a test account below.</p>
              </div>

              {onClose && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advisor@hypolink-berlin.de"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Log In to Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>One-Click Demo Profiles:</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {demoUsers.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectDemoUser(u)}
                    className={`p-2 rounded-lg border text-left transition flex items-center gap-2 ${
                      email === u.email
                        ? "bg-blue-950/60 border-blue-500/60 text-blue-200"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold truncate">{u.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {u.role === "platform_admin" ? "Platform Superadmin" : u.city}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
