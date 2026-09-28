import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
const AppContext = createContext(void 0);
export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState("advisor");
  const [currentBrokerageId, setCurrentBrokerageId] = useState("brk-hypolink-berlin");
  const [currentUserId, setCurrentUserId] = useState("usr-marcus-weber");
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("leadflow_token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("leadflow_token"));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [brokerages, setBrokerages] = useState([]);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [metrics, setMetrics] = useState();
  const [toasts, setToasts] = useState([]);
  const [isSseConnected, setIsSseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("landing"); // "landing" as default initial view
  const eventSourceRef = useRef(null);
  const addToast = useCallback((type, title, message) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [{ id, type, title, message, timestamp: Date.now() }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6e3);
  }, []);
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const refreshData = useCallback(async () => {
    try {
      const bParam = currentRole === "platform_admin" ? "all" : currentBrokerageId;
      const [
        bRes,
        uRes,
        lRes,
        cRes,
        dRes,
        tRes,
        tmplRes,
        autoRes,
        elogRes,
        whRes,
        metRes
      ] = await Promise.all([
        fetch("/api/brokerages").then((r) => r.json()),
        fetch(`/api/users?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/leads?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/clients?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/documents?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/tasks?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/templates?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/automations?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/emails/logs?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/webhooks/logs?brokerageId=${bParam}`).then((r) => r.json()),
        fetch(`/api/analytics?brokerageId=${bParam}`).then((r) => r.json())
      ]);
      if (bRes.brokerages) setBrokerages(bRes.brokerages);
      if (uRes.users) setUsers(uRes.users);
      if (lRes.leads) setLeads(lRes.leads);
      if (cRes.clients) setClients(cRes.clients);
      if (dRes.documents) setDocuments(dRes.documents);
      if (tRes.tasks) setTasks(tRes.tasks);
      if (tmplRes.templates) setTemplates(tmplRes.templates);
      if (autoRes.automations) setAutomations(autoRes.automations);
      if (elogRes.logs) setEmailLogs(elogRes.logs);
      if (whRes.logs) setWebhookLogs(whRes.logs);
      if (metRes.metrics) setMetrics(metRes.metrics);
    } catch (err) {
      console.error("Failed to load LeadFlow data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentRole, currentBrokerageId]);
  useEffect(() => {
    const bParam = currentRole === "platform_admin" ? "all" : currentBrokerageId;
    const es = new EventSource(`/api/events?brokerageId=${bParam}`);
    eventSourceRef.current = es;
    es.onopen = () => {
      setIsSseConnected(true);
    };
    es.onerror = () => {
      setIsSseConnected(false);
    };
    es.addEventListener("lead_created", (e) => {
      const newLead = JSON.parse(e.data);
      setLeads((prev) => [newLead, ...prev.filter((l) => l.id !== newLead.id)]);
      if (newLead.duplicateInfo?.isDuplicate) {
        addToast("warning", "\u26A0\uFE0F Returning Expat Inbound", `${newLead.name} already known by brokerage! Flagged to prevent double-contact.`);
      } else {
        addToast("info", "\u26A1 New Expat Lead Received", `${newLead.name} (${newLead.nationality}) requesting \u20AC${newLead.requestedLoanAmount.toLocaleString()}`);
      }
      refreshData();
    });
    es.addEventListener("lead_stage_changed", (e) => {
      const { lead } = JSON.parse(e.data);
      setLeads((prev) => prev.map((l) => l.id === lead.id ? lead : l));
      refreshData();
    });
    es.addEventListener("lead_updated", (e) => {
      const lead = JSON.parse(e.data);
      setLeads((prev) => prev.map((l) => l.id === lead.id ? lead : l));
      refreshData();
    });
    es.addEventListener("client_created", (e) => {
      const newClient = JSON.parse(e.data);
      setClients((prev) => [newClient, ...prev]);
      addToast("success", "\u{1F389} Expat Converted to Client", `${newClient.name} portal activated (Case: ${newClient.caseNumber})`);
      refreshData();
    });
    es.addEventListener("doc_uploaded", (e) => {
      const doc = JSON.parse(e.data);
      setDocuments((prev) => [doc, ...prev.filter((d) => d.id !== doc.id)]);
      refreshData();
    });
    es.addEventListener("doc_status_changed", (e) => {
      const doc = JSON.parse(e.data);
      setDocuments((prev) => prev.map((d) => d.id === doc.id ? doc : d));
      if (doc.status === "verified") {
        addToast("success", "\u2705 Document Verified", `${doc.title} passed German bank underwriting check (${doc.bankReadinessScore}% score)`);
      } else if (doc.status === "rejected") {
        addToast("error", "\u26A0\uFE0F Document Rejected", `${doc.title}: ${doc.failureReason}`);
      }
      refreshData();
    });
    es.addEventListener("task_created", (e) => {
      const task = JSON.parse(e.data);
      setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]);
      refreshData();
    });
    es.addEventListener("task_updated", (e) => {
      const task = JSON.parse(e.data);
      setTasks((prev) => prev.map((t) => t.id === task.id ? task : t));
      refreshData();
    });
    es.addEventListener("email_sent", (e) => {
      const elog = JSON.parse(e.data);
      setEmailLogs((prev) => [elog, ...prev]);
      addToast("info", "\u2709\uFE0F Automated Email Sent", `Sent "${elog.templateName}" to ${elog.recipientName}`);
      refreshData();
    });
    es.addEventListener("reset_data", () => {
      addToast("info", "System Reset", "Demo data restored to initial state.");
      refreshData();
    });
    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [currentRole, currentBrokerageId, refreshData, addToast]);
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  const switchRole = useCallback((role, bId, uId) => {
    setCurrentRole(role);
    if (role === "platform_admin") {
      setCurrentUserId("usr-platform-admin");
    } else if (role === "client") {
      const targetBId = bId || currentBrokerageId || "brk-hypolink-berlin";
      setCurrentBrokerageId(targetBId);
      setCurrentUserId("usr-client-liam");
    } else if (role === "brokerage_admin") {
      const targetBId = bId || currentBrokerageId || "brk-hypolink-berlin";
      setCurrentBrokerageId(targetBId);
      const adminUser = users.find((u) => u.brokerageId === targetBId && u.role === "brokerage_admin");
      setCurrentUserId(uId || adminUser?.id || "usr-elena-admin");
    } else {
      const targetBId = bId || currentBrokerageId || "brk-hypolink-berlin";
      setCurrentBrokerageId(targetBId);
      const advUser = users.find((u) => u.brokerageId === targetBId && u.role === "advisor");
      setCurrentUserId(uId || advUser?.id || "usr-marcus-weber");
    }
  }, [currentBrokerageId, users]);
  const switchBrokerage = useCallback((bId) => {
    setCurrentBrokerageId(bId);
    const matchUser = users.find((u) => u.brokerageId === bId && u.role === (currentRole === "platform_admin" ? "advisor" : currentRole));
    if (matchUser) {
      setCurrentUserId(matchUser.id);
    }
  }, [currentRole, users]);

  const login = useCallback((user, token) => {
    setIsAuthenticated(true);
    setAuthToken(token);
    setCurrentUserId(user.id);
    setCurrentRole(user.role);
    if (user.brokerageId && user.brokerageId !== "all") {
      setCurrentBrokerageId(user.brokerageId);
    }
    setViewMode("crm");
    setIsLoginModalOpen(false);
    addToast("success", `Welcome back, ${user.name}!`, `Authenticated as ${user.jobTitle || user.role}.`);
  }, [addToast]);

  const logout = useCallback(() => {
    localStorage.removeItem("leadflow_token");
    localStorage.removeItem("leadflow_user");
    setAuthToken(null);
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
    addToast("info", "Logged Out", "You have securely signed out of LeadFlow CRM.");
  }, [addToast]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);
  const moveLeadStage = async (leadId, newStageId) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, stageId: newStageId, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : l));
    try {
      const res = await fetch(`/api/leads/${leadId}/move-stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStageId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      console.error(err);
      refreshData();
    }
  };
  const createLead = async (data) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brokerageId: currentBrokerageId,
          ...data
        })
      });
      const json = await res.json();
      if (json.lead) {
        setLeads((prev) => [json.lead, ...prev]);
        return json.lead;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  const convertLeadToClient = async (leadId) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      if (json.client) {
        setClients((prev) => [json.client, ...prev]);
        if (json.lead) {
          setLeads((prev) => prev.map((l) => l.id === json.lead.id ? json.lead : l));
        }
        return json.client;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  const uploadDocument = async (requirementCode, fileName, fileSize) => {
    const activeClient = clients.find((c) => c.brokerageId === currentBrokerageId) || clients[0];
    if (!activeClient) {
      addToast("error", "No Active Client", "Please convert a lead to a client first or select Liam Davies.");
      return;
    }
    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: activeClient.id,
          brokerageId: activeClient.brokerageId,
          requirementCode,
          fileName: fileName || `${requirementCode}_scan.pdf`,
          fileSize: fileSize || 215e4,
          fileType: "application/pdf"
        })
      });
      const json = await res.json();
      if (json.document) {
        setDocuments((prev) => [json.document, ...prev]);
        addToast("info", "Document Queued", `${json.document.title} queued for async German bank underwriting check.`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const reviewDocument = async (docId, status, notes, approved) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, advisorReviewNotes: notes, advisorApproved: approved })
      });
      const json = await res.json();
      if (json.document) {
        setDocuments((prev) => prev.map((d) => d.id === docId ? json.document : d));
        addToast("success", "Document Updated", `Review saved for ${json.document.title}`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const toggleTask = async (taskId) => {
    setTasks(
      (prev) => prev.map((t) => t.id === taskId ? { ...t, completed: !t.completed, isOverdue: false } : t)
    );
    try {
      await fetch(`/api/tasks/${taskId}/toggle`, { method: "PATCH" });
    } catch (err) {
      console.error(err);
      refreshData();
    }
  };
  const createTask = async (data) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brokerageId: currentBrokerageId,
          ...data
        })
      });
      const json = await res.json();
      if (json.task) {
        setTasks((prev) => [json.task, ...prev]);
        addToast("success", "Task Created", json.task.title);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const addLeadNote = async (leadId, noteData) => {
    try {
      const author = currentUser || {
        id: currentUserId,
        name: "Senior Mortgage Advisor",
        jobTitle: "Advisor",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
      };
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: author.id,
          authorName: author.name,
          authorRole: author.jobTitle,
          authorAvatar: author.avatar,
          ...noteData
        })
      });
      const json = await res.json();
      if (json.lead) {
        setLeads((prev) => prev.map((l) => l.id === leadId ? json.lead : l));
        addToast("success", "Advisor Note Saved", "Financial nuances and meeting notes updated.");
      }
    } catch (err) {
      console.error(err);
      addToast("error", "Failed to Save Note", "Please try again.");
    }
  };
  const togglePinLeadNote = async (leadId, noteId, pinned) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned })
      });
      const json = await res.json();
      if (json.lead) {
        setLeads((prev) => prev.map((l) => l.id === leadId ? json.lead : l));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const deleteLeadNote = async (leadId, noteId) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/notes/${noteId}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.lead) {
        setLeads((prev) => prev.map((l) => l.id === leadId ? json.lead : l));
        addToast("info", "Note Deleted", "Advisor note removed from lead record.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const saveTemplate = async (data) => {
    try {
      const isEdit = Boolean(data.id);
      const url = isEdit ? `/api/templates/${data.id}` : "/api/templates";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brokerageId: currentBrokerageId,
          ...data
        })
      });
      const json = await res.json();
      if (json.template) {
        setTemplates((prev) => {
          if (isEdit) {
            return prev.map((t) => t.id === json.template.id ? json.template : t);
          }
          return [...prev, json.template];
        });
        addToast("success", "Email Template Saved", json.template.name);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const saveAutomation = async (data) => {
    try {
      const res = await fetch("/api/automations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brokerageId: currentBrokerageId,
          ...data
        })
      });
      const json = await res.json();
      if (json.automation) {
        setAutomations((prev) => {
          const idx = prev.findIndex((a) => a.brokerageId === json.automation.brokerageId && a.stageId === json.automation.stageId);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = json.automation;
            return next;
          }
          return [...prev, json.automation];
        });
        addToast("success", "Stage Automation Updated", `Rules applied to ${json.automation.stageId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const sendWebhookPayload = async (source, payload, slug) => {
    const targetSlug = slug || currentBrokerage?.slug || "hypolink-berlin";
    try {
      const res = await fetch(`/api/webhooks/leads/${targetSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          ...payload
        })
      });
      const json = await res.json();
      return {
        success: res.ok,
        message: json.message || "Webhook processed",
        isDuplicate: json.isDuplicate
      };
    } catch (err) {
      return {
        success: false,
        message: String(err)
      };
    }
  };
  const resetDemoData = async () => {
    try {
      await fetch("/api/seed/reset", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };
  const currentBrokerage = brokerages.find((b) => b.id === currentBrokerageId) || brokerages[0];
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentClientCase = clients.find((c) => c.brokerageId === currentBrokerageId) || clients[0];
  return <AppContext.Provider
    value={{
      currentRole,
      currentBrokerageId,
      currentUserId,
      currentBrokerage,
      currentUser,
      currentClientCase,
      isAuthenticated,
      authToken,
      isLoginModalOpen,
      login,
      logout,
      openLoginModal,
      closeLoginModal,
      brokerages,
      users,
      leads,
      clients,
      documents,
      tasks,
      templates,
      automations,
      emailLogs,
      webhookLogs,
      metrics,
      viewMode,
      setViewMode,
      toasts,
      isSseConnected,
      isLoading,
      switchRole,
      switchBrokerage,
      moveLeadStage,
      createLead,
      convertLeadToClient,
      uploadDocument,
      reviewDocument,
      toggleTask,
      createTask,
      addLeadNote,
      togglePinLeadNote,
      deleteLeadNote,
      saveTemplate,
      saveAutomation,
      sendWebhookPayload,
      resetDemoData,
      dismissToast,
      addToast,
      refreshData
    }}
  >
      {children}
    </AppContext.Provider>;
};
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
