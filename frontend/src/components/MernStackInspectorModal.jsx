import { useEffect, useState } from "react";
import {
  Database,
  Server,
  Layers,
  Cpu,
  CheckCircle2,
  X,
  RefreshCw,
  HardDrive,
  Copy,
  Check,
  Code2,
  Download
} from "lucide-react";
export const MernStackInspectorModal = ({ onClose }) => {
  const [dbStatus, setDbStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/db/status");
      const json = await res.json();
      if (json.database) {
        setDbStatus(json.database);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStatus();
  }, []);
  const handleCopyUri = () => {
    if (dbStatus?.uri) {
      navigator.clipboard.writeText(dbStatus.uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {
    /* Modal Header */
  }
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                Full-Stack Architecture
              </span>
              <span className="text-xs text-slate-400">Database & Engine Inspector</span>
            </div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>MERN Stack Operating System</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              MongoDB / Mongoose ODM • Express.js API & SSE • React 19 UI • Node.js Runtime
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
    /* 4 Pillars of MERN Stack */
  }
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {
    /* M - MongoDB */
  }
          <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="font-black text-sm">M</span>
              <Database className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">MongoDB</span>
            <span className="text-[10px] text-slate-400 block">
              Mongoose v{dbStatus?.mongooseVersion || "8.x"} BSON collections
            </span>
          </div>

          {
    /* E - Express.js */
  }
          <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-500/30 space-y-1">
            <div className="flex items-center justify-between text-blue-400">
              <span className="font-black text-sm">E</span>
              <Server className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Express.js</span>
            <span className="text-[10px] text-slate-400 block">
              REST, Webhooks & SSE events
            </span>
          </div>

          {
    /* R - React */
  }
          <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/30 space-y-1">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="font-black text-sm">R</span>
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">React 19</span>
            <span className="text-[10px] text-slate-400 block">
              Vite, Hooks, Tailwind CSS
            </span>
          </div>

          {
    /* N - Node.js */
  }
          <div className="bg-slate-950 p-3.5 rounded-xl border border-green-500/30 space-y-1">
            <div className="flex items-center justify-between text-green-400">
              <span className="font-black text-sm">N</span>
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Node.js</span>
            <span className="text-[10px] text-slate-400 block">
              Async OCR queue & workers
            </span>
          </div>
        </div>

        {
    /* MongoDB Connection Status */
  }
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>MongoDB / Mongoose ODM Connection</span>
            </span>

            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>
                {dbStatus?.connected ? "Live MongoDB Connected" : "Mongoose Document Engine Active"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 block">Target Database URI:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <code className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {dbStatus?.uri || "mongodb://localhost:27017/leadflow"}
                </code>
                <button
                  onClick={handleCopyUri}
                  title="Copy URI"
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">Database Engine Mode:</span>
              <span className="font-mono text-[11px] text-white">
                {dbStatus?.connected ? "Live MongoDB Daemon" : "In-Memory Document Engine (Self-Seeded)"}
              </span>
            </div>
          </div>

          {!dbStatus?.connected && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200 leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <span>⚠️ MongoDB Atlas Connection Status:</span>
              </div>
              <p>
                {dbStatus?.connectionError ? (
                  <span>
                    <strong>Atlas Error:</strong> {dbStatus.connectionError}
                  </span>
                ) : (
                  <span>No connection to Atlas.</span>
                )}
              </p>
              <div className="bg-slate-950/80 p-2.5 rounded border border-amber-500/20 text-slate-300 space-y-1">
                <span className="font-semibold text-white block">How to enable data saving directly to MongoDB Atlas:</span>
                <ol className="list-decimal pl-4 space-y-1 text-[10px] text-slate-300">
                  <li>Log in to your <strong>MongoDB Atlas Console</strong>.</li>
                  <li>In the left sidebar, click <strong>Network Access</strong> (under Security).</li>
                  <li>Click <strong>+ Add IP Address</strong>.</li>
                  <li>Click <strong>Allow Access From Anywhere</strong> (<code className="text-amber-400">0.0.0.0/0</code>) and click Confirm.</li>
                </ol>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Once you allow access in Atlas Network Access, the app will instantly connect and automatically populate all your Atlas collections!
                </span>
              </div>
            </div>
          )}
        </div>

        {
    /* MongoDB Collections & Document Counts */
  }
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Active MongoDB Collections & BSON Record Counts
            </span>
            <button
    onClick={fetchStatus}
    className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
  >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Stats</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {dbStatus?.collections && Object.entries(dbStatus.collections).map(([coll, count]) => <div
    key={coll}
    className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between"
  >
                  <span className="font-mono text-[11px] text-slate-400 capitalize">
                    {coll}
                  </span>
                  <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                    {count}
                  </span>
                </div>)}
          </div>
        </div>

        {
    /* Schema Highlights */
  }
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Mongoose Schemas & Subdocuments Configured:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            <code>LeadSchema</code> incorporates embedded subdocuments for <code>AdvisorNoteSchema</code> and <code>DuplicateInfoSchema</code>. Strict indexes ensure high-speed querying across <code>brokerageId</code> for multi-tenant isolation.
          </p>
        </div>

        {
    /* Footer */
  }
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href="/api/download/code?format=zip"
              download="leadflow-mern-project.zip"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project Code (.zip)</span>
            </a>
            <a
              href="/api/download/code?format=tar.gz"
              download="leadflow-mern-project.tar.gz"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.tar.gz</span>
            </a>
          </div>
          <button
    onClick={onClose}
    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
  >
            Close Inspector
          </button>
        </div>
      </div>
    </div>;
};
