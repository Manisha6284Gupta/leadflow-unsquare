export const INITIAL_BROKERAGES = [
  {
    id: "brk-hypolink-berlin",
    name: "HypoLink Berlin",
    slug: "hypolink-berlin",
    apiKey: "hlk_live_99f2b8a7c1e5",
    city: "Berlin",
    country: "Germany",
    primaryColor: "#2563EB",
    contactEmail: "hello@hypolink-berlin.de",
    defaultAdvisorId: "usr-marcus-weber",
    createdAt: "2024-01-15T08:00:00.000Z",
    totalVolumeEur: 2485e4
  },
  {
    id: "brk-rheinmain-frankfurt",
    name: "RheinMain Expat Mortgages",
    slug: "rheinmain-mortgages",
    apiKey: "rmm_live_44a1d9e2b0c3",
    city: "Frankfurt",
    country: "Germany",
    primaryColor: "#7C3AED",
    contactEmail: "contact@rheinmain-mortgages.de",
    defaultAdvisorId: "usr-clara-schulz",
    createdAt: "2024-02-01T10:00:00.000Z",
    totalVolumeEur: 182e5
  },
  {
    id: "brk-bavaria-munich",
    name: "Bavaria Expat Financing",
    slug: "bavaria-expat",
    apiKey: "bef_live_12c7d4a9f8e0",
    city: "Munich",
    country: "Germany",
    primaryColor: "#059669",
    contactEmail: "info@bavaria-expat.de",
    defaultAdvisorId: "usr-stefan-bauer",
    createdAt: "2024-02-15T09:30:00.000Z",
    totalVolumeEur: 314e5
  }
];
export const INITIAL_USERS = [
  // Platform Admin
  {
    id: "usr-platform-admin",
    brokerageId: "all",
    name: "Henrik Lindemann",
    email: "henrik@leadflow-platform.de",
    role: "platform_admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    phone: "+49 30 99882200",
    jobTitle: "Head of Broker Operations",
    isOnline: true
  },
  // HypoLink Berlin Users
  {
    id: "usr-elena-admin",
    brokerageId: "brk-hypolink-berlin",
    name: "Elena Rostova",
    email: "elena@hypolink-berlin.de",
    role: "brokerage_admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    phone: "+49 30 84729101",
    jobTitle: "Managing Director & Brokerage Admin",
    isOnline: true
  },
  {
    id: "usr-marcus-weber",
    brokerageId: "brk-hypolink-berlin",
    name: "Marcus Weber",
    email: "marcus@hypolink-berlin.de",
    role: "advisor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    phone: "+49 30 84729102",
    jobTitle: "Senior Expat Mortgage Specialist",
    isOnline: true
  },
  {
    id: "usr-sophie-lang",
    brokerageId: "brk-hypolink-berlin",
    name: "Sophie Lang",
    email: "sophie@hypolink-berlin.de",
    role: "advisor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    phone: "+49 30 84729103",
    jobTitle: "Mortgage Advisor & Blue Card Specialist",
    isOnline: true
  },
  // Client user for HypoLink Berlin
  {
    id: "usr-client-liam",
    brokerageId: "brk-hypolink-berlin",
    name: "Liam Davies",
    email: "liam.davies@techcorp.io",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    phone: "+49 176 89234101",
    jobTitle: "Senior Software Engineer (Client)",
    isOnline: true
  },
  // RheinMain Frankfurt Users
  {
    id: "usr-clara-schulz",
    brokerageId: "brk-rheinmain-frankfurt",
    name: "Clara Schulz",
    email: "clara@rheinmain-mortgages.de",
    role: "brokerage_admin",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    phone: "+49 69 45009100",
    jobTitle: "Principal Financing Partner",
    isOnline: true
  },
  {
    id: "usr-felix-richter",
    brokerageId: "brk-rheinmain-frankfurt",
    name: "Felix Richter",
    email: "felix@rheinmain-mortgages.de",
    role: "advisor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
    phone: "+49 69 45009101",
    jobTitle: "Banking & Expat Loan Advisor",
    isOnline: false
  },
  // Bavaria Munich Users
  {
    id: "usr-stefan-bauer",
    brokerageId: "brk-bavaria-munich",
    name: "Stefan Bauer",
    email: "stefan@bavaria-expat.de",
    role: "brokerage_admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
    phone: "+49 89 22008810",
    jobTitle: "Managing Partner",
    isOnline: true
  },
  {
    id: "usr-lisa-huber",
    brokerageId: "brk-bavaria-munich",
    name: "Lisa Huber",
    email: "lisa@bavaria-expat.de",
    role: "advisor",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250",
    phone: "+49 89 22008812",
    jobTitle: "Senior Expat Mortgage Consultant",
    isOnline: true
  }
];
export const INITIAL_EMAIL_TEMPLATES = [
  {
    id: "tmpl-welcome-new",
    brokerageId: "brk-hypolink-berlin",
    name: "Welcome & Expat Mortgage Guide",
    subject: "Welcome to {{brokerage_name}} - Your German Mortgage Journey in {{property_city}}",
    description: "Triggered when a new lead enters the pipeline via web form or webhook.",
    body: `Hi {{client_name}},

Thank you for requesting mortgage guidance with {{brokerage_name}}.

Buying a property in Germany as an expat comes with specific banking criteria (probation periods, Blue Card tenure, equity requirements, and notarization).

I am {{advisor_name}}, your dedicated senior mortgage advisor. I have reviewed your target purchase in {{property_city}} with a planned loan amount of {{loan_amount}}.

Here is what happens next:
1. We will schedule a 20-minute video consultation to verify your borrowing capacity.
2. We compare conditions across 400+ German lenders (ING, Commerzbank, DSL, Sparkasse).
3. We help you assemble the mandatory German document checklist.

If you have urgent questions, reply directly to this email or call me at {{advisor_phone}}.

Best regards,
{{advisor_name}}
{{brokerage_name}} - Expat Mortgage Team`,
    updatedAt: "2024-03-01T12:00:00.000Z"
  },
  {
    id: "tmpl-consultation-scheduled",
    brokerageId: "brk-hypolink-berlin",
    name: "First Consultation Confirmed",
    subject: "Mortgage Strategy Call Confirmed: {{client_name}} x {{brokerage_name}}",
    description: "Sent when lead moves to First Consultation stage.",
    body: `Hello {{client_name}},

Looking forward to our upcoming mortgage consultation! 

To get the most out of our session, please have the following rough figures in mind:
- Monthly net household income (last 3 months)
- Available liquid equity for down payment & German closing costs (~8-10% of purchase price in Berlin/Brandenburg)
- Visa type (EU Citizen, EU Blue Card, or Permanent Residency)

We will calculate your maximum borrowing limit and present current 10-year and 15-year fixed interest rates.

See you on the call!

Warm regards,
{{advisor_name}}
{{brokerage_name}}`,
    updatedAt: "2024-03-02T10:00:00.000Z"
  },
  {
    id: "tmpl-docs-requested",
    brokerageId: "brk-hypolink-berlin",
    name: "German Document Checklist & Client Portal Access",
    subject: "Important: Document Checklist for your Mortgage Application in {{property_city}}",
    description: "Sent when advisor moves lead to Document Collection stage.",
    body: `Dear {{client_name}},

German banks require strict documentation before underwriting an expat mortgage. We have prepared your secure Client Document Portal:

\u{1F449} Access Portal: {{portal_url}}

Key items required:
\u2022 Last 3 months consecutive payslips (Gehaltsabrechnungen)
\u2022 Passport and Residence Permit / Blue Card (front & back)
\u2022 Meldebescheinigung (< 3 months old)
\u2022 Recent SCHUFA credit report

Our automated document verification system will analyze your files immediately upon upload and highlight any bank readiness issues so your case is 100% bank-ready.

Best regards,
{{advisor_name}}
{{brokerage_name}}`,
    updatedAt: "2024-03-03T15:30:00.000Z"
  },
  {
    id: "tmpl-bank-submitted",
    brokerageId: "brk-hypolink-berlin",
    name: "Application Submitted to German Lenders",
    subject: "Good news! Your mortgage application has been submitted to German Banks",
    description: "Sent when the case moves to Bank Submitted stage.",
    body: `Hello {{client_name}},

Great news! All required documents have been verified and your formal mortgage dossier for {{loan_amount}} in {{property_city}} has been officially submitted to our partner banks.

The bank's credit risk department typically takes 3-5 business days to issue binding loan commitment letters.

We are monitoring the review progress daily and will notify you as soon as the loan contract is ready for signature.

Warm regards,
{{advisor_name}}
{{brokerage_name}}`,
    updatedAt: "2024-03-04T11:00:00.000Z"
  }
];
export const INITIAL_STAGE_AUTOMATIONS = [
  {
    id: "auto-new",
    brokerageId: "brk-hypolink-berlin",
    stageId: "new",
    sendEmailTemplateId: "tmpl-welcome-new",
    emailRecipient: "client",
    autoCreateTasks: [
      {
        title: "Call lead within 2 hours (Hot Expat Inbound)",
        dueInHours: 2,
        priority: "urgent",
        description: "Introduce brokerage, verify EU Blue Card / residency status and target purchase price."
      }
    ]
  },
  {
    id: "auto-contacted",
    brokerageId: "brk-hypolink-berlin",
    stageId: "contacted",
    sendEmailTemplateId: "tmpl-consultation-scheduled",
    emailRecipient: "client",
    autoCreateTasks: [
      {
        title: "Send borrowing capacity calculation & bank rate matrix",
        dueInHours: 24,
        priority: "high",
        description: "Provide personalized 10y vs 15y fixed interest rate comparisons."
      }
    ]
  },
  {
    id: "auto-docs-needed",
    brokerageId: "brk-hypolink-berlin",
    stageId: "docs_needed",
    sendEmailTemplateId: "tmpl-docs-requested",
    emailRecipient: "client",
    autoCreateTasks: [
      {
        title: "Audit 3 months payslips & SCHUFA validity",
        dueInHours: 48,
        priority: "urgent",
        description: "Verify employee is out of Probezeit and SCHUFA certificate is under 60 days old."
      }
    ]
  },
  {
    id: "auto-under-review",
    brokerageId: "brk-hypolink-berlin",
    stageId: "under_review",
    emailRecipient: "advisor",
    autoCreateTasks: [
      {
        title: "Assemble final bank application in Europace / Interhyp portal",
        dueInHours: 24,
        priority: "urgent",
        description: "Submit full property evaluation and expat income dossier."
      }
    ]
  },
  {
    id: "auto-bank-submitted",
    brokerageId: "brk-hypolink-berlin",
    stageId: "bank_submitted",
    sendEmailTemplateId: "tmpl-bank-submitted",
    emailRecipient: "client",
    autoCreateTasks: [
      {
        title: "Follow up with bank credit analyst on loan commitment approval",
        dueInHours: 72,
        priority: "normal",
        description: "Check bank underwriting status for {{client_name}}."
      }
    ]
  },
  {
    id: "auto-won",
    brokerageId: "brk-hypolink-berlin",
    stageId: "won",
    emailRecipient: "client",
    autoCreateTasks: [
      {
        title: "Coordinate Grundschuldbestellung with Notary",
        dueInHours: 48,
        priority: "high",
        description: "Send bank land charge deed to notary for appointment signing."
      }
    ]
  }
];
export const INITIAL_LEADS = [
  {
    id: "lead-101",
    brokerageId: "brk-hypolink-berlin",
    name: "Priya Sharma",
    email: "priya.sharma@zalando.com",
    phone: "+49 176 45910283",
    nationality: "India",
    visaStatus: "EU_BLUE_CARD",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 5200,
    propertyCity: "Berlin (Friedrichshain)",
    propertyPrice: 48e4,
    downPayment: 95e3,
    requestedLoanAmount: 41e4,
    source: "Typeform Expat Calculator",
    stageId: "new",
    assignedAdvisorId: "usr-marcus-weber",
    notes: "Works as Principal Product Manager at Zalando. Has been in Germany for 3 years. Looking at 2-room Altbau.",
    advisorNotes: [
      {
        id: "note-101-1",
        leadId: "lead-101",
        authorId: "usr-marcus-weber",
        authorName: "Marcus Weber",
        authorRole: "Senior Expat Specialist",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        category: "meeting_summary",
        content: `**Initial Video Consultation (30 mins)**:
\u2022 Priya has lived in Berlin for 3 years on an **EU Blue Card** with permanent contract at Zalando.
\u2022 Target: 2-room Altbau in Friedrichshain (~\u20AC480,000 purchase price).
\u2022 Notar & Kaufnebenkosten estimated at ~8.5% (\u20AC40,800).
\u2022 **Action Item**: Verified that probation period (*Probezeit*) concluded 18 months ago, which satisfies ING & Commerzbank requirements.`,
        tags: ["Probezeit Passed", "EU Blue Card", "Altbau"],
        pinned: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1e3).toISOString()
      },
      {
        id: "note-101-2",
        leadId: "lead-101",
        authorId: "usr-marcus-weber",
        authorName: "Marcus Weber",
        authorRole: "Senior Expat Specialist",
        category: "financial_nuance",
        content: `**RSU & Equity Liquidity Nuance**:
\u2022 Base Salary: **\u20AC5,200/mo net** (\u20AC95,000 gross/yr).
\u2022 Receives quarterly vesting Zalando RSUs worth approx **\u20AC16,000/yr**. German lenders like DSL and ING can count up to 60% of past 2 years' vesting towards debt-service ratio (Kapitaldienstf\xE4higkeit).
\u2022 Down payment equity: \u20AC70,000 in Trade Republic portfolio + \u20AC25,000 cash in N26. Advised to transfer cash to checking account prior to bank application.`,
        tags: ["RSU Stocks", "Liquid Equity", "Bank Criteria"],
        pinned: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1e3).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 45 * 60 * 1e3).toISOString(),
    // 45 mins ago (fresh!)
    updatedAt: new Date(Date.now() - 45 * 60 * 1e3).toISOString()
  },
  {
    id: "lead-102",
    brokerageId: "brk-hypolink-berlin",
    name: "Alexandre Dubois",
    email: "alex.dubois@berlin-tech.de",
    phone: "+49 152 98412033",
    nationality: "France",
    visaStatus: "EU_CITIZEN",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 6400,
    propertyCity: "Potsdam",
    propertyPrice: 62e4,
    downPayment: 15e4,
    requestedLoanAmount: 5e5,
    source: "Facebook Ads (Tech Expats)",
    stageId: "new",
    assignedAdvisorId: "usr-sophie-lang",
    notes: "EU Citizen, wants 15-year fixed interest rate. Looking for family home near Griebnitzsee.",
    createdAt: new Date(Date.now() - 110 * 60 * 1e3).toISOString(),
    // 110 mins ago -> overdue task alert soon!
    updatedAt: new Date(Date.now() - 110 * 60 * 1e3).toISOString()
  },
  {
    id: "lead-103",
    brokerageId: "brk-hypolink-berlin",
    name: "Priya Sharma",
    // DUPLICATE DEMO!
    email: "priya.sharma@zalando.com",
    // SAME EMAIL
    phone: "+49 176 45910283",
    nationality: "India",
    visaStatus: "EU_BLUE_CARD",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 5200,
    propertyCity: "Berlin (Prenzlauer Berg)",
    propertyPrice: 53e4,
    downPayment: 1e5,
    requestedLoanAmount: 45e4,
    source: "Partner: Expatica Portal",
    stageId: "new",
    assignedAdvisorId: "usr-marcus-weber",
    duplicateInfo: {
      isDuplicate: true,
      matchType: "email",
      matchedEntityId: "lead-101",
      matchedEntityType: "lead",
      matchedName: "Priya Sharma",
      matchedEmail: "priya.sharma@zalando.com",
      matchedStage: "New Leads",
      matchedAdvisorName: "Marcus Weber",
      matchedDate: new Date(Date.now() - 45 * 60 * 1e3).toISOString(),
      details: "Returning lead! Already enquired 45 minutes ago via Typeform. Prevented second advisor from contacting."
    },
    notes: "Submitted second inquiry with slightly higher property price.",
    createdAt: new Date(Date.now() - 10 * 60 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1e3).toISOString()
  },
  {
    id: "lead-104",
    brokerageId: "brk-hypolink-berlin",
    name: "Liam Davies",
    email: "liam.davies@techcorp.io",
    phone: "+49 176 89234101",
    nationality: "United Kingdom",
    visaStatus: "PERMANENT_RESIDENCY",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 7100,
    propertyCity: "Berlin (Mitte)",
    propertyPrice: 75e4,
    downPayment: 18e4,
    requestedLoanAmount: 6e5,
    source: "Calendly 1-on-1 Booking",
    stageId: "docs_needed",
    assignedAdvisorId: "usr-marcus-weber",
    convertedToClientId: "client-liam-01",
    notes: "Converted to client. Actively uploading 16 required bank documents in the client portal.",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-105",
    brokerageId: "brk-hypolink-berlin",
    name: "Mateo Rossi",
    email: "mateo.rossi@deliveryhero.com",
    phone: "+49 160 33418902",
    nationality: "Italy",
    visaStatus: "EU_CITIZEN",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 4800,
    propertyCity: "Berlin (Kreuzberg)",
    propertyPrice: 42e4,
    downPayment: 85e3,
    requestedLoanAmount: 35e4,
    source: "Typeform Expat Calculator",
    stageId: "contacted",
    assignedAdvisorId: "usr-sophie-lang",
    notes: "First call completed. Borrowing capacity verified up to \u20AC390k. Sending bank comparison.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-106",
    brokerageId: "brk-hypolink-berlin",
    name: "Olga Kowalska",
    email: "olga.kowalska@klarna.de",
    phone: "+49 171 77821903",
    nationality: "Poland",
    visaStatus: "EU_CITIZEN",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 5800,
    propertyCity: "Berlin (Charlottenburg)",
    propertyPrice: 59e4,
    downPayment: 13e4,
    requestedLoanAmount: 48e4,
    source: "Partner: Immobilienscout24 Expat",
    stageId: "under_review",
    assignedAdvisorId: "usr-marcus-weber",
    notes: "All documents collected. Bank packaging ready for ING and Commerzbank submission.",
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-107",
    brokerageId: "brk-hypolink-berlin",
    name: "Chen Wei",
    email: "chen.wei@amazon.de",
    phone: "+49 176 11223344",
    nationality: "China",
    visaStatus: "EU_BLUE_CARD",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 8200,
    propertyCity: "Berlin (Sch\xF6neberg)",
    propertyPrice: 89e4,
    downPayment: 25e4,
    requestedLoanAmount: 67e4,
    source: "Typeform Expat Calculator",
    stageId: "bank_submitted",
    assignedAdvisorId: "usr-marcus-weber",
    notes: "Submitted to DSL Bank and ING. Awaiting final credit risk approval.",
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-108",
    brokerageId: "brk-hypolink-berlin",
    name: "Sarah Jenkins",
    email: "sarah.j@startup-berlin.co",
    phone: "+49 151 44556677",
    nationality: "United States",
    visaStatus: "WORK_VISA",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 6100,
    propertyCity: "Berlin (Neuk\xF6lln)",
    propertyPrice: 51e4,
    downPayment: 11e4,
    requestedLoanAmount: 42e4,
    source: "Facebook Ads (Tech Expats)",
    stageId: "won",
    assignedAdvisorId: "usr-sophie-lang",
    notes: "Loan commitment issued by Commerzbank at 3.65% 10-year fix. Notary date confirmed.",
    createdAt: new Date(Date.now() - 21 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString()
  },
  // RheinMain Frankfurt Leads (different brokerage tenant)
  {
    id: "lead-201",
    brokerageId: "brk-rheinmain-frankfurt",
    name: "Hiroshi Tanaka",
    email: "hiroshi.tanaka@nomura-eu.com",
    phone: "+49 69 99887766",
    nationality: "Japan",
    visaStatus: "PERMANENT_RESIDENCY",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 9500,
    propertyCity: "Frankfurt (Westend)",
    propertyPrice: 92e4,
    downPayment: 25e4,
    requestedLoanAmount: 7e5,
    source: "Calendly VIP Booking",
    stageId: "docs_needed",
    assignedAdvisorId: "usr-clara-schulz",
    notes: "Senior Investment Banker in Frankfurt Westend. Permanent residency established. High liquid assets.",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-202",
    brokerageId: "brk-rheinmain-frankfurt",
    name: "Matteo Bianchi",
    email: "matteo.bianchi@ecb.europa.eu",
    phone: "+49 69 13449911",
    nationality: "Italy",
    visaStatus: "EU_CITIZEN",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 7800,
    propertyCity: "Frankfurt (Sachsenhausen)",
    propertyPrice: 68e4,
    downPayment: 18e4,
    requestedLoanAmount: 52e4,
    source: "Partner: Expat Banking Forum",
    stageId: "contacted",
    assignedAdvisorId: "usr-felix-richter",
    notes: "Principal Economist at European Central Bank (ECB). Looking for family duplex near Schweizer Platz.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-203",
    brokerageId: "brk-rheinmain-frankfurt",
    name: "Priya Nair",
    email: "priya.nair@db-tech.de",
    phone: "+49 69 77881122",
    nationality: "India",
    visaStatus: "EU_BLUE_CARD",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 6200,
    propertyCity: "Frankfurt (Bornheim)",
    propertyPrice: 54e4,
    downPayment: 12e4,
    requestedLoanAmount: 43e4,
    source: "Google Ads (Mortgage Expat)",
    stageId: "new",
    assignedAdvisorId: "usr-clara-schulz",
    notes: "Cloud Architect at Deutsche Bank Frankfurt HQ. In Germany 3 years, Blue Card valid until 2027.",
    createdAt: new Date(Date.now() - 40 * 60 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1e3).toISOString()
  },
  // Bavaria Expat Financing Leads (Munich tenant)
  {
    id: "lead-301",
    brokerageId: "brk-bavaria-munich",
    name: "Carlos Mendez",
    email: "carlos.mendez@bmw-group.com",
    phone: "+49 89 38291044",
    nationality: "Spain",
    visaStatus: "EU_CITIZEN",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 8400,
    propertyCity: "Munich (Schwabing)",
    propertyPrice: 89e4,
    downPayment: 26e4,
    requestedLoanAmount: 65e4,
    source: "Referral: Relocation Agency",
    stageId: "docs_needed",
    assignedAdvisorId: "usr-stefan-bauer",
    notes: "Lead Autonomous Driving Engineer at BMW FIZ Munich. Verified 100% Probezeit completion.",
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-302",
    brokerageId: "brk-bavaria-munich",
    name: "Dr. Anna Lindqvist",
    email: "anna.lindqvist@siemens-health.com",
    phone: "+49 89 63641200",
    nationality: "Sweden",
    visaStatus: "EU_CITIZEN",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 9200,
    propertyCity: "Munich (Bogenhausen)",
    propertyPrice: 115e4,
    downPayment: 35e4,
    requestedLoanAmount: 82e4,
    source: "Calendly VIP Booking",
    stageId: "contacted",
    assignedAdvisorId: "usr-lisa-huber",
    notes: "Senior Director at Siemens Healthineers. High net worth client seeking 15-year fixed loan.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1e3).toISOString()
  },
  {
    id: "lead-303",
    brokerageId: "brk-bavaria-munich",
    name: "Wei Zhang",
    email: "wei.zhang@google.com",
    phone: "+49 89 20304050",
    nationality: "China",
    visaStatus: "EU_BLUE_CARD",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 7500,
    propertyCity: "Munich (Maxvorstadt)",
    propertyPrice: 72e4,
    downPayment: 18e4,
    requestedLoanAmount: 56e4,
    source: "Typeform Inbound",
    stageId: "new",
    assignedAdvisorId: "usr-lisa-huber",
    notes: "Senior Machine Learning Engineer at Google Munich. Blue card valid through 2028, looking for Altbau.",
    createdAt: new Date(Date.now() - 55 * 60 * 1e3).toISOString(),
    updatedAt: new Date(Date.now() - 55 * 60 * 1e3).toISOString()
  }
];
export const INITIAL_CLIENTS = [
  {
    id: "client-liam-01",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-104",
    name: "Liam Davies",
    email: "liam.davies@techcorp.io",
    phone: "+49 176 89234101",
    nationality: "United Kingdom",
    visaStatus: "PERMANENT_RESIDENCY",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 7100,
    propertyCity: "Berlin (Mitte)",
    propertyPrice: 75e4,
    downPayment: 18e4,
    loanAmount: 6e5,
    assignedAdvisorId: "usr-marcus-weber",
    caseNumber: "DE-BER-2024-4192",
    status: "document_collection",
    accessPin: "4192",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "client-frankfurt-01",
    brokerageId: "brk-rheinmain-frankfurt",
    leadId: "lead-201",
    name: "Hiroshi Tanaka",
    email: "hiroshi.tanaka@nomura-eu.com",
    phone: "+49 69 99887766",
    nationality: "Japan",
    visaStatus: "PERMANENT_RESIDENCY",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 9500,
    propertyCity: "Frankfurt (Westend)",
    propertyPrice: 92e4,
    downPayment: 25e4,
    loanAmount: 7e5,
    assignedAdvisorId: "usr-clara-schulz",
    caseNumber: "DE-FRA-2024-8821",
    status: "document_collection",
    accessPin: "8821",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "client-munich-01",
    brokerageId: "brk-bavaria-munich",
    leadId: "lead-301",
    name: "Carlos Mendez",
    email: "carlos.mendez@bmw-group.com",
    phone: "+49 89 38291044",
    nationality: "Spain",
    visaStatus: "EU_CITIZEN",
    employmentType: "PERMANENT_EMPLOYEE",
    monthlyNetIncome: 8400,
    propertyCity: "Munich (Schwabing)",
    propertyPrice: 89e4,
    downPayment: 26e4,
    loanAmount: 65e4,
    assignedAdvisorId: "usr-stefan-bauer",
    caseNumber: "DE-MUC-2024-5519",
    status: "document_collection",
    accessPin: "5519",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1e3).toISOString()
  }
];
export const INITIAL_DOCUMENTS = [
  {
    id: "doc-001",
    clientId: "client-liam-01",
    brokerageId: "brk-hypolink-berlin",
    requirementCode: "doc_passport",
    title: "Valid Passport / ID Card",
    fileName: "Liam_Davies_UK_Passport.pdf",
    fileSize: 245e4,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 36 * 3600 * 1e3).toISOString(),
    status: "verified",
    progressPercent: 100,
    bankReadinessScore: 98,
    extractedData: {
      issueDate: "2021-05-14",
      passportValidUntil: "2031-05-13",
      addressVerified: true
    },
    advisorReviewNotes: "Valid UK passport with indefinite leave / Niederlassungserlaubnis.",
    advisorApproved: true,
    checkedAt: new Date(Date.now() - 35 * 3600 * 1e3).toISOString()
  },
  {
    id: "doc-002",
    clientId: "client-liam-01",
    brokerageId: "brk-hypolink-berlin",
    requirementCode: "doc_residence",
    title: "German Residence Permit (EU Blue Card / PR)",
    fileName: "Liam_Davies_Niederlassungserlaubnis.pdf",
    fileSize: 182e4,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 36 * 3600 * 1e3).toISOString(),
    status: "verified",
    progressPercent: 100,
    bankReadinessScore: 100,
    extractedData: {
      issueDate: "2022-09-01",
      passportValidUntil: "Permanent",
      addressVerified: true
    },
    advisorApproved: true,
    checkedAt: new Date(Date.now() - 35 * 3600 * 1e3).toISOString()
  },
  {
    id: "doc-003",
    clientId: "client-liam-01",
    brokerageId: "brk-hypolink-berlin",
    requirementCode: "doc_payslip_1",
    title: "Payslip (Month 1 - Most Recent)",
    fileName: "Gehaltsabrechnung_Januar_2024.pdf",
    fileSize: 94e4,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 20 * 3600 * 1e3).toISOString(),
    status: "verified",
    progressPercent: 100,
    bankReadinessScore: 95,
    extractedData: {
      employerName: "TechCorp Services GmbH (Berlin)",
      monthlySalaryEur: 7124.5,
      issueDate: "2024-01-28"
    },
    advisorApproved: true,
    checkedAt: new Date(Date.now() - 19 * 3600 * 1e3).toISOString()
  },
  {
    id: "doc-004",
    clientId: "client-liam-01",
    brokerageId: "brk-hypolink-berlin",
    requirementCode: "doc_schufa",
    title: "SCHUFA Credit Report",
    fileName: "SCHUFA_Auskunft_Liam.pdf",
    fileSize: 12e5,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 18 * 3600 * 1e3).toISOString(),
    status: "rejected",
    progressPercent: 100,
    bankReadinessScore: 35,
    failureReason: "Certificate is older than 60 days (German mortgage banks like ING require SCHUFA issued within 60 days). Please generate a fresh certificate.",
    checkedAt: new Date(Date.now() - 17 * 3600 * 1e3).toISOString()
  },
  // Documents for Frankfurt Client (Hiroshi Tanaka)
  {
    id: "doc-fra-001",
    clientId: "client-frankfurt-01",
    brokerageId: "brk-rheinmain-frankfurt",
    requirementCode: "doc_passport",
    title: "Valid Passport / ID Card",
    fileName: "Hiroshi_Tanaka_Japan_Passport.pdf",
    fileSize: 210e4,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 48 * 3600 * 1e3).toISOString(),
    status: "verified",
    progressPercent: 100,
    bankReadinessScore: 100,
    extractedData: {
      issueDate: "2020-03-10",
      passportValidUntil: "2030-03-09",
      addressVerified: true
    },
    advisorReviewNotes: "Verified diplomatic passport with permanent settlement permit in Frankfurt.",
    advisorApproved: true,
    checkedAt: new Date(Date.now() - 47 * 3600 * 1e3).toISOString()
  },
  {
    id: "doc-fra-002",
    clientId: "client-frankfurt-01",
    brokerageId: "brk-rheinmain-frankfurt",
    requirementCode: "doc_payslip_1",
    title: "Payslip (Month 1 - Most Recent)",
    fileName: "Nomura_Gehalt_Januar_2024.pdf",
    fileSize: 85e4,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 24 * 3600 * 1e3).toISOString(),
    status: "verified",
    progressPercent: 100,
    bankReadinessScore: 98,
    extractedData: {
      employerName: "Nomura Financial Products Europe GmbH",
      monthlySalaryEur: 9540.0,
      issueDate: "2024-01-25"
    },
    advisorApproved: true,
    checkedAt: new Date(Date.now() - 23 * 3600 * 1e3).toISOString()
  },
  // Documents for Munich Client (Carlos Mendez)
  {
    id: "doc-muc-001",
    clientId: "client-munich-01",
    brokerageId: "brk-bavaria-munich",
    requirementCode: "doc_passport",
    title: "Valid Passport / ID Card",
    fileName: "Carlos_Mendez_Spanish_DNI.pdf",
    fileSize: 195e4,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 60 * 3600 * 1e3).toISOString(),
    status: "verified",
    progressPercent: 100,
    bankReadinessScore: 100,
    extractedData: {
      issueDate: "2022-01-15",
      passportValidUntil: "2032-01-14",
      addressVerified: true
    },
    advisorReviewNotes: "EU citizen passport verified. Spanish nationality with German residency.",
    advisorApproved: true,
    checkedAt: new Date(Date.now() - 59 * 3600 * 1e3).toISOString()
  },
  {
    id: "doc-muc-002",
    clientId: "client-munich-01",
    brokerageId: "brk-bavaria-munich",
    requirementCode: "doc_payslip_1",
    title: "Payslip (Month 1 - Most Recent)",
    fileName: "BMW_Entgeltabrechnung_Januar.pdf",
    fileSize: 92e4,
    fileType: "application/pdf",
    uploadedAt: new Date(Date.now() - 30 * 3600 * 1e3).toISOString(),
    status: "verified",
    progressPercent: 100,
    bankReadinessScore: 99,
    extractedData: {
      employerName: "BMW AG (Muenchen)",
      monthlySalaryEur: 8412.0,
      issueDate: "2024-01-28"
    },
    advisorApproved: true,
    checkedAt: new Date(Date.now() - 29 * 3600 * 1e3).toISOString()
  }
];
export const INITIAL_TASKS = [
  {
    id: "task-001",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-102",
    title: "Call lead within 2 hours (Hot Expat Inbound)",
    description: "Verify residency status and target purchase price in Potsdam.",
    assignedAdvisorId: "usr-sophie-lang",
    dueDate: new Date(Date.now() - 15 * 60 * 1e3).toISOString(),
    // 15 mins OVERDUE!
    isOverdue: true,
    completed: false,
    stageTriggeredFrom: "new",
    priority: "urgent",
    createdAt: new Date(Date.now() - 110 * 60 * 1e3).toISOString()
  },
  {
    id: "task-002",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-101",
    title: "Call lead within 2 hours (Hot Expat Inbound)",
    description: "Fresh inbound lead via Typeform. Check Blue Card validity and equity proof.",
    assignedAdvisorId: "usr-marcus-weber",
    dueDate: new Date(Date.now() + 75 * 60 * 1e3).toISOString(),
    // due in 75 mins
    isOverdue: false,
    completed: false,
    stageTriggeredFrom: "new",
    priority: "urgent",
    createdAt: new Date(Date.now() - 45 * 60 * 1e3).toISOString()
  },
  {
    id: "task-003",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-104",
    clientId: "client-liam-01",
    title: "Audit 3 months payslips & SCHUFA validity",
    description: "Liam uploaded outdated SCHUFA document. Request renewed credit report.",
    assignedAdvisorId: "usr-marcus-weber",
    dueDate: new Date(Date.now() + 24 * 3600 * 1e3).toISOString(),
    isOverdue: false,
    completed: false,
    stageTriggeredFrom: "docs_needed",
    priority: "high",
    createdAt: new Date(Date.now() - 18 * 3600 * 1e3).toISOString()
  },
  {
    id: "task-004",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-106",
    title: "Assemble final bank application in Europace / Interhyp portal",
    description: "Olga Kowalska Charlottenburg purchase dossier ready.",
    assignedAdvisorId: "usr-marcus-weber",
    dueDate: new Date(Date.now() + 6 * 3600 * 1e3).toISOString(),
    isOverdue: false,
    completed: false,
    stageTriggeredFrom: "under_review",
    priority: "urgent",
    createdAt: new Date(Date.now() - 18 * 3600 * 1e3).toISOString()
  },
  // Frankfurt Tasks (Tenant Isolation)
  {
    id: "task-fra-001",
    brokerageId: "brk-rheinmain-frankfurt",
    leadId: "lead-203",
    title: "Call lead within 2 hours (Hot Expat Inbound)",
    description: "Priya Nair from Deutsche Bank requested Frankfurt mortgage consultation.",
    assignedAdvisorId: "usr-clara-schulz",
    dueDate: new Date(Date.now() + 60 * 60 * 1e3).toISOString(),
    isOverdue: false,
    completed: false,
    stageTriggeredFrom: "new",
    priority: "urgent",
    createdAt: new Date(Date.now() - 40 * 60 * 1e3).toISOString()
  },
  {
    id: "task-fra-002",
    brokerageId: "brk-rheinmain-frankfurt",
    leadId: "lead-201",
    clientId: "client-frankfurt-01",
    title: "Review Nomura bonus breakdown for Commerzbank dossier",
    description: "Verify past 2 years bonus letter for Hiroshi Tanaka.",
    assignedAdvisorId: "usr-clara-schulz",
    dueDate: new Date(Date.now() + 18 * 3600 * 1e3).toISOString(),
    isOverdue: false,
    completed: false,
    stageTriggeredFrom: "docs_needed",
    priority: "high",
    createdAt: new Date(Date.now() - 24 * 3600 * 1e3).toISOString()
  },
  // Munich Tasks (Tenant Isolation)
  {
    id: "task-muc-001",
    brokerageId: "brk-bavaria-munich",
    leadId: "lead-303",
    title: "Call lead within 2 hours (Hot Expat Inbound)",
    description: "Wei Zhang Google Munich ML engineer seeking Altbau in Maxvorstadt.",
    assignedAdvisorId: "usr-lisa-huber",
    dueDate: new Date(Date.now() + 45 * 60 * 1e3).toISOString(),
    isOverdue: false,
    completed: false,
    stageTriggeredFrom: "new",
    priority: "urgent",
    createdAt: new Date(Date.now() - 55 * 60 * 1e3).toISOString()
  },
  {
    id: "task-muc-002",
    brokerageId: "brk-bavaria-munich",
    leadId: "lead-301",
    clientId: "client-munich-01",
    title: "Submit Carlos Mendez BMW dossier to Sparkasse München",
    description: "All verified: Spanish passport, BMW permanent contract, payslips.",
    assignedAdvisorId: "usr-stefan-bauer",
    dueDate: new Date(Date.now() + 12 * 3600 * 1e3).toISOString(),
    isOverdue: false,
    completed: false,
    stageTriggeredFrom: "docs_needed",
    priority: "urgent",
    createdAt: new Date(Date.now() - 10 * 3600 * 1e3).toISOString()
  }
];
export const INITIAL_EMAIL_LOGS = [
  {
    id: "elog-001",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-101",
    recipientEmail: "priya.sharma@zalando.com",
    recipientName: "Priya Sharma",
    templateName: "Welcome & Expat Mortgage Guide",
    subject: "Welcome to HypoLink Berlin - Your German Mortgage Journey in Berlin (Friedrichshain)",
    body: "Triggered automatically when Priya Sharma arrived from Typeform.",
    sentAt: new Date(Date.now() - 45 * 60 * 1e3).toISOString(),
    status: "delivered"
  },
  {
    id: "elog-002",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-102",
    recipientEmail: "alex.dubois@berlin-tech.de",
    recipientName: "Alexandre Dubois",
    templateName: "Welcome & Expat Mortgage Guide",
    subject: "Welcome to HypoLink Berlin - Your German Mortgage Journey in Potsdam",
    body: "Triggered automatically when Alexandre Dubois entered from Facebook Ads.",
    sentAt: new Date(Date.now() - 110 * 60 * 1e3).toISOString(),
    status: "delivered"
  },
  {
    id: "elog-003",
    brokerageId: "brk-hypolink-berlin",
    leadId: "lead-104",
    recipientEmail: "liam.davies@techcorp.io",
    recipientName: "Liam Davies",
    templateName: "German Document Checklist & Client Portal Access",
    subject: "Important: Document Checklist for your Mortgage Application in Berlin (Mitte)",
    body: "Triggered automatically when lead was moved to Document Collection.",
    sentAt: new Date(Date.now() - 3 * 24 * 3600 * 1e3).toISOString(),
    status: "delivered"
  }
];
export const INITIAL_WEBHOOK_LOGS = [
  {
    id: "wh-001",
    brokerageId: "brk-hypolink-berlin",
    source: "Typeform Expat Calculator",
    payload: {
      event_id: "evt_tf_998124",
      form_response: {
        answers: [
          { field: { title: "Full Name" }, text: "Priya Sharma" },
          { field: { title: "Email" }, email: "priya.sharma@zalando.com" },
          { field: { title: "Net Income" }, number: 5200 },
          { field: { title: "City" }, text: "Berlin (Friedrichshain)" },
          { field: { title: "Purchase Price" }, number: 48e4 }
        ]
      }
    },
    receivedAt: new Date(Date.now() - 45 * 60 * 1e3).toISOString(),
    processedLeadId: "lead-101",
    leadName: "Priya Sharma",
    status: "success"
  },
  {
    id: "wh-002",
    brokerageId: "brk-hypolink-berlin",
    source: "Facebook Lead Ads (Tech Expats)",
    payload: {
      entry: [
        {
          changes: [
            {
              value: {
                leadgen_id: "fb_lead_771299",
                full_name: "Alexandre Dubois",
                email: "alex.dubois@berlin-tech.de",
                phone_number: "+49 152 98412033",
                city: "Potsdam"
              }
            }
          ]
        }
      ]
    },
    receivedAt: new Date(Date.now() - 110 * 60 * 1e3).toISOString(),
    processedLeadId: "lead-102",
    leadName: "Alexandre Dubois",
    status: "success"
  },
  {
    id: "wh-003",
    brokerageId: "brk-hypolink-berlin",
    source: "Partner: Expatica Portal",
    payload: {
      applicant_name: "Priya Sharma",
      email: "priya.sharma@zalando.com",
      phone: "+49 176 45910283",
      city: "Berlin (Prenzlauer Berg)",
      loan_amount: 45e4
    },
    receivedAt: new Date(Date.now() - 10 * 60 * 1e3).toISOString(),
    processedLeadId: "lead-103",
    leadName: "Priya Sharma (Duplicate)",
    status: "duplicate_detected"
  }
];
