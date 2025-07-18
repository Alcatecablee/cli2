// Shared in-memory data store
// In production, replace with actual database (PostgreSQL, MongoDB, etc.)

// Global data stores - shared across all API routes
// Use globalThis to persist across hot reloads in development
const initDataStore = () => ({
  // Authentication & API Keys
  apiKeys: new Map(),
  userApiKeys: new Map(),

  // Projects & Files
  projects: new Map(),
  projectFiles: new Map(),
  projectAnalyses: new Map(),

  // Teams & Collaboration
  teams: new Map(),
  teamMembers: new Map(),
  teamProjects: new Map(),
  invitations: new Map(),

  // Webhooks & Notifications
  webhooks: new Map(),
  userWebhooks: new Map(),
  webhookEvents: new Map(),

  // CI/CD Integrations
  integrations: new Map(),
  userIntegrations: new Map(),
  integrationRuns: new Map(),

  // Dashboard Sessions
  dashboardSessions: new Map(),

  // Collaboration System
  collaborationSessions: new Map(),
  collaborationParticipants: new Map(),
  collaborationComments: new Map(),
  collaborationAnalysis: new Map(),
  collaborationPresence: new Map(),
  collaborationActivity: new Map(),

  // Demo rate limiting
  requestCounts: new Map(),
});

export const dataStore =
  (globalThis as any).dataStore ||
  ((globalThis as any).dataStore = (() => {
    console.log("[DATA STORE] Initializing new data store");
    return initDataStore();
  })());

// Log current state for debugging
console.log(
  "[DATA STORE] Current sessions:",
  dataStore.collaborationSessions.size,
);

// Utility functions for data operations
export const dataUtils = {
  // API Key utilities
  validateApiKey: (key: string): any => {
    for (const apiKey of dataStore.apiKeys.values()) {
      if (apiKey.key === key && apiKey.isActive) {
        // Check expiration
        if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
          return null;
        }
        return apiKey;
      }
    }
    return null;
  },

  // Rate limiting utilities
  checkApiRateLimit: (apiKey: any): { allowed: boolean; remaining: number } => {
    const now = Date.now();
    const hourWindow = 60 * 60 * 1000;
    const dayWindow = 24 * 60 * 60 * 1000;

    // Reset counters if needed
    if (now - (apiKey.lastHourReset || 0) > hourWindow) {
      apiKey.hourlyUsage = 0;
      apiKey.lastHourReset = now;
    }

    if (now - (apiKey.lastDayReset || 0) > dayWindow) {
      apiKey.dailyUsage = 0;
      apiKey.lastDayReset = now;
    }

    const hourlyAllowed =
      (apiKey.hourlyUsage || 0) < apiKey.rateLimit.requestsPerHour;
    const dailyAllowed =
      (apiKey.dailyUsage || 0) < apiKey.rateLimit.requestsPerDay;

    return {
      allowed: hourlyAllowed && dailyAllowed,
      remaining: Math.min(
        apiKey.rateLimit.requestsPerHour - (apiKey.hourlyUsage || 0),
        apiKey.rateLimit.requestsPerDay - (apiKey.dailyUsage || 0),
      ),
    };
  },

  // Webhook trigger utility
  triggerWebhook: async (
    userId: string,
    event: string,
    payload: any,
  ): Promise<void> => {
    try {
      const userHooks = dataStore.userWebhooks.get(userId) || [];

      for (const hookId of userHooks) {
        const webhook = dataStore.webhooks.get(hookId);
        if (!webhook || !webhook.isActive || !webhook.events.includes(event)) {
          continue;
        }

        const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        const webhookEvent = {
          id: eventId,
          webhookId: hookId,
          event,
          payload,
          timestamp: new Date().toISOString(),
          status: "pending",
          retryCount: 0,
        };

        dataStore.webhookEvents.set(eventId, webhookEvent);

        // Trigger webhook call asynchronously
        triggerWebhookCall(webhook, webhookEvent).catch(console.error);
      }
    } catch (error) {
      console.error("Webhook trigger error:", error);
    }
  },

  // Session utilities for dashboard
  validateSession: (sessionId?: string) => {
    if (!sessionId) {
      // Create a new free session
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      dataStore.dashboardSessions.set(newSessionId, {
        created: Date.now(),
        lastUsed: Date.now(),
        analysisCount: 0,
        plan: "free",
      });
      return {
        sessionId: newSessionId,
        session: dataStore.dashboardSessions.get(newSessionId)!,
      };
    }

    const session = dataStore.dashboardSessions.get(sessionId);
    if (!session) {
      // Session expired or invalid, create new one
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      dataStore.dashboardSessions.set(newSessionId, {
        created: Date.now(),
        lastUsed: Date.now(),
        analysisCount: 0,
        plan: "free",
      });
      return {
        sessionId: newSessionId,
        session: dataStore.dashboardSessions.get(newSessionId)!,
      };
    }

    // Update last used
    session.lastUsed = Date.now();
    return { sessionId, session };
  },
};

// Helper function for webhook calls (internal)
const triggerWebhookCall = async (webhook: any, event: any): Promise<void> => {
  try {
    const payload = JSON.stringify({
      event: event.event,
      timestamp: event.timestamp,
      data: event.payload,
    });

    const crypto = await import("crypto");
    const signature = crypto
      .createHmac("sha256", webhook.secret)
      .update(payload)
      .digest("hex");

    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-NeuroLint-Signature": `sha256=${signature}`,
        "X-NeuroLint-Event": event.event,
        "X-NeuroLint-Delivery": event.id,
        ...webhook.headers,
      },
      body: payload,
    });

    const updatedEvent = {
      ...event,
      status: response.ok ? "success" : "failed",
      response: await response.text(),
    };

    dataStore.webhookEvents.set(event.id, updatedEvent);

    // Update webhook stats
    const updatedWebhook = {
      ...webhook,
      lastTriggered: new Date().toISOString(),
      totalCalls: (webhook.totalCalls || 0) + 1,
      failureCount: response.ok
        ? webhook.failureCount || 0
        : (webhook.failureCount || 0) + 1,
    };

    dataStore.webhooks.set(webhook.id, updatedWebhook);
  } catch (error) {
    console.error("Webhook call error:", error);

    const updatedEvent = {
      ...event,
      status: "failed" as const,
      response: error instanceof Error ? error.message : "Unknown error",
    };

    dataStore.webhookEvents.set(event.id, updatedEvent);

    // Update failure count
    const updatedWebhook = {
      ...webhook,
      failureCount: (webhook.failureCount || 0) + 1,
    };

    dataStore.webhooks.set(webhook.id, updatedWebhook);
  }
};

// Export individual stores for backward compatibility
export const {
  apiKeys,
  userApiKeys,
  projects,
  projectFiles,
  projectAnalyses,
  teams,
  teamMembers,
  teamProjects,
  invitations,
  webhooks,
  userWebhooks,
  webhookEvents,
  integrations,
  userIntegrations,
  integrationRuns,
  dashboardSessions,
  requestCounts,
} = dataStore;
