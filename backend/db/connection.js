import mongoose from "mongoose";
import {
  BrokerageModel,
  UserModel,
  LeadModel,
  ClientModel,
  ClientDocumentModel,
  TaskModel,
  EmailTemplateModel,
  StageAutomationModel,
  EmailLogModel,
  WebhookLogModel
} from "./models.js";
import {
  INITIAL_BROKERAGES,
  INITIAL_USERS,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  INITIAL_DOCUMENTS,
  INITIAL_TASKS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_STAGE_AUTOMATIONS,
  INITIAL_EMAIL_LOGS,
  INITIAL_WEBHOOK_LOGS
} from "../data/mockData.js";
let isMongoConnected = false;
let mongoConnectionError = null;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/leadflow";
export async function initDatabaseConnection() {
  console.log(`[MERN Stack] Initializing Mongoose connection to: ${MONGODB_URI}`);
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    isMongoConnected = true;
    mongoConnectionError = null;
    console.log("[MERN Stack] Successfully connected to live MongoDB daemon via Mongoose!");
    await seedMongooseCollections();
  } catch (err) {
    isMongoConnected = false;
    mongoConnectionError = err.message;
    console.log(
      `[MERN Stack] No external MongoDB daemon at ${MONGODB_URI} (${err.message}).`
    );
    console.log("[MERN Stack] Running with MERN in-memory BSON document repository with full Mongoose schema validation.");
  }
}
async function seedMongooseCollections() {
  try {
    const bCount = await BrokerageModel.countDocuments();
    if (bCount === 0) {
      console.log("[MERN Stack] Seeding initial MongoDB collections...");
      await BrokerageModel.insertMany(
        INITIAL_BROKERAGES.map((b) => ({ ...b, _id: b.id }))
      );
      await UserModel.insertMany(
        INITIAL_USERS.map((u) => ({ ...u, _id: u.id }))
      );
      await LeadModel.insertMany(
        INITIAL_LEADS.map((l) => ({ ...l, _id: l.id }))
      );
      await ClientModel.insertMany(
        INITIAL_CLIENTS.map((c) => ({ ...c, _id: c.id }))
      );
      await ClientDocumentModel.insertMany(
        INITIAL_DOCUMENTS.map((d) => ({ ...d, _id: d.id }))
      );
      await TaskModel.insertMany(
        INITIAL_TASKS.map((t) => ({ ...t, _id: t.id }))
      );
      await EmailTemplateModel.insertMany(
        INITIAL_EMAIL_TEMPLATES.map((tmpl) => ({ ...tmpl, _id: tmpl.id }))
      );
      await StageAutomationModel.insertMany(
        INITIAL_STAGE_AUTOMATIONS.map((a) => ({ ...a, _id: a.id }))
      );
      await EmailLogModel.insertMany(
        INITIAL_EMAIL_LOGS.map((elog) => ({ ...elog, _id: elog.id }))
      );
      await WebhookLogModel.insertMany(
        INITIAL_WEBHOOK_LOGS.map((wh) => ({ ...wh, _id: wh.id }))
      );
      console.log("[MERN Stack] MongoDB collections seeded successfully!");
    }
  } catch (err) {
    console.error("[MERN Stack] Error seeding MongoDB:", err);
  }
}
export function getDatabaseStatus(counts) {
  return {
    connected: isMongoConnected,
    mode: isMongoConnected ? "mongodb" : "embedded_memory",
    uri: MONGODB_URI.replace(/:[^:@]+@/, ":****@"),
    // mask password if any
    connectionError: mongoConnectionError,
    mongooseVersion: mongoose.version,
    databaseName: mongoose.connection?.name || "leadflow",
    collections: counts
  };
}
