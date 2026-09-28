import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Mail,
  Plus,
  Edit2,
  Eye,
  Sparkles,
  Save
} from "lucide-react";
export const EmailTemplatesAdmin = () => {
  const {
    templates,
    emailLogs,
    saveTemplate,
    currentBrokerage,
    leads
  } = useApp();
  const [activeTab, setActiveTab] = useState("templates");
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const sampleLead = leads[0] || {
    name: "Priya Sharma",
    propertyCity: "Berlin (Friedrichshain)",
    requestedLoanAmount: 41e4
  };
  const placeholders = [
    { tag: "{{client_name}}", desc: "Expat full name (e.g. Liam Davies)" },
    { tag: "{{advisor_name}}", desc: "Assigned advisor name (e.g. Marcus Weber)" },
    { tag: "{{advisor_email}}", desc: "Advisor direct email" },
    { tag: "{{advisor_phone}}", desc: "Advisor direct phone / WhatsApp" },
    { tag: "{{brokerage_name}}", desc: "Your brokerage company name" },
    { tag: "{{property_city}}", desc: "Target city (e.g. Berlin, Munich)" },
    { tag: "{{loan_amount}}", desc: "Mortgage loan amount requested" },
    { tag: "{{portal_url}}", desc: "Link to client document upload portal" }
  ];
  const handleInsertPlaceholder = (tag) => {
    if (!editingTemplate) return;
    setEditingTemplate((prev) => ({
      ...prev,
      body: (prev?.body || "") + ` ${tag} `
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingTemplate?.name || !editingTemplate?.subject || !editingTemplate?.body) return;
    await saveTemplate(editingTemplate);
    setEditingTemplate(null);
  };
  const renderPreview = (text) => {
    return text.replace(/\{\{client_name\}\}/g, sampleLead.name).replace(/\{\{advisor_name\}\}/g, "Marcus Weber").replace(/\{\{advisor_email\}\}/g, "marcus@hypolink-berlin.de").replace(/\{\{advisor_phone\}\}/g, "+49 30 84729102").replace(/\{\{brokerage_name\}\}/g, currentBrokerage?.name || "LeadFlow").replace(/\{\{property_city\}\}/g, sampleLead.propertyCity).replace(/\{\{loan_amount\}\}/g, `\u20AC${sampleLead.requestedLoanAmount.toLocaleString()}`).replace(/\{\{portal_url\}\}/g, `https://${currentBrokerage?.slug}.leadflow.de/portal/auth`);
  };
  return <div className="space-y-6 max-w-6xl mx-auto">
      {
    /* Header */
  }
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <span>Expat Email Templates & Placeholders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated communication templates for {currentBrokerage?.name} with dynamic merge variables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-xs">
            <button
    onClick={() => setActiveTab("templates")}
    className={`px-3 py-1.5 rounded-md font-semibold transition ${activeTab === "templates" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
  >
              Templates ({templates.length})
            </button>
            <button
    onClick={() => setActiveTab("outbox")}
    className={`px-3 py-1.5 rounded-md font-semibold transition ${activeTab === "outbox" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
  >
              Sent Log ({emailLogs.length})
            </button>
          </div>

          <button
    onClick={() => setEditingTemplate({
      name: "",
      subject: "Your German Mortgage Application - {{brokerage_name}}",
      body: `Hi {{client_name}},

Best regards,
{{advisor_name}}
{{brokerage_name}}`,
      description: "Custom trigger template"
    })}
    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
  >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {activeTab === "templates" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tmpl) => <div
    key={tmpl.id}
    className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
  >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">{tmpl.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tmpl.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {tmpl.id}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 block font-semibold">Subject Line:</span>
                  <p className="font-medium text-slate-200 mt-0.5 truncate">{tmpl.subject}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs max-h-36 overflow-y-auto whitespace-pre-line text-slate-300 leading-relaxed font-sans">
                  {tmpl.body}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Last updated: {new Date(tmpl.updatedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
    onClick={() => {
      setEditingTemplate(tmpl);
      setShowPreview(true);
    }}
    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition"
  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
    onClick={() => setEditingTemplate(tmpl)}
    className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition"
  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>)}
        </div>}

      {activeTab === "outbox" && <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Template & Subject</th>
                <th className="py-3 px-4">Sent Message Content</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {emailLogs.length === 0 ? <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No automated emails sent yet. Move a lead to a pipeline stage to trigger emails!
                  </td>
                </tr> : emailLogs.map((log) => <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{log.recipientName}</div>
                      <div className="text-[10px] text-slate-400">{log.recipientEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-blue-400 text-[11px]">{log.templateName}</div>
                      <div className="text-slate-200 mt-0.5 truncate max-w-xs">{log.subject}</div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 line-clamp-3 whitespace-pre-line">
                        {log.body}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Delivered ✓
                      </span>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>}

      {
    /* Template Editor Modal */
  }
      {editingTemplate && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl w-full space-y-4 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{editingTemplate.id ? "Edit Email Template" : "Create Email Template"}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
    type="button"
    onClick={() => setShowPreview(!showPreview)}
    className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${showPreview ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
  >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? "Hide Live Preview" : "Show Live Preview"}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Template Internal Name</label>
                  <input
    type="text"
    required
    placeholder="e.g. Welcome & Expat Mortgage Guide"
    value={editingTemplate.name || ""}
    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Purpose / Description</label>
                  <input
    type="text"
    placeholder="e.g. Dispatched automatically upon stage entry"
    value={editingTemplate.description || ""}
    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Email Subject</label>
                <input
    type="text"
    required
    placeholder="e.g. Welcome {{client_name}} to {{brokerage_name}}"
    value={editingTemplate.subject || ""}
    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
  />
              </div>

              {
    /* Click-to-insert placeholder tokens */
  }
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">
                  Click to Insert Dynamic Placeholder Tokens:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {placeholders.map((p) => <button
    key={p.tag}
    type="button"
    onClick={() => handleInsertPlaceholder(p.tag)}
    title={p.desc}
    className="px-2 py-1 rounded-md bg-blue-900/40 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-700/50 text-[10px] font-mono transition"
  >
                      {p.tag}
                    </button>)}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Email Body</label>
                <textarea
    rows={8}
    required
    placeholder="Dear {{client_name}}, Welcome to..."
    value={editingTemplate.body || ""}
    onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono text-xs leading-relaxed"
  />
              </div>

              {
    /* Live Preview Panel */
  }
              {showPreview && <div className="p-4 bg-slate-950 rounded-xl border-2 border-blue-500/40 space-y-2">
                  <div className="flex items-center justify-between text-blue-400 font-bold text-xs">
                    <span>Rendered Live Preview (with sample lead: {sampleLead.name})</span>
                    <span className="text-[10px] text-slate-500">Live Client View</span>
                  </div>
                  <div className="text-xs text-white font-semibold">
                    Subject: {renderPreview(editingTemplate.subject || "")}
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-line bg-slate-900 p-3 rounded-lg border border-slate-800 font-sans leading-relaxed">
                    {renderPreview(editingTemplate.body || "")}
                  </div>
                </div>}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
    type="button"
    onClick={() => setEditingTemplate(null)}
    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
  >
                  <Save className="w-4 h-4" />
                  <span>Save Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
