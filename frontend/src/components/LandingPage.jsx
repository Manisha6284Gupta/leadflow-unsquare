import { useState, useId } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  Zap,
  Kanban,
  FileCheck2,
  Flame,
  UserCheck,
  Users,
  Euro,
  Send,
  Check,
  ExternalLink,
  Shield,
  AlertTriangle,
  FileText,
  Calculator,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Mail,
  Webhook
} from "lucide-react";

export const LandingPage = ({ onLaunchApp, onSelectLeadInPipeline }) => {
  const {
    brokerages,
    currentBrokerage,
    switchBrokerage,
    switchRole,
    sendWebhookPayload,
    addToast,
    openLoginModal,
    login
  } = useApp();

  // Expat Mortgage Calculator State
  const [targetBrokerageSlug, setTargetBrokerageSlug] = useState(
    currentBrokerage?.slug || "hypolink-berlin"
  );
  const [propertyPrice, setPropertyPrice] = useState(520000);
  const [downPayment, setDownPayment] = useState(110000);
  const [monthlyIncome, setMonthlyIncome] = useState(6500);
  const [propertyCity, setPropertyCity] = useState("Berlin");
  const [visaStatus, setVisaStatus] = useState("EU_BLUE_CARD");
  const [nationality, setNationality] = useState("India");
  const [applicantName, setApplicantName] = useState("Lucas Van Dijk");
  const [applicantEmail, setApplicantEmail] = useState("lucas.vandijk@tech-berlin.de");
  const [applicantPhone, setApplicantPhone] = useState("+49 176 89234150");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const loanAmount = Math.max(0, propertyPrice - downPayment);
  const ltvPercent = propertyPrice > 0 ? Math.round((loanAmount / propertyPrice) * 100) : 0;
  // Estimated German mortgage payment @ 3.6% interest + 2% repayment (~5.6% annuity)
  const estMonthlyRateEur = Math.round((loanAmount * 0.056) / 12);

  const handleCalculateAndSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    const payload = {
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      nationality,
      visa_status: visaStatus,
      property_city: propertyCity,
      property_price: propertyPrice,
      down_payment: downPayment,
      requested_loan_amount: loanAmount,
      monthly_net_income: monthlyIncome,
      source: "Public Expat Web Portal"
    };

    const res = await sendWebhookPayload("Public Expat Web Form", payload, targetBrokerageSlug);
    setIsSubmitting(false);
    setSubmissionResult(res);

    if (res.success) {
      if (res.isDuplicate) {
        addToast(
          "warning",
          "Duplicate Expat Recognized!",
          `${applicantName} already exists in the brokerage CRM. Alert flagged to prevent double-contact.`
        );
      } else {
        addToast(
          "success",
          "Inquiry Ingested into CRM!",
          `${applicantName}'s request for €${loanAmount.toLocaleString()} is now live on the Kanban pipeline.`
        );
      }
    } else {
      addToast("error", "Submission Failed", res.message);
    }
  };

  const scrollToCalculator = () => {
    const el = document.getElementById("expat-calculator-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleRoleSignIn = (role) => {
    if (role === "platform_admin") {
      switchRole("platform_admin");
      login({ id: "usr-platform-admin", name: "Henrik Lindemann", role: "platform_admin", email: "henrik@leadflow-platform.de", jobTitle: "Head of Broker Operations" }, "tok_platform_admin");
    } else if (role === "brokerage_admin") {
      switchRole("brokerage_admin", "brk-hypolink-berlin", "usr-elena-admin");
      login({ id: "usr-elena-admin", name: "Elena Rostova", role: "brokerage_admin", email: "elena@hypolink-berlin.de", brokerageId: "brk-hypolink-berlin", jobTitle: "Managing Director" }, "tok_brokerage_admin");
    } else if (role === "advisor") {
      switchRole("advisor", "brk-hypolink-berlin", "usr-marcus-weber");
      login({ id: "usr-marcus-weber", name: "Marcus Weber", role: "advisor", email: "marcus@hypolink-berlin.de", brokerageId: "brk-hypolink-berlin", jobTitle: "Senior Expat Mortgage Specialist" }, "tok_advisor");
    } else if (role === "client") {
      switchRole("client", "brk-hypolink-berlin", "usr-client-liam");
      login({ id: "usr-client-liam", name: "Liam Davies", role: "client", email: "liam.davies@techcorp.io", brokerageId: "brk-hypolink-berlin", jobTitle: "Senior Software Engineer (Client)" }, "tok_client");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP MARKETING NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">LeadFlow</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  MERN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:block -mt-0.5">
                German Expat Mortgage CRM Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#problem-solution" className="hover:text-white transition">Problem vs Solution</a>
            <a href="#features" className="hover:text-white transition">Platform Features</a>
            <a href="#expat-calculator-section" className="hover:text-white transition flex items-center gap-1">
              <span>Live Expat Intake</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </a>
            <a href="#roles" className="hover:text-white transition">User Roles</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={scrollToCalculator}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-400" />
              <span>Test Expat Form</span>
            </button>

            <button
              onClick={openLoginModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Sign In</span>
            </button>

            <button
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition transform active:scale-95"
            >
              <span>Launch CRM App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/60">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
            <span>Built for Multi-Tenant Mortgage Brokerages in Germany</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Stop losing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">€500k+ expat mortgage deals</span> in spreadsheets.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            One platform deployed for many brokerages. Automatic lead intake from web forms and ads, instant duplicate contact detection, background German bank OCR document checking, and real-time SSE pipeline Kanban.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openLoginModal}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Platform</span>
            </button>

            <button
              onClick={onLaunchApp}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm shadow-lg flex items-center gap-2 transition"
            >
              <span>Explore Live CRM Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToCalculator}
              className="px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-sm flex items-center gap-2 transition"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Test Live Expat Lead Intake Form</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-800/60 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
              <span className="text-xs text-slate-400 block">Architecture</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                Multi-Tenant
              </span>
            </div>
            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
              <span className="text-xs text-slate-400 block">Lead Pipeline</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Live SSE Sync
              </span>
            </div>
            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
              <span className="text-xs text-slate-400 block">Contact Safety</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Anti-Duplicate
              </span>
            </div>
            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
              <span className="text-xs text-slate-400 block">German Banking</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                16 Doc OCR Pre-Check
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION */}
      <section id="problem-solution" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">The Problem & The Fix</span>
          <h2 className="text-3xl font-black text-white mt-1">Why traditional mortgage tools fail expat brokerages</h2>
          <p className="text-sm text-slate-400 mt-2">
            German expat financing is complex: multi-national visa laws, SCHUFA reports, and 15–40 documents per case. Spreadsheets break down immediately.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Today's Chaos */}
          <div className="bg-rose-950/20 border border-rose-500/25 rounded-2xl p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Today: Inboxes & Spreadsheets Chaos</span>
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span><strong>Advisors double-contact the same expat</strong> because leads arrive into multiple email inboxes and Google Sheets simultaneously.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span><strong>Hot €600k+ leads sit untouched for hours</strong> with no automatic reminders or 2-hour speed-to-lead task enforcement.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span><strong>Clients stuck waiting on upload screens</strong> while advisors manually read 35 payslips and Meldebescheinigung documents.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span><strong>Zero visibility across brokerages:</strong> founders cannot sell their platform or see pipeline conversion across branches.</span>
              </li>
            </ul>
          </div>

          {/* LeadFlow Solution */}
          <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>With LeadFlow: Automated High-Speed CRM</span>
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Automatic Duplicate Recognition:</strong> Instant warning badge and advisor assignment lookup the moment a known applicant re-applies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Speed-to-Lead Automation:</strong> Auto-creates "Call within 2 hours" tasks and triggers personalized German stage emails instantaneously.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Async Background OCR Pre-Checking:</strong> Clients never wait on upload screens; background engine checks Sparkasse/ING bank criteria.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>True Multi-Tenant SaaS:</strong> Provision multiple independent brokerages in seconds with complete database isolation.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE EXPAT INTAKE CALCULATOR (REQUIREMENT #2 PROOF) */}
      <section id="expat-calculator-section" className="py-16 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive External Intake Demonstration</span>
            </div>
            <h2 className="text-3xl font-black text-white">Experience Lead Ingestion Live</h2>
            <p className="text-sm text-slate-400 mt-2">
              Fill out this public expat mortgage eligibility form. When you submit, watch it instantly trigger the webhook, check for duplicates, and appear live on the CRM pipeline!
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
            <form onSubmit={handleCalculateAndSubmit} className="space-y-6">
              {/* Target Brokerage Tenant */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Select Destination Brokerage Tenant:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {brokerages.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setTargetBrokerageSlug(b.slug);
                        switchBrokerage(b.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        targetBrokerageSlug === b.slug
                          ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span className="font-bold text-xs block text-white">{b.name}</span>
                      <span className="text-[10px] text-slate-400">{b.city}, Germany</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Sliders & Inputs */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Property Purchase Price
                  </label>
                  <div className="flex items-center gap-1 text-lg font-black text-white">
                    <span>€</span>
                    <input
                      type="number"
                      step="10000"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                      className="bg-transparent w-full font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Down Payment (Equity)
                  </label>
                  <div className="flex items-center gap-1 text-lg font-black text-white">
                    <span>€</span>
                    <input
                      type="number"
                      step="5000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="bg-transparent w-full font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Monthly Net Income
                  </label>
                  <div className="flex items-center gap-1 text-lg font-black text-white">
                    <span>€</span>
                    <input
                      type="number"
                      step="250"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="bg-transparent w-full font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Calculation Pill */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Requested Loan Amount:</span>
                  <span className="text-lg font-black text-white">€{loanAmount.toLocaleString()}</span>
                  <span className="text-[11px] text-blue-300 ml-2 font-medium">({ltvPercent}% LTV)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Est. German Monthly Rate:</span>
                  <span className="text-base font-bold text-emerald-400">~€{estMonthlyRateEur.toLocaleString()}/mo</span>
                </div>
              </div>

              {/* Expat Applicant Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Applicant Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Maya Patel"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. maya.patel@amazon.de"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="+49 176 0000000"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Target Property City
                  </label>
                  <select
                    value={propertyCity}
                    onChange={(e) => setPropertyCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Berlin">Berlin</option>
                    <option value="Frankfurt">Frankfurt am Main</option>
                    <option value="Munich">Munich (München)</option>
                    <option value="Hamburg">Hamburg</option>
                    <option value="Düsseldorf">Düsseldorf</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    German Visa / Residency Status
                  </label>
                  <select
                    value={visaStatus}
                    onChange={(e) => setVisaStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="EU_BLUE_CARD">EU Blue Card (§18g AufenthG)</option>
                    <option value="PERMANENT_RESIDENCY">Niederlassungserlaubnis (PR)</option>
                    <option value="EU_CITIZEN">EU / EEA Citizen</option>
                    <option value="WORK_VISA">Standard Work Visa (§18b)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Home Country / Nationality
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. United Kingdom, India, USA"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Transmitting to Webhook Engine...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Expat Mortgage Application (Webhook Ingestion)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-Time Result Box */}
              {submissionResult && (
                <div
                  className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    submissionResult.success
                      ? submissionResult.isDuplicate
                        ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                        : "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/30 border-rose-500/40 text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {submissionResult.isDuplicate ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-sm">
                        {submissionResult.isDuplicate
                          ? "Returning Expat Contact Identified!"
                          : "Lead Ingested Successfully!"}
                      </p>
                      <p className="text-[11px] opacity-90 mt-0.5">{submissionResult.message}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      switchRole("advisor", targetBrokerageSlug);
                      onLaunchApp();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow transition"
                  >
                    <span>View in Live Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* 5. PLATFORM FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Core Capabilities</span>
          <h2 className="text-3xl font-black text-white mt-1">Engineered for Germany's Expat Mortgage Workflow</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Live SSE Kanban Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time Server-Sent Events update all open advisor screens instantaneously when leads move from New → Contacted → Docs Needed → Won.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Async German Bank OCR Pre-Check</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Checks 16 critical expat documents against Sparkasse and ING criteria (Meldebescheinigung, Probezeit confirmation, SCHUFA validity) in background.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Multi-Tenant Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every brokerage operates in strict data isolation. Advisors and admins only access their respective leads, documents, and email templates.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Speed-to-Lead Triggers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-creates time-sensitive tasks ("Call within 2 hours") the second a lead arrives. Overdue deadlines pulse in red so hot leads never go cold.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Dynamic Email Templates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Brokerage admins configure stage-triggered emails with dynamic placeholders: client name, advisor phone/email, loan amount, and portal URL.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Webhook className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Universal Webhook Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ready-to-use endpoints for Typeform, Meta Lead Ads, Calendly, and Zapier with built-in JSON payload inspector and cURL generator.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FOUR USER ROLES SHOWCASE */}
      <section id="roles" className="py-16 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Role-Based Access Control</span>
            <h2 className="text-3xl font-black text-white mt-1">Four Tailored User Experiences</h2>
            <p className="text-sm text-slate-400 mt-2">
              Every persona gets the exact tools they need with strict permission boundaries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Platform Admin */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition group">
              <div className="space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Role 1 • Super Admin
                </span>
                <h3 className="font-bold text-base text-white">1. Platform Admin</h3>
                <p className="text-xs font-semibold text-purple-300">
                  Core Scope: Platform management & multi-tenant isolation.
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                    <span><strong>Onboarding Brokerages:</strong> Creates & manages tenant accounts.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                    <span><strong>System Health:</strong> Views top-level platform usage metrics across all brokerages.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                    <span><strong>Role/Access Control:</strong> Provisions initial credentials for Brokerage Admins.</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleRoleSignIn("platform_admin")}
                className="mt-5 w-full py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In as Platform Admin →</span>
              </button>
            </div>

            {/* 2. Brokerage Admin */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition group">
              <div className="space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Role 2 • Brokerage Owner
                </span>
                <h3 className="font-bold text-base text-white">2. Brokerage Admin</h3>
                <p className="text-xs font-semibold text-blue-300">
                  Core Scope: Workspace setup, workflow rules & team management.
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    <span><strong>Configuration:</strong> Defines pipeline stages, dynamic email templates & stage triggers.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    <span><strong>Task Triggers:</strong> "Call within 2 hours" auto-assigned upon entering New.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    <span><strong>Team & Performance:</strong> Invites advisors & monitors high-speed dashboard.</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleRoleSignIn("brokerage_admin")}
                className="mt-5 w-full py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In as Broker Admin →</span>
              </button>
            </div>

            {/* 3. Advisor */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition group">
              <div className="space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Role 3 • Mortgage Specialist
                </span>
                <h3 className="font-bold text-base text-white">3. Advisor</h3>
                <p className="text-xs font-semibold text-emerald-300">
                  Core Scope: Lead conversion, live pipeline & document audit.
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Lead Intake & Anti-Duplicate:</strong> Flags returning leads automatically.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Live Kanban Board:</strong> Real-time stage changes, tasks & overdue alerts.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Lead Conversion & Audit:</strong> Generates client login; reviews documents with Pass/Fail.</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleRoleSignIn("advisor")}
                className="mt-5 w-full py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In as Advisor →</span>
              </button>
            </div>

            {/* 4. Client */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/50 transition group">
              <div className="space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Role 4 • Home Buyer / Expat
                </span>
                <h3 className="font-bold text-base text-white">4. Client</h3>
                <p className="text-xs font-semibold text-cyan-300">
                  Core Scope: Case tracking & secure document submission.
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span><strong>Portal Authentication:</strong> Logs in via PIN to view case number & advisor.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span><strong>Non-Blocking Async Uploads:</strong> Uploads 15–40 documents without waiting.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span><strong>Live Status Updates:</strong> Background workers inspect and verify each file.</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleRoleSignIn("client")}
                className="mt-5 w-full py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In as Client Portal →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING TIERS */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Commercial SaaS Plans</span>
          <h2 className="text-3xl font-black text-white mt-1">Scale Your Expat Mortgage Practice</h2>
          <p className="text-sm text-slate-400 mt-2">
            One platform deployed for many brokerages with dedicated tenant quotas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Solo Broker */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solo Broker</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">€249</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400">Perfect for independent boutique advisors in Germany.</p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Up to 3 Advisor accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live SSE Kanban Pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Duplicate Lead Detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Expat Document Portal</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onLaunchApp}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              Start Trial
            </button>
          </div>

          {/* Growth Brokerage (Featured) */}
          <div className="bg-gradient-to-b from-blue-950/40 to-slate-900 border-2 border-blue-500 rounded-2xl p-7 space-y-6 flex flex-col justify-between relative shadow-xl shadow-blue-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-extrabold text-white tracking-wider uppercase">
              Most Popular
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Growth Firm</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">€599</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400">For active expat brokerage teams closing 10+ loans monthly.</p>
              <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Up to 10 Advisor accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Automated Stage Email Triggers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2-Hour Speed-to-Lead Tasks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Universal Webhook Studio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bank OCR Pre-Check Engine</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onLaunchApp}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              Launch Live Demo
            </button>
          </div>

          {/* Enterprise Multi-City */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise Network</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">€1,299</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400">Multi-branch brokerages across Berlin, Frankfurt & Munich.</p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unlimited Advisors & Sub-branches</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Tenant Superadmin Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Custom Sparkasse / ING Underwriting Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dedicated BaFin / §34i Audit Logs</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onLaunchApp}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">LeadFlow MERN</span>
            <span>— German Expat Mortgage CRM Engine</span>
          </div>

          <p className="text-[11px] text-slate-500">
            BaFin & Section 34i GewO aligned advisory processes.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onLaunchApp}
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              Launch Platform →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
