import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { RoleTenantSwitcher } from "./components/RoleTenantSwitcher";
import { PipelineBoard } from "./components/PipelineBoard";
import { LeadDetailDrawer } from "./components/LeadDetailDrawer";
import { CreateLeadModal } from "./components/CreateLeadModal";
import { ClientPortal } from "./components/ClientPortal";
import { DocumentReviewCenter } from "./components/DocumentReviewCenter";
import { TaskCenter } from "./components/TaskCenter";
import { EmailTemplatesAdmin } from "./components/EmailTemplatesAdmin";
import { PipelineAutomationsAdmin } from "./components/PipelineAutomationsAdmin";
import { WebhookStudio } from "./components/WebhookStudio";
import { DashboardAnalytics } from "./components/DashboardAnalytics";
import { PlatformAdminView } from "./components/PlatformAdminView";
import { ToastContainer } from "./components/ToastContainer";
import { LoginModal } from "./components/LoginModal";
import {
  Kanban,
  FileCheck2,
  CheckSquare,
  TrendingUp,
  Mail,
  Zap,
  Webhook,
  User
} from "lucide-react";
const MainApp = () => {
  const {
    currentRole,
    currentBrokerage,
    leads,
    tasks,
    switchRole,
    isLoginModalOpen,
    closeLoginModal,
    login
  } = useApp();
  const [activeTab, setActiveTab] = useState("pipeline");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false);
  const overdueCount = tasks.filter((t) => t.isOverdue && !t.completed).length;
  return <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {
    /* Top Navbar with Multi-Tenant & Role Switcher */
  }
      <RoleTenantSwitcher />

      {
    /* Secondary Sub-Navbar for Navigation Tabs based on Role */
  }
      {currentRole !== "client" && currentRole !== "platform_admin" && <div className="bg-slate-900 border-b border-slate-800 sticky top-[98px] z-30">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1 py-1.5 text-xs font-semibold">
              <button
    onClick={() => setActiveTab("pipeline")}
    className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === "pipeline" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
                <Kanban className="w-3.5 h-3.5" />
                <span>Live Pipeline ({leads.length})</span>
              </button>

              <button
    onClick={() => setActiveTab("documents")}
    className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === "documents" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Document Review</span>
              </button>

              <button
    onClick={() => setActiveTab("tasks")}
    className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === "tasks" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks</span>
                {overdueCount > 0 && <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                    {overdueCount}
                  </span>}
              </button>

              <button
    onClick={() => setActiveTab("analytics")}
    className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === "analytics" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Pipeline Analytics</span>
              </button>

              {
    /* Brokerage Admin exclusive tabs */
  }
              {currentRole === "brokerage_admin" && <>
                  <div className="h-4 w-px bg-slate-800 mx-1" />

                  <button
    onClick={() => setActiveTab("templates")}
    className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === "templates" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Templates</span>
                  </button>

                  <button
    onClick={() => setActiveTab("automations")}
    className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === "automations" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Stage Triggers</span>
                  </button>

                  <button
    onClick={() => setActiveTab("webhooks")}
    className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === "webhooks" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
                    <Webhook className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Webhook Studio</span>
                  </button>
                </>}
            </div>

            {
    /* Quick Switch to Client Portal View */
  }
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="text-slate-400">Quick Preview:</span>
              <button
    onClick={() => switchRole("client")}
    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition flex items-center gap-1"
  >
                <User className="w-3 h-3 text-blue-400" />
                <span>Client Document Portal</span>
              </button>
            </div>
          </div>
        </div>}

      {
    /* Main Content Body */
  }
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {
    /* Role: Platform Admin */
  }
        {currentRole === "platform_admin" && <PlatformAdminView />}

        {
    /* Role: Client */
  }
        {currentRole === "client" && <ClientPortal />}

        {
    /* Role: Advisor & Brokerage Admin Tabs */
  }
        {currentRole !== "client" && currentRole !== "platform_admin" && <>
            {activeTab === "pipeline" && <PipelineBoard
    onSelectLead={(lead) => setSelectedLead(lead)}
    onOpenCreateLead={() => setShowCreateLeadModal(true)}
  />}

            {activeTab === "documents" && <DocumentReviewCenter />}

            {activeTab === "tasks" && <TaskCenter />}

            {activeTab === "analytics" && <DashboardAnalytics />}

            {activeTab === "templates" && <EmailTemplatesAdmin />}

            {activeTab === "automations" && <PipelineAutomationsAdmin />}

            {activeTab === "webhooks" && <WebhookStudio />}
          </>}
      </main>

      {
    /* Lead Details Drawer */
  }
      {selectedLead && <LeadDetailDrawer
    lead={selectedLead}
    onClose={() => setSelectedLead(null)}
    onOpenClientPortal={() => {
      setSelectedLead(null);
      switchRole("client");
    }}
  />}

      {
    /* Manual Create Lead Modal */
  }
      {showCreateLeadModal && <CreateLeadModal onClose={() => setShowCreateLeadModal(false)} />}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLoginSuccess={(user, token) => login(user, token)}
      />

      {
    /* Real-time Toast Notifications */
  }
      <ToastContainer />
    </div>;
};
export default function App() {
  return <AppProvider>
      <MainApp />
    </AppProvider>;
}
