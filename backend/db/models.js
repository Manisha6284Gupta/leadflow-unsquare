import mongoose, { Schema } from "mongoose";
export const BrokerageSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    apiKey: { type: String, required: true },
    city: { type: String, default: "Berlin" },
    country: { type: String, default: "Germany" },
    primaryColor: { type: String, default: "#2563EB" },
    contactEmail: { type: String, required: true },
    defaultAdvisorId: { type: String },
    totalVolumeEur: { type: Number, default: 0 }
  },
  { timestamps: true, _id: false }
);
export const UserSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ["platform_admin", "brokerage_admin", "advisor", "client"],
      default: "advisor"
    },
    avatar: { type: String },
    phone: { type: String },
    jobTitle: { type: String },
    isOnline: { type: Boolean, default: true }
  },
  { timestamps: true, _id: false }
);
export const AdvisorNoteSchema = new Schema(
  {
    id: { type: String, required: true },
    leadId: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String },
    authorAvatar: { type: String },
    category: {
      type: String,
      enum: ["meeting_summary", "financial_nuance", "bank_criteria", "general"],
      default: "general"
    },
    content: { type: String, required: true },
    tags: [{ type: String }],
    pinned: { type: Boolean, default: false },
    createdAt: { type: String, required: true },
    updatedAt: { type: String }
  },
  { _id: false }
);
export const DuplicateInfoSchema = new Schema(
  {
    isDuplicate: { type: Boolean, default: false },
    matchType: { type: String, enum: ["email", "phone", "name_exact"] },
    matchedEntityId: { type: String },
    matchedEntityType: { type: String, enum: ["lead", "client"] },
    matchedName: { type: String },
    matchedEmail: { type: String },
    matchedStage: { type: String },
    matchedAdvisorName: { type: String },
    matchedDate: { type: String },
    details: { type: String }
  },
  { _id: false }
);
export const LeadSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: "+49 176 00000000" },
    nationality: { type: String, default: "Expat" },
    visaStatus: {
      type: String,
      enum: ["EU_CITIZEN", "EU_BLUE_CARD", "PERMANENT_RESIDENCY", "WORK_VISA", "FREELANCE_VISA"],
      default: "EU_BLUE_CARD"
    },
    employmentType: {
      type: String,
      enum: ["PERMANENT_EMPLOYEE", "PROBATION", "FREELANCER_SELF_EMPLOYED", "PUBLIC_SECTOR"],
      default: "PERMANENT_EMPLOYEE"
    },
    monthlyNetIncome: { type: Number, default: 5e3 },
    propertyCity: { type: String, default: "Berlin" },
    propertyPrice: { type: Number, default: 5e5 },
    downPayment: { type: Number, default: 1e5 },
    requestedLoanAmount: { type: Number, default: 4e5 },
    source: { type: String, default: "Web Form" },
    stageId: {
      type: String,
      enum: ["new", "contacted", "docs_needed", "under_review", "bank_submitted", "won", "lost"],
      default: "new",
      index: true
    },
    assignedAdvisorId: { type: String, index: true },
    duplicateInfo: { type: DuplicateInfoSchema },
    convertedToClientId: { type: String },
    notes: { type: String },
    advisorNotes: [AdvisorNoteSchema]
  },
  { timestamps: true, _id: false }
);
export const ClientSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    leadId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    nationality: { type: String },
    visaStatus: { type: String },
    employmentType: { type: String },
    monthlyNetIncome: { type: Number },
    propertyCity: { type: String },
    propertyPrice: { type: Number },
    downPayment: { type: Number },
    loanAmount: { type: Number },
    assignedAdvisorId: { type: String },
    caseNumber: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["document_collection", "bank_review", "notary_pending", "loan_approved"],
      default: "document_collection"
    },
    accessPin: { type: String, required: true }
  },
  { timestamps: true, _id: false }
);
export const ClientDocumentSchema = new Schema(
  {
    _id: { type: String, required: true },
    clientId: { type: String, required: true, index: true },
    brokerageId: { type: String, required: true, index: true },
    requirementCode: { type: String, required: true },
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    fileType: { type: String, default: "application/pdf" },
    uploadedAt: { type: String, required: true },
    status: {
      type: String,
      enum: ["queued", "checking", "verified", "rejected"],
      default: "queued",
      index: true
    },
    progressPercent: { type: Number, default: 0 },
    failureReason: { type: String },
    extractedData: {
      employerName: String,
      monthlySalaryEur: Number,
      issueDate: String,
      schufaScore: Number,
      passportValidUntil: String,
      addressVerified: Boolean
    },
    bankReadinessScore: { type: Number, default: 0 },
    advisorReviewNotes: { type: String },
    advisorApproved: { type: Boolean },
    checkedAt: { type: String }
  },
  { timestamps: true, _id: false }
);
export const TaskSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    leadId: { type: String, index: true },
    clientId: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    assignedAdvisorId: { type: String, required: true, index: true },
    dueDate: { type: String, required: true, index: true },
    isOverdue: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    completedAt: { type: String },
    stageTriggeredFrom: { type: String },
    priority: { type: String, enum: ["urgent", "high", "normal"], default: "normal" }
  },
  { timestamps: true, _id: false }
);
export const EmailTemplateSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    description: { type: String }
  },
  { timestamps: true, _id: false }
);
export const StageAutomationSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    stageId: { type: String, required: true },
    sendEmailTemplateId: { type: String },
    emailRecipient: { type: String, enum: ["client", "advisor"], default: "client" },
    autoCreateTasks: [
      {
        title: { type: String, required: true },
        dueInHours: { type: Number, default: 2 },
        priority: { type: String, enum: ["urgent", "high", "normal"], default: "normal" },
        description: { type: String }
      }
    ]
  },
  { timestamps: true, _id: false }
);
export const EmailLogSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    leadId: { type: String },
    clientId: { type: String },
    recipientEmail: { type: String, required: true },
    recipientName: { type: String, required: true },
    templateName: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: String, required: true },
    status: { type: String, enum: ["sent", "delivered"], default: "delivered" }
  },
  { timestamps: true, _id: false }
);
export const WebhookLogSchema = new Schema(
  {
    _id: { type: String, required: true },
    brokerageId: { type: String, required: true, index: true },
    source: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
    receivedAt: { type: String, required: true },
    processedLeadId: { type: String },
    leadName: { type: String },
    status: { type: String, enum: ["success", "duplicate_detected", "error"], default: "success" },
    errorMessage: { type: String }
  },
  { timestamps: true, _id: false }
);
export const BrokerageModel = mongoose.models.Brokerage || mongoose.model("Brokerage", BrokerageSchema);
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export const LeadModel = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
export const ClientModel = mongoose.models.Client || mongoose.model("Client", ClientSchema);
export const ClientDocumentModel = mongoose.models.ClientDocument || mongoose.model("ClientDocument", ClientDocumentSchema);
export const TaskModel = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export const EmailTemplateModel = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
export const StageAutomationModel = mongoose.models.StageAutomation || mongoose.model("StageAutomation", StageAutomationSchema);
export const EmailLogModel = mongoose.models.EmailLog || mongoose.model("EmailLog", EmailLogSchema);
export const WebhookLogModel = mongoose.models.WebhookLog || mongoose.model("WebhookLog", WebhookLogSchema);
