import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  CheckSquare,
  Plus,
  Flame
} from "lucide-react";
export const TaskCenter = () => {
  const {
    tasks,
    leads,
    users,
    toggleTask,
    createTask,
    currentBrokerage
  } = useApp();
  const [filterAdvisor, setFilterAdvisor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAdvisorId, setNewAdvisorId] = useState(users[0]?.id || "");
  const [newDueHours, setNewDueHours] = useState("2");
  const [newPriority, setNewPriority] = useState("urgent");
  const now = Date.now();
  const overdueTasks = tasks.filter((t) => !t.completed && new Date(t.dueDate).getTime() < now);
  const filteredTasks = tasks.filter((t) => {
    if (filterAdvisor !== "all" && t.assignedAdvisorId !== filterAdvisor) return false;
    if (filterStatus === "pending" && t.completed) return false;
    if (filterStatus === "completed" && !t.completed) return false;
    return true;
  });
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const dueDate = new Date(Date.now() + Number(newDueHours) * 3600 * 1e3).toISOString();
    await createTask({
      title: newTitle,
      description: newDescription,
      assignedAdvisorId: newAdvisorId,
      dueDate,
      priority: newPriority
    });
    setNewTitle("");
    setNewDescription("");
    setShowCreateModal(false);
  };
  return <div className="space-y-6 max-w-6xl mx-auto">
      {
    /* Header */
  }
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span>Pipeline Tasks & Speed-to-Lead Operations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated column triggers and follow-up deadlines for {currentBrokerage?.name} advisors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
    value={filterAdvisor}
    onChange={(e) => setFilterAdvisor(e.target.value)}
    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
  >
            <option value="all">All Advisors</option>
            {users.filter((u) => u.brokerageId === currentBrokerage?.id && u.role === "advisor").map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>

          <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
  >
            <option value="all">All Tasks ({tasks.length})</option>
            <option value="pending">Pending ({tasks.filter((t) => !t.completed).length})</option>
            <option value="completed">Completed ({tasks.filter((t) => t.completed).length})</option>
          </select>

          <button
    onClick={() => setShowCreateModal(true)}
    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
  >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {
    /* OVERDUE TASKS CALLOUT SECTION */
  }
      {overdueTasks.length > 0 && <div className="bg-rose-950/20 border-2 border-rose-500/40 rounded-xl p-4 text-rose-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
              <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>Overdue Tasks Attention Required ({overdueTasks.length})</span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">Hot expat lead SLAs breached</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overdueTasks.map((task) => {
    const lead = leads.find((l) => l.id === task.leadId);
    const advisor = users.find((u) => u.id === task.assignedAdvisorId);
    const overdueMins = Math.round((now - new Date(task.dueDate).getTime()) / 6e4);
    return <div
      key={task.id}
      className="bg-slate-950/80 p-3.5 rounded-lg border border-rose-500/40 flex items-start justify-between gap-3 shadow-sm"
    >
                  <div className="flex items-start gap-2.5">
                    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => toggleTask(task.id)}
      className="mt-1 rounded border-rose-500 bg-slate-900 text-rose-600 cursor-pointer"
    />
                    <div>
                      <div className="font-bold text-white text-xs">{task.title}</div>
                      {task.description && <p className="text-[11px] text-rose-200/80 mt-0.5">{task.description}</p>}
                      <div className="mt-1 text-[10px] flex items-center gap-2 text-rose-400 font-semibold">
                        <span>Lead: {lead?.name || "Inbound Expat"}</span>
                        <span>•</span>
                        <span>Advisor: {advisor?.name}</span>
                        <span>•</span>
                        <span className="bg-rose-500/20 px-1.5 py-0.2 rounded text-rose-300">
                          Overdue by {overdueMins > 60 ? `${Math.floor(overdueMins / 60)}h ${overdueMins % 60}m` : `${overdueMins}m`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>;
  })}
          </div>
        </div>}

      {
    /* Main Tasks List */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          Task Tracker ({filteredTasks.length})
        </h2>

        {filteredTasks.length === 0 ? <div className="py-8 text-center text-xs text-slate-500">
            No tasks found matching current filter.
          </div> : <div className="space-y-2">
            {filteredTasks.map((task) => {
    const lead = leads.find((l) => l.id === task.leadId);
    const advisor = users.find((u) => u.id === task.assignedAdvisorId);
    const isOverdue = !task.completed && new Date(task.dueDate).getTime() < now;
    return <div
      key={task.id}
      className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 transition ${task.completed ? "bg-slate-950/40 border-slate-800/60 opacity-60" : isOverdue ? "bg-rose-950/15 border-rose-500/40" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
    >
                  <div className="flex items-start gap-3">
                    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => toggleTask(task.id)}
      className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
    />
                    <div>
                      <div className={`font-semibold ${task.completed ? "line-through text-slate-400" : "text-white"}`}>
                        {task.title}
                      </div>
                      {task.description && <p className="text-[11px] text-slate-400 mt-0.5">{task.description}</p>}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        {lead && <span className="font-semibold text-blue-400">Lead: {lead.name}</span>}
                        <span>•</span>
                        <span>Advisor: {advisor?.name}</span>
                        <span>•</span>
                        {task.stageTriggeredFrom && <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            Auto from: {task.stageTriggeredFrom}
                          </span>}
                        <span>•</span>
                        <span className={isOverdue ? "text-rose-400 font-bold" : ""}>
                          Due: {new Date(task.dueDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {task.completed ? <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Done
                      </span> : isOverdue ? <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                        Overdue
                      </span> : <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        Pending
                      </span>}
                  </div>
                </div>;
  })}
          </div>}
      </div>

      {
    /* Create Task Modal */
  }
      {showCreateModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Create New Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Task Title</label>
                <input
    type="text"
    required
    placeholder="e.g. Call within 2 hours or Request fresh SCHUFA"
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
  />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description (Optional)</label>
                <textarea
    rows={2}
    placeholder="Details for the advisor..."
    value={newDescription}
    onChange={(e) => setNewDescription(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
  />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Assigned Advisor</label>
                  <select
    value={newAdvisorId}
    onChange={(e) => setNewAdvisorId(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
  >
                    {users.filter((u) => u.brokerageId === currentBrokerage?.id && u.role === "advisor").map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Due In</label>
                  <select
    value={newDueHours}
    onChange={(e) => setNewDueHours(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
  >
                    <option value="2">2 Hours (Urgent Hot Lead)</option>
                    <option value="6">6 Hours</option>
                    <option value="24">24 Hours (Next Day)</option>
                    <option value="48">48 Hours (2 Days)</option>
                    <option value="72">3 Days</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
    type="button"
    onClick={() => setShowCreateModal(false)}
    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30"
  >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
