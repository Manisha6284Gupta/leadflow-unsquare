import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  FileCheck2,
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  Check,
  XCircle,
  RefreshCw
} from "lucide-react";
export const DocumentReviewCenter = () => {
  const {
    documents,
    clients,
    reviewDocument,
    currentBrokerage
  } = useApp();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDocs = documents.filter((doc) => {
    if (filterStatus !== "all" && doc.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const client = clients.find((c) => c.id === doc.clientId);
      const matchesTitle = doc.title.toLowerCase().includes(q);
      const matchesClient = client?.name.toLowerCase().includes(q);
      const matchesFile = doc.fileName.toLowerCase().includes(q);
      if (!matchesTitle && !matchesClient && !matchesFile) return false;
    }
    return true;
  });
  return <div className="space-y-6 max-w-7xl mx-auto">
      {
    /* Header */
  }
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-400" />
            <span>Document Review & Bank Readiness Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time German bank underwriting audit for {currentBrokerage?.name} expat cases.
          </p>
        </div>

        {
    /* Filters */
  }
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    placeholder="Search document or client..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
  />
          </div>

          <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
  >
            <option value="all">All Statuses ({documents.length})</option>
            <option value="queued">Queued</option>
            <option value="checking">Checking OCR</option>
            <option value="verified">Verified (Bank-Ready)</option>
            <option value="rejected">Action Required / Rejected</option>
          </select>
        </div>
      </div>

      {
    /* Documents Table */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Client & Case</th>
              <th className="py-3 px-4">Document Title</th>
              <th className="py-3 px-4">Status & Readiness</th>
              <th className="py-3 px-4">Underwriting / OCR Details</th>
              <th className="py-3 px-4">Uploaded</th>
              <th className="py-3 px-4 text-right">Advisor Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredDocs.length === 0 ? <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                  No documents found matching the filter criteria.
                </td>
              </tr> : filteredDocs.map((doc) => {
    const client = clients.find((c) => c.id === doc.clientId);
    return <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{client?.name || "Client"}</div>
                      <div className="text-[10px] text-slate-400">{client?.caseNumber}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{doc.title}</div>
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{doc.fileName}</div>
                    </td>

                    <td className="py-3 px-4">
                      {doc.status === "verified" && <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Bank-Ready ({doc.bankReadinessScore}%)</span>
                        </div>}
                      {doc.status === "checking" && <div className="flex items-center gap-1.5 text-blue-400 font-semibold animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>OCR Checking...</span>
                        </div>}
                      {doc.status === "queued" && <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>In Queue</span>
                        </div>}
                      {doc.status === "rejected" && <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Action Required</span>
                        </div>}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      {doc.failureReason ? <div className="text-rose-300 text-[11px] leading-snug bg-rose-950/30 p-1.5 rounded border border-rose-800/30">
                          {doc.failureReason}
                        </div> : doc.extractedData ? <div className="text-slate-300 text-[10px] space-y-0.5">
                          {doc.extractedData.monthlySalaryEur && <div>Salary: €{doc.extractedData.monthlySalaryEur.toLocaleString()}/mo</div>}
                          {doc.extractedData.employerName && <div>Employer: {doc.extractedData.employerName}</div>}
                          {doc.extractedData.schufaScore && <div>SCHUFA Score: {doc.extractedData.schufaScore}%</div>}
                        </div> : <span className="text-slate-500 text-[10px]">Processing OCR...</span>}
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
      onClick={() => reviewDocument(doc.id, "verified", "Manually verified by senior advisor.", true)}
      title="Override & Approve for Bank Dossier"
      className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 transition"
    >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>

                        <button
      onClick={() => {
        const note = prompt("Enter rejection feedback for client:", "Please upload a clearer scan with all 4 corners visible.");
        if (note) {
          reviewDocument(doc.id, "rejected", note, false);
        }
      }}
      title="Reject and Request Re-upload"
      className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[10px] font-semibold flex items-center gap-1 transition"
    >
                          <XCircle className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>;
  })}
          </tbody>
        </table>
      </div>
    </div>;
};
