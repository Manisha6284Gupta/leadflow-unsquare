import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  INITIAL_BROKERAGES,
  INITIAL_CLIENTS,
  INITIAL_DOCUMENTS,
  INITIAL_EMAIL_LOGS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_LEADS,
  INITIAL_STAGE_AUTOMATIONS,
  INITIAL_TASKS,
  INITIAL_USERS,
  INITIAL_WEBHOOK_LOGS
} from "./data/mockData.js";
import { GERMAN_MORTGAGE_DOC_REQUIREMENTS } from "./constants/germanMortgage.js";
import { initDatabaseConnection, getDatabaseStatus } from "./db/connection.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
let brokerages = [...INITIAL_BROKERAGES];
let users = [...INITIAL_USERS];
let leads = [...INITIAL_LEADS];
let clients = [...INITIAL_CLIENTS];
let documents = [...INITIAL_DOCUMENTS];
let tasks = [...INITIAL_TASKS];
let emailTemplates = [...INITIAL_EMAIL_TEMPLATES];
let automations = [...INITIAL_STAGE_AUTOMATIONS];
let emailLogs = [...INITIAL_EMAIL_LOGS];
let webhookLogs = [...INITIAL_WEBHOOK_LOGS];
let sseClients = [];
function broadcastSSE(brokerageId, eventType, data) {
  const payload = `event: ${eventType}
data: ${JSON.stringify(data)}

`;
  sseClients.forEach((client) => {
    if (client.brokerageId === "all" || client.brokerageId === brokerageId) {
      try {
        client.res.write(payload);
      } catch {
      }
    }
  });
}
function processDocumentInBackground(docId) {
  setTimeout(() => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc || doc.status !== "queued") return;
    doc.status = "checking";
    doc.progressPercent = 45;
    broadcastSSE(doc.brokerageId, "doc_status_changed", doc);
    const checkDurationMs = 5e3 + Math.floor(Math.random() * 3e3);
    setTimeout(() => {
      const targetDoc = documents.find((d) => d.id === docId);
      if (!targetDoc) return;
      const shouldFail = Math.random() < 0.22 || targetDoc.fileName.toLowerCase().includes("fail") || targetDoc.fileName.toLowerCase().includes("expired");
      if (shouldFail) {
        targetDoc.status = "rejected";
        targetDoc.progressPercent = 100;
        targetDoc.bankReadinessScore = Math.floor(25 + Math.random() * 35);
        targetDoc.checkedAt = (/* @__PURE__ */ new Date()).toISOString();
        const failureReasons = [
          "Document date exceeds 90-day validity window required by German mortgage lenders.",
          "Meldebescheinigung address mismatch against passport & contract applicant data.",
          "Payslip scan resolution too low for automated Sparkasse/ING OCR underwriting.",
          "Employment confirmation does not explicitly state that probation (Probezeit) has passed.",
          "SCHUFA-Bonit\xE4tsauskunft score requires updated verification or is password encrypted."
        ];
        targetDoc.failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      } else {
        targetDoc.status = "verified";
        targetDoc.progressPercent = 100;
        targetDoc.bankReadinessScore = Math.floor(92 + Math.random() * 8);
        targetDoc.checkedAt = (/* @__PURE__ */ new Date()).toISOString();
        targetDoc.failureReason = void 0;
        targetDoc.extractedData = {
          issueDate: new Date(Date.now() - 14 * 24 * 3600 * 1e3).toISOString().split("T")[0],
          addressVerified: true,
          monthlySalaryEur: Math.floor(4500 + Math.random() * 3500),
          schufaScore: 98.4
        };
      }
      broadcastSSE(targetDoc.brokerageId, "doc_status_changed", targetDoc);
    }, checkDurationMs);
  }, 1200);
}
function detectDuplicateLead(brokerageId, email, phone, name) {
  const normEmail = (email || "").trim().toLowerCase();
  const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  const normName = (name || "").trim().toLowerCase();
  const existingLead = leads.find((l) => {
    if (l.brokerageId !== brokerageId) return false;
    if (normEmail && l.email.trim().toLowerCase() === normEmail) return true;
    if (cleanPhone && cleanPhone.length > 7) {
      const existingClean = l.phone.replace(/[^0-9]/g, "");
      if (existingClean && existingClean.endsWith(cleanPhone.slice(-8))) return true;
    }
    if (normName && l.name.trim().toLowerCase() === normName) return true;
    return false;
  });
  if (existingLead) {
    const advisor = users.find((u) => u.id === existingLead.assignedAdvisorId);
    return {
      isDuplicate: true,
      info: {
        isDuplicate: true,
        matchType: existingLead.email.toLowerCase() === normEmail ? "email" : "phone",
        matchedEntityId: existingLead.id,
        matchedEntityType: "lead",
        matchedName: existingLead.name,
        matchedEmail: existingLead.email,
        matchedStage: existingLead.stageId,
        matchedAdvisorName: advisor?.name || "Assigned Advisor",
        matchedDate: existingLead.createdAt,
        details: `Existing expat contact found! Prior inquiry recorded on ${new Date(existingLead.createdAt).toLocaleDateString()} (Stage: ${existingLead.stageId}). Contact already handled by ${advisor?.name || "team"}.`
      }
    };
  }
  const existingClient = clients.find((c) => {
    if (c.brokerageId !== brokerageId) return false;
    return normEmail && c.email.trim().toLowerCase() === normEmail || normName && c.name.trim().toLowerCase() === normName;
  });
  if (existingClient) {
    const advisor = users.find((u) => u.id === existingClient.assignedAdvisorId);
    return {
      isDuplicate: true,
      info: {
        isDuplicate: true,
        matchType: "email",
        matchedEntityId: existingClient.id,
        matchedEntityType: "client",
        matchedName: existingClient.name,
        matchedEmail: existingClient.email,
        matchedStage: "Active Mortgage Client",
        matchedAdvisorName: advisor?.name || "Advisor",
        matchedDate: existingClient.createdAt,
        details: `This expat is already an active converted client (${existingClient.caseNumber}) assigned to ${advisor?.name || "team"}.`
      }
    };
  }
  return { isDuplicate: false };
}
function executeStageAutomations(lead, stageId) {
  const rule = automations.find((a) => a.brokerageId === lead.brokerageId && a.stageId === stageId);
  const brokerage = brokerages.find((b) => b.id === lead.brokerageId);
  const advisor = users.find((u) => u.id === lead.assignedAdvisorId) || users.find((u) => u.brokerageId === lead.brokerageId && u.role === "advisor");
  if (!rule) return;
  if (rule.sendEmailTemplateId) {
    const template = emailTemplates.find((t) => t.id === rule.sendEmailTemplateId);
    if (template) {
      let renderedBody = template.body.replace(/\{\{client_name\}\}/g, lead.name).replace(/\{\{advisor_name\}\}/g, advisor?.name || "Your Senior Advisor").replace(/\{\{advisor_email\}\}/g, advisor?.email || brokerage?.contactEmail || "advisor@brokerage.de").replace(/\{\{advisor_phone\}\}/g, advisor?.phone || "+49 30 84729100").replace(/\{\{brokerage_name\}\}/g, brokerage?.name || "LeadFlow Brokerage").replace(/\{\{property_city\}\}/g, lead.propertyCity || "Germany").replace(/\{\{loan_amount\}\}/g, `\u20AC${lead.requestedLoanAmount.toLocaleString()}`).replace(/\{\{portal_url\}\}/g, `https://${brokerage?.slug}.leadflow.de/portal/auth`);
      let renderedSubject = template.subject.replace(/\{\{client_name\}\}/g, lead.name).replace(/\{\{brokerage_name\}\}/g, brokerage?.name || "LeadFlow").replace(/\{\{property_city\}\}/g, lead.propertyCity || "Germany").replace(/\{\{loan_amount\}\}/g, `\u20AC${lead.requestedLoanAmount.toLocaleString()}`);
      const emailLog = {
        id: `elog-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
        brokerageId: lead.brokerageId,
        leadId: lead.id,
        recipientEmail: rule.emailRecipient === "client" ? lead.email : advisor?.email || "advisor@leadflow.de",
        recipientName: rule.emailRecipient === "client" ? lead.name : advisor?.name || "Advisor",
        templateName: template.name,
        subject: renderedSubject,
        body: renderedBody,
        sentAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "delivered"
      };
      emailLogs.unshift(emailLog);
      broadcastSSE(lead.brokerageId, "email_sent", emailLog);
    }
  }
  if (rule.autoCreateTasks && rule.autoCreateTasks.length > 0) {
    rule.autoCreateTasks.forEach((cfg) => {
      const dueHours = cfg.dueInHours || 2;
      const dueDate = new Date(Date.now() + dueHours * 3600 * 1e3).toISOString();
      const task = {
        id: `task-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
        brokerageId: lead.brokerageId,
        leadId: lead.id,
        title: cfg.title.replace(/\{\{client_name\}\}/g, lead.name),
        description: cfg.description || `Automated task triggered on entry to stage ${stageId}`,
        assignedAdvisorId: lead.assignedAdvisorId || advisor?.id || "usr-marcus-weber",
        dueDate,
        isOverdue: false,
        completed: false,
        stageTriggeredFrom: stageId,
        priority: cfg.priority || "normal",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      tasks.unshift(task);
      broadcastSSE(lead.brokerageId, "task_created", task);
    });
  }
}
app.get("/api/events", (req, res) => {
  const brokerageId = req.query.brokerageId || "all";
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  const connId = `conn-${Date.now()}-${Math.random()}`;
  const client = { id: connId, brokerageId, res };
  sseClients.push(client);
  res.write(`event: connected
data: ${JSON.stringify({ status: "connected", connId })}

`);
  req.on("close", () => {
    sseClients = sseClients.filter((c) => c.id !== connId);
  });
});
app.get("/api/brokerages", (_req, res) => {
  res.json({ success: true, brokerages });
});

