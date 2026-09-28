import { useApp } from "../context/AppContext";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";
export const ToastContainer = () => {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;
  return <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
    return <div
      key={toast.id}
      className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom duration-200 ${toast.type === "success" ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200" : toast.type === "error" ? "bg-rose-950/90 border-rose-500/50 text-rose-200" : toast.type === "warning" ? "bg-amber-950/90 border-amber-500/50 text-amber-200" : "bg-slate-900/90 border-blue-500/50 text-blue-200"}`}
    >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {toast.type === "error" && <XCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-blue-400" />}
            </div>

            <div className="flex-1 text-xs">
              <h4 className="font-bold text-white text-xs">{toast.title}</h4>
              <p className="mt-0.5 opacity-90 leading-snug">{toast.message}</p>
            </div>

            <button
      onClick={() => dismissToast(toast.id)}
      className="shrink-0 text-slate-400 hover:text-white"
    >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>;
  })}
    </div>;
};
