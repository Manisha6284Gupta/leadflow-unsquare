import { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Sparkles, User } from "lucide-react";
export const CreateLeadModal = ({ onClose }) => {
  const { createLead, users, currentBrokerage } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+49 176 ");
  const [nationality, setNationality] = useState("India");
  const [visaStatus, setVisaStatus] = useState("EU_BLUE_CARD");
  const [employmentType, setEmploymentType] = useState("PERMANENT_EMPLOYEE");
  const [monthlyNetIncome, setMonthlyNetIncome] = useState("5200");
  const [propertyCity, setPropertyCity] = useState("Berlin (Friedrichshain)");
  const [propertyPrice, setPropertyPrice] = useState("500000");
  const [downPayment, setDownPayment] = useState("100000");
  const [requestedLoanAmount, setRequestedLoanAmount] = useState("400000");
  const [source, setSource] = useState("Advisors Phone Inquiry");
  const [assignedAdvisorId, setAssignedAdvisorId] = useState(
    currentBrokerage?.defaultAdvisorId || users[0]?.id || ""
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePriceChange = (val) => {
    setPropertyPrice(val);
    const p = Number(val) || 0;
    const dp = Number(downPayment) || 0;
    setRequestedLoanAmount(String(Math.max(0, p - dp)));
  };
  const handleEquityChange = (val) => {
    setDownPayment(val);
    const p = Number(propertyPrice) || 0;
    const dp = Number(val) || 0;
    setRequestedLoanAmount(String(Math.max(0, p - dp)));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    await createLead({
      name,
      email,
      phone,
      nationality,
      visaStatus,
      employmentType,
      monthlyNetIncome: Number(monthlyNetIncome),
      propertyCity,
      propertyPrice: Number(propertyPrice),
      downPayment: Number(downPayment),
      requestedLoanAmount: Number(requestedLoanAmount),
      source,
      assignedAdvisorId,
      notes
    });
    setIsSubmitting(false);
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>Register New Inbound Expat Lead</span>
            </h2>
            <p className="text-xs text-slate-400">
              Adds lead directly to {currentBrokerage?.name}'s live pipeline board.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Expat Full Name</label>
              <input
    type="text"
    required
    placeholder="e.g. Liam Davies"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Email Address</label>
              <input
    type="email"
    required
    placeholder="expat@company.io"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
  />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Phone / WhatsApp</label>
              <input
    type="text"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Nationality</label>
              <input
    type="text"
    value={nationality}
    onChange={(e) => setNationality(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Visa / Residency</label>
              <select
    value={visaStatus}
    onChange={(e) => setVisaStatus(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  >
                <option value="EU_BLUE_CARD">EU Blue Card</option>
                <option value="EU_CITIZEN">EU Citizen</option>
                <option value="PERMANENT_RESIDENCY">Permanent (PR)</option>
                <option value="WORK_VISA">Work Visa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Monthly Net Income (€)</label>
              <input
    type="number"
    value={monthlyNetIncome}
    onChange={(e) => setMonthlyNetIncome(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Property Price (€)</label>
              <input
    type="number"
    value={propertyPrice}
    onChange={(e) => handlePriceChange(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Down Payment (€)</label>
              <input
    type="number"
    value={downPayment}
    onChange={(e) => handleEquityChange(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Requested Loan Amount (€)</label>
              <input
    type="number"
    value={requestedLoanAmount}
    onChange={(e) => setRequestedLoanAmount(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Target Property City</label>
              <input
    type="text"
    value={propertyCity}
    onChange={(e) => setPropertyCity(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Lead Source Tag</label>
              <input
    type="text"
    value={source}
    onChange={(e) => setSource(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Assigned Advisor</label>
              <select
    value={assignedAdvisorId}
    onChange={(e) => setAssignedAdvisorId(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  >
                {users.filter((u) => u.brokerageId === currentBrokerage?.id && u.role === "advisor").map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Initial Intake Notes</label>
            <textarea
    rows={2}
    placeholder="e.g. In Germany for 2 years, works at delivery tech startup, wants 15-year fixed loan."
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
  />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
  >
              Cancel
            </button>
            <button
    type="submit"
    disabled={isSubmitting}
    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
  >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? "Registering..." : "Create Lead"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
