import { useState } from "react";
import { useApp } from "../context/AppContext";
import { MernStackInspectorModal } from "./MernStackInspectorModal";
import {
  ShieldAlert,
  Building2,
  UserCheck,
  User,
  Radio,
  RotateCcw,
  Database,
  LogIn,
  LogOut,
  Lock,
  Download,
  Globe
} from "lucide-react";
export const RoleTenantSwitcher = () => {
  const [showMernInspector, setShowMernInspector] = useState(false);
  const {
    currentRole,
    currentBrokerageId,
    currentUserId,
    currentBrokerage,
    currentUser,
    brokerages,
    users,
    switchRole,
    switchBrokerage,
    isSseConnected,
    resetDemoData,
    isAuthenticated,
    openLoginModal,
    logout,
    viewMode,
    setViewMode
  } = useApp();
  const roles = [
    {
      role: "advisor",
      label: "Advisor",
      icon: <UserCheck className="w-4 h-4" />,
      desc: "Pipeline Kanban, lead drawer, tasks & duplicate alerts"
    },
    {
      role: "client",
      label: "Client Portal",
      icon: <User className="w-4 h-4" />,
      desc: "Expat buyer portal: async document upload & live checking"
    },
    {
      role: "brokerage_admin",
      label: "Broker Admin",
      icon: <Building2 className="w-4 h-4" />,
      desc: "Templates, stage automations & webhook keys"
    },
    {
      role: "platform_admin",
      label: "Platform Admin",
      icon: <ShieldAlert className="w-4 h-4" />,
      desc: "Cross-brokerage superadmin & tenant isolation"
    }
  ];
  return <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 text-white sticky top-0 z-40">
      {
    /* Top Bar: Multi-Tenant & Role Simulator */
  }
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80">
        {
    /* Tenant / Brokerage Selector */
  }
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Brokerage Tenant:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            {brokerages.map((b) => <button
    key={b.id}
    onClick={() => switchBrokerage(b.id)}
    className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${currentBrokerageId === b.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"}`}
  >
                <span>{b.name}</span>
                <span className="text-[10px] opacity-75">({b.city})</span>
              </button>)}
          </div>

          {
    /* SSE Live Connection Pill */
  }
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${isSseConnected ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
            <span className="font-mono text-[11px]">
              {isSseConnected ? "SSE Live: Connected" : "Connecting SSE..."}
            </span>
          </div>

          {
    /* MERN Stack Architecture Inspector Button */
  }
          <button
    onClick={() => setShowMernInspector(true)}
    title="Inspect MERN Stack Architecture (MongoDB, Express, React, Node)"
    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/70 hover:text-white transition cursor-pointer shadow-sm"
  >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-[11px] tracking-tight">MERN Stack</span>
          </button>

          <a
            href="/api/download/code?format=zip"
            download="leadflow-mern-project.zip"
            title="Download full project code as .zip (backend, frontend, configs)"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 hover:bg-blue-900/70 hover:text-white transition shadow-sm font-semibold text-[11px]"
          >
            <Download className="w-3 h-3 text-blue-400" />
            <span>Download .zip</span>
          </a>

          <button
            onClick={() => setViewMode(viewMode === "landing" ? "crm" : "landing")}
            title="Switch to Public Marketing & Expat Lead Intake Site"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/70 hover:text-white transition cursor-pointer shadow-sm font-semibold text-[11px]"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === "landing" ? "Open CRM Dashboard" : "Marketing Landing Page"}</span>
          </button>
        </div>

        {
    /* Right side: Quick User Switcher & Reset Sandbox */
  }
        {/* Right side: User Profile, Auth State & Reset Demo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt={currentUser?.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-medium text-slate-200">{currentUser?.name}</span>
            <span className="text-[10px] text-slate-400">({currentUser?.jobTitle})</span>
            {isAuthenticated ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Auth Active</span>
              </span>
            ) : (
              <span className="text-[10px] text-amber-400/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40 ml-1">
                Demo
              </span>
            )}
          </div>

          {isAuthenticated ? (
            <button
              onClick={logout}
              title="Securely log out of workspace"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-medium transition cursor-pointer"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              title="Log in with email and password"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm shadow-blue-600/30 transition cursor-pointer"
            >
              <LogIn className="w-3 h-3 text-white" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm("Reset sandbox data to initial state?")) {
                resetDemoData();
              }
            }}
            title="Reset sandbox leads, tasks and documents"
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {
    /* Main Nav: Brand & Role Switch Tabs */
  }
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {
    /* Brand */
  }
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/20 text-white">
            LF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">LeadFlow</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                DE Mortgage CRM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Multi-Tenant Expat Mortgage Operating System • <span className="text-slate-300 font-semibold">{currentBrokerage?.name}</span>
            </p>
          </div>
        </div>

        {
    /* 4 Roles Switcher Pills */
  }
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 shadow-inner">
          {roles.map((r) => {
    const isActive = currentRole === r.role;
    return <button
      key={r.role}
      onClick={() => switchRole(r.role)}
      className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
    >
                {r.icon}
                <span>{r.label}</span>
                {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded-full" />}
              </button>;
  })}
        </div>
      </div>

      {
    /* MERN Stack Inspector Modal */
  }
      {showMernInspector && <MernStackInspectorModal onClose={() => setShowMernInspector(false)} />}
    </header>;
};
