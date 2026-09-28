import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Webhook,
  Copy,
  Check,
  Send,
  Sparkles,
  AlertTriangle,
  Terminal,
  Zap
} from "lucide-react";
export const WebhookStudio = () => {
  const {
    currentBrokerage,
    webhookLogs,
    sendWebhookPayload
  } = useApp();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [customName, setCustomName] = useState("Oliver Smith");
  const [customEmail, setCustomEmail] = useState("oliver.smith@amazon.de");
  const [customPhone, setCustomPhone] = useState("+49 176 55443322");
  const [customIncome, setCustomIncome] = useState("6800");
  const [customPrice, setCustomPrice] = useState("580000");
  const [customEquity, setCustomEquity] = useState("120000");
  const [customCity, setCustomCity] = useState("Berlin (Prenzlauer Berg)");
  const [customNationality, setCustomNationality] = useState("United Kingdom");
  const [customVisa, setCustomVisa] = useState("EU_BLUE_CARD");
  const [customSource, setCustomSource] = useState("Live Web Form");
  const webhookUrl = `${window.location.origin}/api/webhooks/leads/${currentBrokerage?.slug || "hypolink-berlin"}`;
  const curlCommand = `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "${customName}",
    "email": "${customEmail}",
    "phone": "${customPhone}",
    "monthly_net_income": ${customIncome},
    "property_city": "${customCity}",
    "property_price": ${customPrice},
    "down_payment": ${customEquity},
    "requested_loan_amount": ${Number(customPrice) - Number(customEquity)},
    "nationality": "${customNationality}",
    "visa_status": "${customVisa}",
    "source": "${customSource}"
  }'`;
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2e3);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2e3);
    }
  };
  const handleSendTypeformPreset = async () => {
    setIsSending(true);
    const payload = {
      event_id: `evt_tf_${Date.now()}`,
      form_response: {
        definition: { title: "Berlin Expat Mortgage Eligibility Quiz" },
        answers: [
          { field: { title: "What is your Full Name?" }, text: "Maya Patel" },
          { field: { title: "Work Email Address" }, email: `maya.patel_${Math.floor(Math.random() * 900)}@techberlin.io` },
          { field: { title: "Phone Number" }, text: "+49 176 88123490" },
          { field: { title: "Monthly Net Household Income" }, number: 7400 },
          { field: { title: "Target Property City in Germany" }, text: "Berlin (Kreuzberg)" },
          { field: { title: "Expected Purchase Price" }, number: 64e4 },
          { field: { title: "Nationality" }, text: "India" }
        ]
      }
    };
    const res = await sendWebhookPayload("Typeform Expat Quiz", payload);
    setLastResponse(res);
    setIsSending(false);
  };
  const handleSendMetaPreset = async () => {
    setIsSending(true);
    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                leadgen_id: `fb_lead_${Date.now()}`,
                full_name: "Santiago Morales",
                email: `santiago.m_${Math.floor(Math.random() * 900)}@fintech.de`,
                phone_number: "+49 152 44332211",
                city: "Potsdam"
              }
            }
          ]
        }
      ]
    };
    const res = await sendWebhookPayload("Facebook Lead Ads (Meta)", payload);
    setLastResponse(res);
    setIsSending(false);
  };
  const handleSendCalendlyPreset = async () => {
    setIsSending(true);
    const payload = {
      event: "invitee.created",
      payload: {
        name: "Emma Watson-Taylor",
        email: `emma.wt_${Math.floor(Math.random() * 900)}@spotify.com`,
        questions_and_answers: [
          { question: "Loan Amount Needed", response: "\u20AC520,000" },
          { question: "City", response: "Berlin (Mitte)" }
        ]
      }
    };
    const res = await sendWebhookPayload("Calendly 30-min Strategy Call", payload);
    setLastResponse(res);
    setIsSending(false);
  };
  const handleSendDuplicatePreset = async () => {
    setIsSending(true);
    const payload = {
      name: "Priya Sharma",
      // MATCHES EXISTING RECORD
      email: "priya.sharma@zalando.com",
      // MATCHES EXISTING RECORD
      phone: "+49 176 45910283",
      monthly_net_income: 5400,
      property_city: "Berlin (Friedrichshain)",
      property_price: 52e4,
      down_payment: 11e4,
      nationality: "India",
      source: "Partner Link (ImmobilienScout24 Expat Desk)"
    };
    const res = await sendWebhookPayload("Partner Link (ImmobilienScout24)", payload);
    setLastResponse(res);
    setIsSending(false);
  };
  const handleSendCustom = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const payload = {
      name: customName,
      email: customEmail,
      phone: customPhone,
      monthly_net_income: Number(customIncome),
      property_city: customCity,
      property_price: Number(customPrice),
      down_payment: Number(customEquity),
      requested_loan_amount: Number(customPrice) - Number(customEquity),
      nationality: customNationality,
      visa_status: customVisa,
      source: customSource
    };
    const res = await sendWebhookPayload(customSource, payload);
    setLastResponse(res);
    setIsSending(false);
  };
  return <div className="space-y-6 max-w-6xl mx-auto">
      {
    /* Header */
  }
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Webhook className="w-5 h-5 text-blue-400" />
            <span>Real External Tool Lead Ingestion & Webhook Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Receive leads automatically from Typeform, Facebook Ads, Calendly, Zapier, and custom web forms into {currentBrokerage?.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Endpoint Live & Listening</span>
          </span>
        </div>
      </div>

      {
    /* Webhook Endpoint & cURL Box */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Public Webhook Ingestion URL (Plug into Zapier / Typeform / Meta)
          </label>
          <div className="flex items-center gap-2">
            <input
    type="text"
    readOnly
    value={webhookUrl}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none"
  />
            <button
    onClick={() => copyToClipboard(webhookUrl, "url")}
    className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
  >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedUrl ? "Copied URL!" : "Copy URL"}</span>
            </button>
          </div>
        </div>

        {
    /* cURL Command Generator */
  }
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Real Shell / cURL Test Command</span>
            </span>
            <button
    onClick={() => copyToClipboard(curlCommand, "curl")}
    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
  >
              {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCurl ? "Copied cURL!" : "Copy cURL"}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre">
            {curlCommand}
          </pre>
        </div>
      </div>

      {
    /* ONE-CLICK TEST SENDER PRESETS */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>One-Click Simulation Presets (Real Webhook Payloads)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test incoming lead pipelines with authentic payload formats from popular external tools:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {
    /* Preset 1: Typeform */
  }
          <button
    onClick={handleSendTypeformPreset}
    disabled={isSending}
    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/80 text-left transition space-y-1.5 group"
  >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-blue-400 transition">
                1. Typeform Quiz
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Form</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Maya Patel (India) • €640k Kreuzberg Altbau quiz response
            </p>
            <div className="text-[10px] text-blue-400 flex items-center gap-1 font-semibold pt-1">
              <span>Send Typeform Payload</span>
              <Send className="w-2.5 h-2.5" />
            </div>
          </button>

          {
    /* Preset 2: Meta Ads */
  }
          <button
    onClick={handleSendMetaPreset}
    disabled={isSending}
    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/80 text-left transition space-y-1.5 group"
  >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-indigo-400 transition">
                2. Meta Lead Ads
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Facebook</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Santiago Morales • Tech Expat Potsdam campaign
            </p>
            <div className="text-[10px] text-indigo-400 flex items-center gap-1 font-semibold pt-1">
              <span>Send Meta Payload</span>
              <Send className="w-2.5 h-2.5" />
            </div>
          </button>

          {
    /* Preset 3: Calendly */
  }
          <button
    onClick={handleSendCalendlyPreset}
    disabled={isSending}
    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/80 text-left transition space-y-1.5 group"
  >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition">
                3. Calendly Booking
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Booking</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Emma Watson-Taylor • 30-min Expat Strategy Session
            </p>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
              <span>Send Calendly Payload</span>
              <Send className="w-2.5 h-2.5" />
            </div>
          </button>

          {
    /* Preset 4: Duplicate Lead Trigger */
  }
          <button
    onClick={handleSendDuplicatePreset}
    disabled={isSending}
    className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/50 hover:border-amber-400 text-left transition space-y-1.5 group"
  >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-300 group-hover:text-amber-200 transition flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>4. Duplicate Lead Test</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Duplicate</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Priya Sharma again! Tests duplicate alert badge & advisor protection.
            </p>
            <div className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold pt-1">
              <span>Trigger Duplicate Alert</span>
              <Send className="w-2.5 h-2.5" />
            </div>
          </button>
        </div>

        {
    /* Last Ingestion Result Notice */
  }
        {Boolean(lastResponse) && <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="font-bold text-slate-400 block mb-0.5">Webhook Ingestion Server Response:</span>
            <pre className="font-mono text-emerald-400 text-[11px]">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </div>}
      </div>

      {
    /* CUSTOM LEAD INGESTION FORM */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Interactive Lead Ingestion Form (Live Webhook Submitter)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit a custom expat lead right now into the live pipeline:
          </p>
        </div>

        <form onSubmit={handleSendCustom} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Expat Full Name</label>
              <input
    type="text"
    required
    value={customName}
    onChange={(e) => setCustomName(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Email Address</label>
              <input
    type="email"
    required
    value={customEmail}
    onChange={(e) => setCustomEmail(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Phone Number</label>
              <input
    type="text"
    value={customPhone}
    onChange={(e) => setCustomPhone(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Monthly Net Income (€)</label>
              <input
    type="number"
    value={customIncome}
    onChange={(e) => setCustomIncome(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Purchase Price (€)</label>
              <input
    type="number"
    value={customPrice}
    onChange={(e) => setCustomPrice(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Down Payment / Equity (€)</label>
              <input
    type="number"
    value={customEquity}
    onChange={(e) => setCustomEquity(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Target Property City</label>
              <input
    type="text"
    value={customCity}
    onChange={(e) => setCustomCity(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Nationality</label>
              <input
    type="text"
    value={customNationality}
    onChange={(e) => setCustomNationality(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Residency / Visa Status</label>
              <select
    value={customVisa}
    onChange={(e) => setCustomVisa(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  >
                <option value="EU_BLUE_CARD">EU Blue Card</option>
                <option value="EU_CITIZEN">EU Citizen</option>
                <option value="PERMANENT_RESIDENCY">Permanent Residency (PR)</option>
                <option value="WORK_VISA">Work Visa</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Lead Source Tag</label>
              <input
    type="text"
    value={customSource}
    onChange={(e) => setCustomSource(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
    type="submit"
    disabled={isSending}
    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
  >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? "Sending Webhook..." : "Post Lead to Live Pipeline"}</span>
            </button>
          </div>
        </form>
      </div>

      {
    /* WEBHOOK AUDIT LOG */
  }
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Inbound Webhook Execution Log ({webhookLogs.length})
          </h2>
          <span className="text-[10px] text-slate-500">Real-time incoming webhook stream</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Source Tool</th>
              <th className="py-3 px-4">Lead Created</th>
              <th className="py-3 px-4">Ingestion Status</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {webhookLogs.length === 0 ? <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                  No webhooks logged yet. Click any preset above to test real ingestion!
                </td>
              </tr> : webhookLogs.map((log) => <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-semibold text-white">
                    {log.source}
                  </td>
                  <td className="py-3 px-4 text-blue-400">
                    {log.leadName || log.processedLeadId || "Lead record"}
                  </td>
                  <td className="py-3 px-4">
                    {log.status === "success" && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Processed ✓
                      </span>}
                    {log.status === "duplicate_detected" && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Duplicate Flagged</span>
                      </span>}
                    {log.status === "error" && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Failed
                      </span>}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(log.receivedAt).toLocaleString()}
                  </td>
                </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
