export const DEFAULT_STAGES = [
  {
    id: "new",
    name: "New Leads",
    order: 1,
    color: "#3B82F6",
    // Blue
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    description: "Fresh inbound inquiries from web forms, ads & booking tools"
  },
  {
    id: "contacted",
    name: "First Consultation",
    order: 2,
    color: "#8B5CF6",
    // Purple
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description: "Initial expat borrowing capacity & German rate check"
  },
  {
    id: "docs_needed",
    name: "Document Collection",
    order: 3,
    color: "#F59E0B",
    // Amber
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description: "Client uploading 15-25 mandatory German bank documents"
  },
  {
    id: "under_review",
    name: "Advisor Pre-Approval",
    order: 4,
    color: "#06B6D4",
    // Cyan
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    description: "Quality audit, SCHUFA score validation & bank dossiers assembly"
  },
  {
    id: "bank_submitted",
    name: "Submitted to Bank",
    order: 5,
    color: "#EC4899",
    // Pink
    badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    description: "Underwriting at German lenders (ING, Commerzbank, DSL Bank, Sparkasse)"
  },
  {
    id: "won",
    name: "Loan Approved & Won",
    order: 6,
    color: "#10B981",
    // Green
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "Bank commitment signed, loan agreement executed & notary ready"
  },
  {
    id: "lost",
    name: "Lost / Disqualified",
    order: 7,
    color: "#64748B",
    // Slate
    badgeBg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    description: "Expat withdrew search, insufficient equity, or probation period failed"
  }
];
export const GERMAN_MORTGAGE_DOC_REQUIREMENTS = [
  {
    code: "doc_passport",
    title: "Valid Passport / ID Card",
    titleDe: "G\xFCltiger Reisepass / Personalausweis",
    category: "identity",
    description: "High-res color scan of photo & signature pages. Must be valid for at least 6 months.",
    required: true
  },
  {
    code: "doc_residence",
    title: "German Residence Permit (EU Blue Card / PR)",
    titleDe: "Elektronischer Aufenthaltstitel (eAT)",
    category: "identity",
    description: "Front and back scan showing work authorization and permit validity dates.",
    required: true
  },
  {
    code: "doc_melde",
    title: "Registration Certificate (Meldebescheinigung)",
    titleDe: "Aktuelle Meldebescheinigung",
    category: "identity",
    description: "B\xFCrgeramt registration certificate issued within the last 3 months.",
    required: true
  },
  {
    code: "doc_payslip_1",
    title: "Payslip (Month 1 - Most Recent)",
    titleDe: "Gehaltsabrechnung (letzter Monat)",
    category: "income",
    description: "Latest official payslip showing net salary, tax deductions, and employer details.",
    required: true
  },
  {
    code: "doc_payslip_2",
    title: "Payslip (Month 2)",
    titleDe: "Gehaltsabrechnung (vorletzter Monat)",
    category: "income",
    description: "Second consecutive payslip.",
    required: true
  },
  {
    code: "doc_payslip_3",
    title: "Payslip (Month 3)",
    titleDe: "Gehaltsabrechnung (vor 3 Monaten)",
    category: "income",
    description: "Third consecutive payslip completing German banks 3-month proof of income rule.",
    required: true
  },
  {
    code: "doc_dec_payslip",
    title: "Previous Year December Payslip",
    titleDe: "Dezember-Gehaltsabrechnung des Vorjahres",
    category: "income",
    description: "Required by German banks to verify annual bonuses and 13th month salary bonuses.",
    required: true
  },
  {
    code: "doc_employment",
    title: "Employment Contract & Probezeit Confirmation",
    titleDe: "Arbeitsvertrag & Best\xE4tigung unbefristetes Arbeitsverh\xE4ltnis",
    category: "income",
    description: "Signed permanent contract confirming probation period (Probezeit) has ended.",
    required: true
  },
  {
    code: "doc_bank_statements",
    title: "Bank Statements (Last 3 Months)",
    titleDe: "Kontoausz\xFCge der letzten 3 Monate",
    category: "income",
    description: "Full checking account statements showing continuous monthly salary inflow.",
    required: true
  },
  {
    code: "doc_schufa",
    title: "SCHUFA Credit Report",
    titleDe: "SCHUFA-Bonit\xE4tsauskunft",
    category: "credit",
    description: "Official SCHUFA score certificate (Score > 95% required for prime bank interest rates).",
    required: true
  },
  {
    code: "doc_equity",
    title: "Proof of Equity (Eigenkapitalnachweis)",
    titleDe: "Eigenkapitalnachweis (Tagesgeld/Depotauszug)",
    category: "credit",
    description: "Proof of at least 10-20% equity plus ancillary closing costs (Grunderwerbsteuer, notary).",
    required: true
  },
  {
    code: "doc_draft_contract",
    title: "Draft Purchase Contract (Kaufvertragsentwurf)",
    titleDe: "Kaufvertragsentwurf vom Notar",
    category: "property",
    description: "Notary draft including purchase price, property parcel description, and closing date.",
    required: true
  },
  {
    code: "doc_grundbuch",
    title: "Land Register Extract (Grundbuchauszug)",
    titleDe: "Aktueller Grundbuchauszug",
    category: "property",
    description: "Official extract from district court (Amtsgericht) not older than 3 months.",
    required: true
  },
  {
    code: "doc_teilung",
    title: "Declaration of Division (Teilungserkl\xE4rung)",
    titleDe: "Teilungserkl\xE4rung mit Aufteilungsplan",
    category: "property",
    description: "For apartments: defines co-ownership shares (Miteigentumsanteile) in building.",
    required: false
  },
  {
    code: "doc_flurkarte",
    title: "Official Cadastral Map (Flurkarte / Lageplan)",
    titleDe: "Amtlicher Lageplan / Flurkarte",
    category: "property",
    description: "Survey map showing exact building boundaries and surrounding plots.",
    required: true
  },
  {
    code: "doc_photos",
    title: "Property Photos (Interior & Exterior)",
    titleDe: "Objektfotos (Innen und Au\xDFen)",
    category: "property",
    description: "At least 4 sharp photos of facade, kitchen, living room, and bathroom.",
    required: true
  }
];
