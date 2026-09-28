import { useState } from "react";
import { useApp } from "../context/AppContext";
import { DEFAULT_STAGES } from "../constants";
import {
  Zap,
  Mail,
  CheckSquare,
  Plus,
  Trash2,
  Save,
  Sparkles
} from "lucide-react";
export const PipelineAutomationsAdmin = () => {
  const {
    automations,
    templates,
    saveAutomation,
    currentBrokerage
  } = useApp();
  const [activeStageId, setActiveStageId] = useState("new");
  const currentRule = automations.find(
    (a) => a.brokerageId === currentBrokerage?.id && a.stageId === activeStageId
  ) || {
    id: `auto-${activeStageId}`,
    brokerageId: currentBrokerage?.id || "brk-hypolink-berlin",
    stageId: activeStageId,
    emailRecipient: "client",
    autoCreateTasks: []
  };
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    currentRule.sendEmailTemplateId || ""
  );
  const [emailRecipient, setEmailRecipient] = useState(
    currentRule.emailRecipient || "client"
  );
  const [tasksConfig, setTasksConfig] = useState(
    currentRule.autoCreateTasks || []
  );
  const handleStageChange = (stageId) => {
    setActiveStageId(stageId);
    const rule = automations.find(
      (a) => a.brokerageId === currentBrokerage?.id && a.stageId === stageId
    );
    setSelectedTemplateId(rule?.sendEmailTemplateId || "");
    setEmailRecipient(rule?.emailRecipient || "client");
    setTasksConfig(rule?.autoCreateTasks ? [...rule.autoCreateTasks] : []);
  };
  const handleAddTask = () => {
    setTasksConfig([
      ...tasksConfig,
      {
        title: "New stage follow-up task",
        dueInHours: 2,
        priority: "urgent",
        description: "Auto-created when lead enters this pipeline column"
      }
    ]);
  };
  const handleRemoveTask = (index) => {
    setTasksConfig(tasksConfig.filter((_, i) => i !== index));
  };
  const handleTaskChange = (index, field, val) => {
    const next = [...tasksConfig];
    next[index] = { ...next[index], [field]: val };
    setTasksConfig(next);
  };
  const handleSave = async () => {
    await saveAutomation({
      stageId: activeStageId,
      sendEmailTemplateId: selectedTemplateId || void 0,
      emailRecipient,
      autoCreateTasks: tasksConfig
    });
  };
  return <div className="space-y-6 max-w-6xl mx-auto">
      {
    /* Header */
  }
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Pipeline Stage Triggers (Auto-Emails & Tasks)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated actions executed instantaneously when an expat lead enters each pipeline column.
          </p>
        </div>

        <button
    onClick={handleSave}
    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
  >
          <Save className="w-4 h-4" />
          <span>Save Stage Rules</span>
        </button>
      </div>

      {
    /* Stage Selector Tabs */
  }
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {DEFAULT_STAGES.map((stage) => {
    const isActive = activeStageId === stage.id;
    const rule = automations.find(
      (a) => a.brokerageId === currentBrokerage?.id && a.stageId === stage.id
    );
    const hasEmail = Boolean(rule?.sendEmailTemplateId);
    const taskCount = rule?.autoCreateTasks?.length || 0;
    return <button
      key={stage.id}
      onClick={() => handleStageChange(stage.id)}
      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${isActive ? "bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/30" : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/60"}`}
    >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="font-bold text-xs text-white truncate">{stage.name}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                {hasEmail && <span title="Email trigger active">✉️ Email</span>}
                {taskCount > 0 && <span title="Task triggers active">⚡ {taskCount} Task(s)</span>}
                {!hasEmail && taskCount === 0 && <span className="opacity-50">No triggers</span>}
              </div>
            </button>;
  })}
      </div>

      {
    /* Active Stage Automation Config Box */
  }
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Triggers for Column:</span>
              <span className="text-blue-400">{DEFAULT_STAGES.find((s) => s.id === activeStageId)?.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Whenever a lead moves into this stage via drag/drop or external webhook, execute the following:
            </p>
          </div>
        </div>

        {
    /* SECTION 1: Automated Email Trigger */
  }
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>1. Automated Email Dispatch (Requirement 9)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">
                Select Email Template to Send:
              </label>
              <select
    value={selectedTemplateId}
    onChange={(e) => setSelectedTemplateId(e.target.value)}
    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
  >
                <option value="">-- No automated email for this stage --</option>
                {templates.map((t) => <option key={t.id} value={t.id}>
                    {t.name} (Subject: {t.subject})
                  </option>)}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">
                Recipient Target:
              </label>
              <select
    value={emailRecipient}
    onChange={(e) => setEmailRecipient(e.target.value)}
    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
  >
                <option value="client">Client (Expat applicant email)</option>
                <option value="advisor">Assigned Senior Mortgage Advisor</option>
              </select>
            </div>
          </div>

          {selectedTemplateId && <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800/40 text-xs text-blue-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Placeholders (<code>{`{{client_name}}`}</code>, <code>{`{{advisor_name}}`}</code>, <code>{`{{loan_amount}}`}</code>, <code>{`{{portal_url}}`}</code>) will be rendered dynamically with real lead data upon movement.
              </span>
            </div>}
        </div>

        {
    /* SECTION 2: Automated Task Triggers */
  }
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>2. Automated Tasks Generated on Entry (Requirement 10)</span>
            </div>

            <button
    onClick={handleAddTask}
    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1 transition"
  >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task Rule</span>
            </button>
          </div>

          {tasksConfig.length === 0 ? <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
              No tasks currently configured for this stage. Click "Add Task Rule" above to create automated follow-up tasks like "Call within 2 hours".
            </div> : <div className="space-y-3">
              {tasksConfig.map((task, idx) => <div
    key={idx}
    className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
  >
                  <div className="md:col-span-6">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Task Title / Action</label>
                    <input
    type="text"
    value={task.title}
    onChange={(e) => handleTaskChange(idx, "title", e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
    placeholder="e.g. Call within 2 hours (Hot Expat Inbound)"
  />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Due Time Offset</label>
                    <select
    value={task.dueInHours}
    onChange={(e) => handleTaskChange(idx, "dueInHours", Number(e.target.value))}
    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white"
  >
                      <option value="2">In 2 Hours (Urgent Hot Lead)</option>
                      <option value="6">In 6 Hours</option>
                      <option value="24">In 24 Hours (Next Day)</option>
                      <option value="48">In 48 Hours (2 Days)</option>
                      <option value="72">In 72 Hours (3 Days)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Priority</label>
                    <select
    value={task.priority}
    onChange={(e) => handleTaskChange(idx, "priority", e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white"
  >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>

                  <div className="md:col-span-1 flex justify-end pt-3 md:pt-0">
                    <button
    onClick={() => handleRemoveTask(idx)}
    className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
  >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
};