// Authentication System: Login, Session Verification, Demo Accounts, and Logout
app.post("/api/auth/login", (req, res) => {
  const { email, password, brokerageId } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();
  
  if (!cleanEmail) {
    return res.status(400).json({ success: false, error: "Please provide a valid email address." });
  }

  // Find user by email
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      error: "No account found matching this email address. Please check your credentials or pick a demo user." 
    });
  }

  // Verify brokerage match if not platform admin
  if (user.role !== "platform_admin" && brokerageId && brokerageId !== "all" && user.brokerageId !== brokerageId) {
    const targetBrokerage = brokerages.find((b) => b.id === user.brokerageId);
    return res.status(403).json({
      success: false,
      error: `Access Denied: This account belongs to ${targetBrokerage ? targetBrokerage.name : user.brokerageId}, not the selected brokerage.`
    });
  }

  // Generate an authenticated session token
  const token = `tok_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const userBrokerage = brokerages.find((b) => b.id === user.brokerageId);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      brokerageId: user.brokerageId,
      avatar: user.avatar,
      jobTitle: user.jobTitle,
      phone: user.phone
    },
    brokerage: userBrokerage || { id: user.brokerageId, name: "Multi-Tenant Platform", city: "All" }
  });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized: Missing Bearer token." });
  }
  const token = authHeader.split(" ")[1];
  const parts = token.split("_");
  const userId = parts[1] || "";
  const user = users.find((u) => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid session or user not found." });
  }

  const userBrokerage = brokerages.find((b) => b.id === user.brokerageId);
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      brokerageId: user.brokerageId,
      avatar: user.avatar,
      jobTitle: user.jobTitle,
      phone: user.phone
    },
    brokerage: userBrokerage || { id: user.brokerageId, name: "Multi-Tenant Platform", city: "All" }
  });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/api/auth/demo-users", (_req, res) => {
  const demoUsers = users.map((u) => {
    const brk = brokerages.find((b) => b.id === u.brokerageId);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      brokerageId: u.brokerageId,
      brokerageName: brk ? brk.name : "Platform Super Admin",
      city: brk ? brk.city : "Central HQ",
      jobTitle: u.jobTitle,
      avatar: u.avatar
    };
  });
  res.json({ success: true, users: demoUsers });
});
app.post("/api/brokerages", (req, res) => {
  const { name, city, contactEmail, primaryColor } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const newBrokerage = {
    id: `brk-${Date.now()}`,
    name,
    slug,
    apiKey: `hlk_live_${Math.random().toString(36).substring(2, 14)}`,
    city: city || "Berlin",
    country: "Germany",
    primaryColor: primaryColor || "#2563EB",
    contactEmail: contactEmail || `hello@${slug}.de`,
    defaultAdvisorId: "usr-marcus-weber",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    totalVolumeEur: 0
  };
  brokerages.push(newBrokerage);
  res.json({ success: true, brokerage: newBrokerage });
});
app.get("/api/users", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = users;
  if (brokerageId && brokerageId !== "all") {
    filtered = users.filter((u) => u.brokerageId === brokerageId || u.brokerageId === "all");
  }
  res.json({ success: true, users: filtered });
});
app.post("/api/users", (req, res) => {
  const { name, email, role, brokerageId, jobTitle, phone } = req.body;
  if (!name || !email || !brokerageId) {
    return res.status(400).json({ error: "Missing required fields: name, email, brokerageId" });
  }
  const cleanEmail = email.trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: "User with this email already exists" });
  }
  const newUser = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    brokerageId,
    name,
    email: cleanEmail,
    role: role || "advisor",
    jobTitle: jobTitle || (role === "brokerage_admin" ? "Brokerage Admin" : "Mortgage Specialist"),
    phone: phone || "+49 30 00000000",
    avatar: `https://images.unsplash.com/photo-${role === "brokerage_admin" ? "1573496359142-b8d87734a5a2" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&q=80&w=250`,
    isOnline: true
  };
  users.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return res.status(404).json({ error: "User not found" });
  users.splice(idx, 1);
  res.json({ success: true, message: "User deleted" });
});
app.get("/api/leads", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = leads;
  if (brokerageId && brokerageId !== "all") {
    filtered = leads.filter((l) => l.brokerageId === brokerageId);
  }
  res.json({ success: true, leads: filtered });
});
app.post("/api/leads", (req, res) => {
  const {
    brokerageId,
    name,
    email,
    phone,
    nationality,
    visaStatus,
    employmentType,
    monthlyNetIncome,
    propertyCity,
    propertyPrice,
    downPayment,
    requestedLoanAmount,
    source,
    assignedAdvisorId,
    notes
  } = req.body;
  if (!brokerageId || !name || !email) {
    res.status(400).json({ error: "Missing required lead fields: brokerageId, name, email" });
    return;
  }
  const dupCheck = detectDuplicateLead(brokerageId, email, phone, name);
  const newLead = {
    id: `lead-${Date.now()}`,
    brokerageId,
    name,
    email,
    phone: phone || "+49 176 00000000",
    nationality: nationality || "International Expat",
    visaStatus: visaStatus || "EU_BLUE_CARD",
    employmentType: employmentType || "PERMANENT_EMPLOYEE",
    monthlyNetIncome: Number(monthlyNetIncome) || 5e3,
    propertyCity: propertyCity || "Berlin",
    propertyPrice: Number(propertyPrice) || 5e5,
    downPayment: Number(downPayment) || 1e5,
    requestedLoanAmount: Number(requestedLoanAmount) || 4e5,
    source: source || "Manual Entry",
    stageId: "new",
    assignedAdvisorId: assignedAdvisorId || "usr-marcus-weber",
    duplicateInfo: dupCheck.info,
    notes: notes || "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  leads.unshift(newLead);
  executeStageAutomations(newLead, "new");
  broadcastSSE(brokerageId, "lead_created", newLead);
  res.json({ success: true, lead: newLead });
});
app.patch("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  Object.assign(lead, req.body, { updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  broadcastSSE(lead.brokerageId, "lead_updated", lead);
  res.json({ success: true, lead });
});
app.post("/api/leads/:id/notes", (req, res) => {
  const { id } = req.params;
  const { authorId, authorName, authorRole, authorAvatar, category, content, tags, pinned } = req.body;
  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  if (!content || !content.trim()) {
    res.status(400).json({ error: "Note content is required" });
    return;
  }
  if (!lead.advisorNotes) {
    lead.advisorNotes = [];
  }
  const newNote = {
    id: `note-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    leadId: lead.id,
    authorId: authorId || "usr-marcus-weber",
    authorName: authorName || "Senior Advisor",
    authorRole: authorRole || "Advisor",
    authorAvatar: authorAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: category || "general",
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : [],
    pinned: Boolean(pinned),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  lead.advisorNotes.unshift(newNote);
  lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  broadcastSSE(lead.brokerageId, "lead_updated", lead);
  res.status(201).json({ success: true, note: newNote, lead });
});
app.patch("/api/leads/:id/notes/:noteId", (req, res) => {
  const { id, noteId } = req.params;
  const { content, pinned, category, tags } = req.body;
  const lead = leads.find((l) => l.id === id);
  if (!lead || !lead.advisorNotes) {
    res.status(404).json({ error: "Lead or note not found" });
    return;
  }
  const note = lead.advisorNotes.find((n) => n.id === noteId);
  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  if (content !== void 0) note.content = content;
  if (pinned !== void 0) note.pinned = pinned;
  if (category !== void 0) note.category = category;
  if (tags !== void 0) note.tags = tags;
  note.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  broadcastSSE(lead.brokerageId, "lead_updated", lead);
  res.json({ success: true, note, lead });
});
app.delete("/api/leads/:id/notes/:noteId", (req, res) => {
  const { id, noteId } = req.params;
  const lead = leads.find((l) => l.id === id);
  if (!lead || !lead.advisorNotes) {
    res.status(404).json({ error: "Lead or note not found" });
    return;
  }
  lead.advisorNotes = lead.advisorNotes.filter((n) => n.id !== noteId);
  lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  broadcastSSE(lead.brokerageId, "lead_updated", lead);
  res.json({ success: true, lead });
});
app.post("/api/leads/:id/move-stage", (req, res) => {
  const { id } = req.params;
  const { newStageId } = req.body;
  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  const oldStage = lead.stageId;
  lead.stageId = newStageId;
  lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  executeStageAutomations(lead, newStageId);
  broadcastSSE(lead.brokerageId, "lead_stage_changed", { lead, oldStage, newStage: newStageId });
  res.json({ success: true, lead });
});
app.post("/api/leads/:id/convert", (req, res) => {
  const { id } = req.params;
  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  const cityCode = lead.propertyCity.includes("Berlin") ? "BER" : lead.propertyCity.includes("Frankfurt") ? "FRA" : "MUC";
  const pin = Math.floor(1e3 + Math.random() * 9e3).toString();
  const caseNumber = `DE-${cityCode}-2024-${pin}`;
  const newClient = {
    id: `client-${Date.now()}`,
    brokerageId: lead.brokerageId,
    leadId: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    nationality: lead.nationality,
    visaStatus: lead.visaStatus,
    employmentType: lead.employmentType,
    monthlyNetIncome: lead.monthlyNetIncome,
    propertyCity: lead.propertyCity,
    propertyPrice: lead.propertyPrice,
    downPayment: lead.downPayment,
    loanAmount: lead.requestedLoanAmount,
    assignedAdvisorId: lead.assignedAdvisorId,
    caseNumber,
    status: "document_collection",
    accessPin: pin,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  clients.unshift(newClient);
  lead.convertedToClientId = newClient.id;
  lead.stageId = "docs_needed";
  lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  const sampleDocs = [
    {
      id: `doc-${Date.now()}-1`,
      clientId: newClient.id,
      brokerageId: newClient.brokerageId,
      requirementCode: "doc_passport",
      title: "Valid Passport / ID Card",
      fileName: `${lead.name.replace(/\s+/g, "_")}_Passport_Scan.pdf`,
      fileSize: 185e4,
      fileType: "application/pdf",
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "queued",
      progressPercent: 10,
      bankReadinessScore: 0
    }
  ];
  documents.push(...sampleDocs);
  processDocumentInBackground(sampleDocs[0].id);
  executeStageAutomations(lead, "docs_needed");
  broadcastSSE(lead.brokerageId, "client_created", newClient);
  broadcastSSE(lead.brokerageId, "lead_updated", lead);
  res.json({ success: true, client: newClient, lead });
});
app.get("/api/clients", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = clients;
  if (brokerageId && brokerageId !== "all") {
    filtered = clients.filter((c) => c.brokerageId === brokerageId);
  }
  res.json({ success: true, clients: filtered });
});
app.post("/api/portal/auth", (req, res) => {
  const { email, pin } = req.body;
  const client = clients.find((c) => c.email.toLowerCase() === (email || "").trim().toLowerCase() || c.accessPin === (pin || "").trim());
  if (!client) {
    res.status(401).json({ error: "No matching client case found. Please check your email or 4-digit PIN." });
    return;
  }
  res.json({ success: true, client });
});
app.get("/api/documents", (req, res) => {
  const clientId = req.query.clientId;
  const brokerageId = req.query.brokerageId;
  let filtered = documents;
  if (clientId) {
    filtered = filtered.filter((d) => d.clientId === clientId);
  }
  if (brokerageId && brokerageId !== "all") {
    filtered = filtered.filter((d) => d.brokerageId === brokerageId);
  }
  res.json({ success: true, documents: filtered });
});
app.post("/api/documents/upload", (req, res) => {
  const { clientId, brokerageId, requirementCode, fileName, fileSize, fileType } = req.body;
  if (!clientId || !brokerageId || !requirementCode) {
    res.status(400).json({ error: "Missing required document metadata: clientId, brokerageId, requirementCode" });
    return;
  }
  const reqDef = GERMAN_MORTGAGE_DOC_REQUIREMENTS.find((r) => r.code === requirementCode);
  const newDoc = {
    id: `doc-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    clientId,
    brokerageId,
    requirementCode,
    title: reqDef?.title || "Uploaded Document",
    fileName: fileName || `${requirementCode}_document.pdf`,
    fileSize: fileSize || 1024 * 1024 * 2,
    fileType: fileType || "application/pdf",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "queued",
    progressPercent: 15,
    bankReadinessScore: 0
  };
  documents.unshift(newDoc);
  broadcastSSE(brokerageId, "doc_uploaded", newDoc);
  processDocumentInBackground(newDoc.id);
  res.json({ success: true, document: newDoc, message: "Document queued for background German bank OCR analysis." });
});
app.patch("/api/documents/:id", (req, res) => {
  const { id } = req.params;
  const { status, advisorReviewNotes, advisorApproved } = req.body;
  const doc = documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  if (status) doc.status = status;
  if (advisorReviewNotes !== void 0) doc.advisorReviewNotes = advisorReviewNotes;
  if (advisorApproved !== void 0) doc.advisorApproved = advisorApproved;
  broadcastSSE(doc.brokerageId, "doc_status_changed", doc);
  res.json({ success: true, document: doc });
});
app.get("/api/tasks", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = tasks;
  if (brokerageId && brokerageId !== "all") {
    filtered = tasks.filter((t) => t.brokerageId === brokerageId);
  }
  const now = Date.now();
  filtered.forEach((t) => {
    t.isOverdue = !t.completed && new Date(t.dueDate).getTime() < now;
  });
  res.json({ success: true, tasks: filtered });
});
app.post("/api/tasks", (req, res) => {
  const { brokerageId, leadId, title, description, assignedAdvisorId, dueDate, priority } = req.body;
  const newTask = {
    id: `task-${Date.now()}`,
    brokerageId,
    leadId,
    title,
    description,
    assignedAdvisorId: assignedAdvisorId || "usr-marcus-weber",
    dueDate: dueDate || new Date(Date.now() + 2 * 3600 * 1e3).toISOString(),
    isOverdue: false,
    completed: false,
    priority: priority || "normal",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  tasks.unshift(newTask);
  broadcastSSE(brokerageId, "task_created", newTask);
  res.json({ success: true, task: newTask });
});
app.patch("/api/tasks/:id/toggle", (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  task.completed = !task.completed;
  task.completedAt = task.completed ? (/* @__PURE__ */ new Date()).toISOString() : void 0;
  task.isOverdue = !task.completed && new Date(task.dueDate).getTime() < Date.now();
  broadcastSSE(task.brokerageId, "task_updated", task);
  res.json({ success: true, task });
});
app.get("/api/templates", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = emailTemplates;
  if (brokerageId && brokerageId !== "all") {
    filtered = emailTemplates.filter((t) => t.brokerageId === brokerageId);
  }
  res.json({ success: true, templates: filtered });
});
app.post("/api/templates", (req, res) => {
  const { brokerageId, name, subject, body, description } = req.body;
  const newTemplate = {
    id: `tmpl-${Date.now()}`,
    brokerageId,
    name,
    subject,
    body,
    description: description || "",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  emailTemplates.push(newTemplate);
  res.json({ success: true, template: newTemplate });
});
app.put("/api/templates/:id", (req, res) => {
  const { id } = req.params;
  const { name, subject, body, description } = req.body;
  const tmpl = emailTemplates.find((t) => t.id === id);
  if (!tmpl) {
    res.status(404).json({ error: "Template not found" });
    return;
  }
  if (name) tmpl.name = name;
  if (subject) tmpl.subject = subject;
  if (body) tmpl.body = body;
  if (description !== void 0) tmpl.description = description;
  tmpl.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  res.json({ success: true, template: tmpl });
});
app.get("/api/automations", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = automations;
  if (brokerageId && brokerageId !== "all") {
    filtered = automations.filter((a) => a.brokerageId === brokerageId);
  }
  res.json({ success: true, automations: filtered });
});
app.put("/api/automations", (req, res) => {
  const { brokerageId, stageId, sendEmailTemplateId, emailRecipient, autoCreateTasks } = req.body;
  let rule = automations.find((a) => a.brokerageId === brokerageId && a.stageId === stageId);
  if (!rule) {
    rule = {
      id: `auto-${Date.now()}`,
      brokerageId,
      stageId,
      emailRecipient: emailRecipient || "client",
      autoCreateTasks: autoCreateTasks || []
    };
    automations.push(rule);
  } else {
    rule.sendEmailTemplateId = sendEmailTemplateId;
    rule.emailRecipient = emailRecipient || "client";
    rule.autoCreateTasks = autoCreateTasks || [];
  }
  res.json({ success: true, automation: rule });
});
app.get("/api/emails/logs", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = emailLogs;
  if (brokerageId && brokerageId !== "all") {
    filtered = emailLogs.filter((e) => e.brokerageId === brokerageId);
  }
  res.json({ success: true, logs: filtered });
});
app.get("/api/webhooks/logs", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let filtered = webhookLogs;
  if (brokerageId && brokerageId !== "all") {
    filtered = webhookLogs.filter((w) => w.brokerageId === brokerageId);
  }
  res.json({ success: true, logs: filtered });
});
app.post(["/api/webhooks/leads/:brokerageSlug", "/api/webhooks/leads"], (req, res) => {
  try {
    const slug = req.params.brokerageSlug;
    const apiKeyHeader = req.headers["x-brokerage-key"];
    const body = req.body || {};
    let targetBrokerage;
    if (slug) {
      targetBrokerage = brokerages.find((b) => b.slug === slug || b.id === slug);
    } else if (apiKeyHeader) {
      targetBrokerage = brokerages.find((b) => b.apiKey === apiKeyHeader);
    } else if (body.brokerageId) {
      targetBrokerage = brokerages.find((b) => b.id === body.brokerageId || b.slug === body.brokerageId);
    }
    if (!targetBrokerage) {
      targetBrokerage = brokerages[0];
    }
    let name = body.name || body.full_name || body.applicant_name || "";
    let email = body.email || body.applicant_email || "";
    let phone = body.phone || body.phone_number || body.applicant_phone || "+49 170 0000000";
    let netIncome = Number(body.monthly_net_income || body.net_income || body.income || 5200);
    let propertyPrice = Number(body.property_price || body.purchase_price || body.price || 5e5);
    let downPayment = Number(body.down_payment || body.equity || 1e5);
    let requestedLoanAmount = Number(body.requested_loan_amount || body.loan_amount || propertyPrice - downPayment || 4e5);
    let propertyCity = body.city || body.property_city || "Berlin";
    let nationality = body.nationality || "Expat";
    let visaStatus = body.visa_status || "EU_BLUE_CARD";
    let source = body.source || "External Webhook";
    if (body.form_response && Array.isArray(body.form_response.answers)) {
      source = `Typeform (${body.form_response.definition?.title || "Expat Form"})`;
      body.form_response.answers.forEach((ans) => {
        const title = (ans.field?.title || "").toLowerCase();
        if (title.includes("name")) name = ans.text || name;
        if (title.includes("email") || ans.email) email = ans.email || ans.text || email;
        if (title.includes("phone")) phone = ans.text || phone;
        if (title.includes("income")) netIncome = ans.number || Number(ans.text) || netIncome;
        if (title.includes("city") || title.includes("location")) propertyCity = ans.text || propertyCity;
        if (title.includes("price")) propertyPrice = ans.number || Number(ans.text) || propertyPrice;
        if (title.includes("nationality")) nationality = ans.text || nationality;
      });
    }
    if (body.entry && Array.isArray(body.entry)) {
      source = "Facebook Lead Ads (Meta)";
      const leadData = body.entry[0]?.changes?.[0]?.value;
      if (leadData) {
        name = leadData.full_name || name;
        email = leadData.email || email;
        phone = leadData.phone_number || phone;
        if (leadData.city) propertyCity = leadData.city;
      }
    }
    if (body.event === "invitee.created" && body.payload) {
      source = "Calendly Consultation Booking";
      name = body.payload.name || name;
      email = body.payload.email || email;
    }
    if (!name) name = "Expat Homebuyer";
    if (!email) email = `expat-${Date.now()}@example.com`;
    const dupCheck = detectDuplicateLead(targetBrokerage.id, email, phone, name);
    const newLead = {
      id: `lead-wh-${Date.now()}`,
      brokerageId: targetBrokerage.id,
      name,
      email,
      phone,
      nationality,
      visaStatus,
      employmentType: "PERMANENT_EMPLOYEE",
      monthlyNetIncome: netIncome,
      propertyCity,
      propertyPrice,
      downPayment,
      requestedLoanAmount,
      source,
      stageId: "new",
      assignedAdvisorId: targetBrokerage.defaultAdvisorId || "usr-marcus-weber",
      duplicateInfo: dupCheck.info,
      notes: dupCheck.isDuplicate ? `\u26A0\uFE0F Duplicate detected on webhook ingestion: ${dupCheck.info?.details}` : `Ingested automatically via ${source}.`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    leads.unshift(newLead);
    executeStageAutomations(newLead, "new");
    const whLog = {
      id: `wh-${Date.now()}`,
      brokerageId: targetBrokerage.id,
      source,
      payload: body,
      receivedAt: (/* @__PURE__ */ new Date()).toISOString(),
      processedLeadId: newLead.id,
      leadName: newLead.name,
      status: dupCheck.isDuplicate ? "duplicate_detected" : "success"
    };
    webhookLogs.unshift(whLog);
    broadcastSSE(targetBrokerage.id, "lead_created", newLead);
    broadcastSSE(targetBrokerage.id, "webhook_received", whLog);
    res.status(201).json({
      success: true,
      message: dupCheck.isDuplicate ? "Lead received. Known expat contact flagged to prevent double-contact." : "Lead received and processed successfully into pipeline.",
      leadId: newLead.id,
      brokerage: targetBrokerage.name,
      isDuplicate: dupCheck.isDuplicate,
      duplicateInfo: dupCheck.info
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to process webhook", details: String(err) });
  }
});
app.get("/api/analytics", (req, res) => {
  const brokerageId = req.query.brokerageId;
  let targetLeads = leads;
  let targetClients = clients;
  let targetTasks = tasks;
  let targetDocs = documents;
  if (brokerageId && brokerageId !== "all") {
    targetLeads = leads.filter((l) => l.brokerageId === brokerageId);
    targetClients = clients.filter((c) => c.brokerageId === brokerageId);
    targetTasks = tasks.filter((t) => t.brokerageId === brokerageId);
    targetDocs = documents.filter((d) => d.brokerageId === brokerageId);
  }
  const activeLeads = targetLeads.filter((l) => l.stageId !== "won" && l.stageId !== "lost");
  const wonLeads = targetLeads.filter((l) => l.stageId === "won");
  const activePipelineVolumeEur = activeLeads.reduce((sum, l) => sum + (l.requestedLoanAmount || 0), 0);
  const wonVolumeEur = wonLeads.reduce((sum, l) => sum + (l.requestedLoanAmount || 0), 0);
  const stageDistribution = {
    new: 0,
    contacted: 0,
    docs_needed: 0,
    under_review: 0,
    bank_submitted: 0,
    won: 0,
    lost: 0
  };
  targetLeads.forEach((l) => {
    if (stageDistribution[l.stageId] !== void 0) {
      stageDistribution[l.stageId]++;
    }
  });
  const visaDistribution = {};
  targetLeads.forEach((l) => {
    const v = l.visaStatus || "OTHER";
    visaDistribution[v] = (visaDistribution[v] || 0) + 1;
  });
  const now = Date.now();
  const overdueTasksCount = targetTasks.filter((t) => !t.completed && new Date(t.dueDate).getTime() < now).length;
  const verifiedDocsCount = targetDocs.filter((d) => d.status === "verified").length;
  const pendingDocsCount = targetDocs.filter((d) => d.status === "queued" || d.status === "checking").length;
  const totalLeads = targetLeads.length;
  const conversionRatePercent = totalLeads > 0 ? Math.round(wonLeads.length / totalLeads * 100) : 0;
  const avgLoanAmountEur = totalLeads > 0 ? Math.round(targetLeads.reduce((s, l) => s + l.requestedLoanAmount, 0) / totalLeads) : 45e4;
  const metrics = {
    totalLeads,
    activePipelineVolumeEur,
    wonVolumeEur,
    conversionRatePercent,
    avgLoanAmountEur,
    stageDistribution,
    visaDistribution,
    overdueTasksCount,
    pendingDocsCount,
    verifiedDocsCount
  };
  res.json({ success: true, metrics });
});
app.get("/api/db/status", (_req, res) => {
  const status = getDatabaseStatus({
    brokerages: brokerages.length,
    users: users.length,
    leads: leads.length,
    clients: clients.length,
    documents: documents.length,
    tasks: tasks.length,
    templates: emailTemplates.length,
    automations: automations.length,
    emailLogs: emailLogs.length,
    webhookLogs: webhookLogs.length
  });
  res.json({ success: true, database: status });
});
app.post("/api/seed/reset", (_req, res) => {
  brokerages = [...INITIAL_BROKERAGES];
  users = [...INITIAL_USERS];
  leads = [...INITIAL_LEADS];
  clients = [...INITIAL_CLIENTS];
  documents = [...INITIAL_DOCUMENTS];
  tasks = [...INITIAL_TASKS];
  emailTemplates = [...INITIAL_EMAIL_TEMPLATES];
  automations = [...INITIAL_STAGE_AUTOMATIONS];
  emailLogs = [...INITIAL_EMAIL_LOGS];
  webhookLogs = [...INITIAL_WEBHOOK_LOGS];
  broadcastSSE("all", "reset_data", { reset: true });
  res.json({ success: true, message: "LeadFlow sandbox data restored to factory defaults." });
});
app.get("/api/download/code", (req, res) => {
  const format = req.query.format || "zip";
  if (format === "zip") {
    const archivePath = path.resolve(projectRoot, "public", "leadflow-mern-project.zip");
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="leadflow-mern-project.zip"');
    return res.sendFile(archivePath);
  }
  const archivePath = path.resolve(projectRoot, "public", "leadflow-mern-project.tar.gz");
  res.setHeader("Content-Type", "application/gzip");
  res.setHeader("Content-Disposition", 'attachment; filename="leadflow-mern-project.tar.gz"');
  res.sendFile(archivePath);
});
app.get("/api/download/zip", (_req, res) => {
  const archivePath = path.resolve(projectRoot, "public", "leadflow-mern-project.zip");
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="leadflow-mern-project.zip"');
  res.sendFile(archivePath);
});
app.get("/project.zip", (_req, res) => {
  const archivePath = path.resolve(projectRoot, "public", "project.zip");
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="leadflow-mern-project.zip"');
  res.sendFile(archivePath);
});
async function startServer() {
  await initDatabaseConnection();
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: projectRoot,
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(projectRoot, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LeadFlow Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
