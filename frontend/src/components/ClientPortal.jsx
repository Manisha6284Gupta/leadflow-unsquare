import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { GERMAN_MORTGAGE_DOC_REQUIREMENTS } from "../constants";
import {
  UploadCloud,
  AlertCircle,
  Clock,
  CheckCircle,
  ShieldCheck,
  Phone,
  Mail,
  RefreshCw,
  Sparkles
} from "lucide-react";
export const ClientPortal = () => {
  const {
    currentBrokerage,
    clients,
    documents,
    users,
    uploadDocument,
    currentClientCase
  } = useApp();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedReq, setSelectedReq] = useState(null);
  const client = currentClientCase || clients[0];
  const advisor = users.find((u) => u.id === client?.assignedAdvisorId);
  const clientDocs = useMemo(() => {
    if (!client) return [];
    return documents.filter((d) => d.clientId === client.id);
  }, [documents, client]);
  const verifiedCount = clientDocs.filter((d) => d.status === "verified").length;
  const rejectedCount = clientDocs.filter((d) => d.status === "rejected").length;
  const checkingCount = clientDocs.filter((d) => d.status === "checking" || d.status === "queued").length;
  const totalRequired = GERMAN_MORTGAGE_DOC_REQUIREMENTS.length;
  const readinessPercent = Math.round(verifiedCount / totalRequired * 100);
  const categories = [
    { id: "all", label: "All Documents (16)" },
    { id: "identity", label: "1. Identity & Visa" },
    { id: "income", label: "2. Income & Payslips" },
    { id: "credit", label: "3. SCHUFA & Equity" },
    { id: "property", label: "4. Property Dossier" }
  ];
  const filteredRequirements = useMemo(() => {
    if (activeCategory === "all") return GERMAN_MORTGAGE_DOC_REQUIREMENTS;
    return GERMAN_MORTGAGE_DOC_REQUIREMENTS.filter((r) => r.category === activeCategory);
  }, [activeCategory]);
  const handleSimulateBatchUpload = async () => {
    const unuploaded = GERMAN_MORTGAGE_DOC_REQUIREMENTS.filter(
      (r) => !clientDocs.some((d) => d.requirementCode === r.code)
    );
    const batch = unuploaded.slice(0, 4);
    if (batch.length === 0) {
      alert("All checklist documents are already uploaded!");
      return;
    }
    for (const req of batch) {
      await uploadDocument(req.code, `${client?.name.replace(/\s+/g, "_")}_${req.code}.pdf`);
    }
  };
  const getDocForRequirement = (code) => {
    return clientDocs.find((d) => d.requirementCode === code);
  };
  if (!client) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        <p>No active expat client case found. Please convert a lead from the pipeline board first.</p>
      </div>;
  }
  return <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {
    /* Top Banner: Expat Client Case Header */
  }
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 rounded-2xl p-6 border border-blue-500/20 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Mortgage Case: {client.caseNumber}
              </span>
              <span className="text-xs text-slate-400">
                Client PIN: <code className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">{client.accessPin}</code>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Welcome, {client.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              German Home Financing: <span className="font-semibold text-white">€{client.loanAmount.toLocaleString()}</span> for property in <span className="font-semibold text-white">{client.propertyCity}</span>
            </p>
          </div>

          {
    /* Assigned Advisor Mini Card */
  }
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 flex items-center gap-3.5 shadow-md">
            <img
    src={advisor?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
    alt={advisor?.name}
    className="w-11 h-11 rounded-full object-cover border border-blue-400"
  />
            <div className="text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Mortgage Advisor</span>
              <span className="font-bold text-white block text-sm">{advisor?.name}</span>
              <div className="flex items-center gap-2 text-slate-300 mt-1">
                <a href={`mailto:${advisor?.email}`} className="hover:text-blue-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-400" />
                  <span>Email</span>
                </a>
                <span>•</span>
                <a href={`tel:${advisor?.phone}`} className="hover:text-emerald-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {
    /* Live Bank Readiness Progress Bar */
  }
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>German Bank Underwriting Readiness:</span>
              <span className="text-emerald-400 font-extrabold">{readinessPercent}% Ready</span>
            </span>
            <span className="text-slate-400">
              {verifiedCount} Verified • {checkingCount} Checking in Background • {rejectedCount} Need Attention
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 flex">
            <div
    className="bg-emerald-500 transition-all duration-500 ease-out"
    style={{ width: `${verifiedCount / totalRequired * 100}%` }}
    title="Verified documents"
  />
            <div
    className="bg-blue-500 animate-pulse transition-all duration-500 ease-out"
    style={{ width: `${checkingCount / totalRequired * 100}%` }}
    title="Checking in background"
  />
            <div
    className="bg-rose-500 transition-all duration-500 ease-out"
    style={{ width: `${rejectedCount / totalRequired * 100}%` }}
    title="Action required"
  />
          </div>
        </div>
      </div>

      {
    /* Non-blocking Notice & Batch Uploader CTA */
  }
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <Clock className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong className="text-white">Asynchronous Document Processing:</strong> Upload your files and proceed freely. Our background system checks payslips, SCHUFA, and ID compliance without freezing or blocking your screen.
          </span>
        </div>

        <button
    onClick={handleSimulateBatchUpload}
    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition shrink-0"
  >
          <Sparkles className="w-4 h-4" />
          <span>Batch Upload Next 4 Docs (Demo)</span>
        </button>
      </div>

      {
    /* Category Tabs */
  }
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {categories.map((cat) => <button
    key={cat.id}
    onClick={() => setActiveCategory(cat.id)}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeCategory === cat.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
  >
            {cat.label}
          </button>)}
      </div>

      {
    /* Document Checklist Items List */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequirements.map((req) => {
    const doc = getDocForRequirement(req.code);
    return <div
      key={req.code}
      className={`rounded-xl border p-4 transition-all duration-200 bg-slate-900/70 flex flex-col justify-between ${doc?.status === "verified" ? "border-emerald-500/40 bg-gradient-to-br from-emerald-950/10 to-slate-900" : doc?.status === "rejected" ? "border-rose-500/50 bg-gradient-to-br from-rose-950/15 to-slate-900" : doc?.status === "checking" ? "border-blue-500/50 bg-gradient-to-br from-blue-950/15 to-slate-900" : doc?.status === "queued" ? "border-indigo-500/40" : "border-slate-800 hover:border-slate-700"}`}
    >
              <div>
                {
      /* Header Row */
    }
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{req.title}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{req.titleDe}</p>
                  </div>

                  {
      /* Status Badge */
    }
                  <div>
                    {!doc && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        Missing
                      </span>}
                    {doc?.status === "queued" && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span>Queued</span>
                      </span>}
                    {doc?.status === "checking" && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>OCR Checking...</span>
                      </span>}
                    {doc?.status === "verified" && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Bank-Ready ({doc.bankReadinessScore}%)</span>
                      </span>}
                    {doc?.status === "rejected" && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Action Required</span>
                      </span>}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {req.description}
                </p>

                {
      /* If document uploaded, show details */
    }
                {doc && <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-mono text-[11px] truncate max-w-[240px]">{doc.fileName}</span>
                      <span className="text-[10px] text-slate-500">{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                    </div>

                    {
      /* Progress Bar for Checking */
    }
                    {(doc.status === "checking" || doc.status === "queued") && <div className="space-y-1 pt-1">
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-500 h-1.5 rounded-full w-2/3 animate-pulse" />
                        </div>
                        <span className="text-[10px] text-blue-400 block">
                          Simulating German bank OCR validation & date verification (Takes ~5-8s)...
                        </span>
                      </div>}

                    {
      /* Extracted Data Preview for Verified Docs */
    }
                    {doc.status === "verified" && doc.extractedData && <div className="pt-1 text-[11px] text-emerald-400/90 grid grid-cols-2 gap-1 border-t border-slate-800/60">
                        {doc.extractedData.monthlySalaryEur && <span>Salary: €{doc.extractedData.monthlySalaryEur.toLocaleString()}</span>}
                        {doc.extractedData.schufaScore && <span>SCHUFA: {doc.extractedData.schufaScore}%</span>}
                        {doc.extractedData.passportValidUntil && <span>Expires: {doc.extractedData.passportValidUntil}</span>}
                        {doc.extractedData.addressVerified && <span>Address: Confirmed ✓</span>}
                      </div>}

                    {
      /* Rejection / Failure Reason */
    }
                    {doc.status === "rejected" && doc.failureReason && <div className="p-2 rounded bg-rose-950/30 border border-rose-800/40 text-[11px] text-rose-300 leading-snug">
                        <strong>Bank Notice: </strong> {doc.failureReason}
                      </div>}
                  </div>}
              </div>

              {
      /* Upload Actions */
    }
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {req.required ? "Mandatory for German Banks" : "Optional / If Applicable"}
                </span>

                <div className="flex items-center gap-2">
                  <button
      onClick={() => {
        uploadDocument(
          req.code,
          `${client.name.replace(/\s+/g, "_")}_${req.code}_valid.pdf`
        );
      }}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${doc?.status === "verified" ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : doc?.status === "rejected" ? "bg-rose-600 hover:bg-rose-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"}`}
    >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{doc ? doc.status === "rejected" ? "Re-Upload Fix" : "Upload New" : "Upload File"}</span>
                  </button>
                </div>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
