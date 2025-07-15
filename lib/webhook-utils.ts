import crypto from "crypto";

// In-memory storage for demo purposes
export const webhooks = new Map();
export const userWebhooks = new Map();
export const webhookEvents = new Map();

export interface Webhook {
  id: string;
  url: string;
  name: string;
  userId: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered: string | null;
  totalCalls: number;
  failureCount: number;
  headers?: Record<string, string>;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  timestamp: string;
  status: "success" | "failed" | "pending";
  response?: string;
  retryCount: number;
}

export const generateSecret = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const signPayload = (payload: string, secret: string): string => {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
};

export const availableEvents = [
  "analysis.completed",
  "analysis.failed",
  "project.created",
  "project.updated",
  "project.deleted",
  "file.uploaded",
  "file.analyzed",
  "bulk.completed",
  "user.subscribed",
  "user.upgraded",
];

// Utility function to trigger webhooks (for use in other routes)
export const triggerWebhook = async (
  userId: string,
  event: string,
  payload: any,
): Promise<void> => {
  try {
    const userHooks = userWebhooks.get(userId) || [];

    for (const hookId of userHooks) {
      const webhook = webhooks.get(hookId);
      if (!webhook || !webhook.isActive || !webhook.events.includes(event)) {
        continue;
      }

      const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const webhookEvent: WebhookEvent = {
        id: eventId,
        webhookId: hookId,
        event,
        payload,
        timestamp: new Date().toISOString(),
        status: "pending",
        retryCount: 0,
      };

      webhookEvents.set(eventId, webhookEvent);

      // Trigger webhook asynchronously
      triggerWebhookCall(webhook, webhookEvent).catch(console.error);
    }
  } catch (error) {
    console.error("Webhook trigger error:", error);
  }
};

const triggerWebhookCall = async (
  webhook: Webhook,
  event: WebhookEvent,
): Promise<void> => {
  try {
    const payload = JSON.stringify({
      event: event.event,
      timestamp: event.timestamp,
      data: event.payload,
    });

    const signature = signPayload(payload, webhook.secret);

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

    webhookEvents.set(event.id, updatedEvent);

    // Update webhook stats
    const updatedWebhook = {
      ...webhook,
      lastTriggered: new Date().toISOString(),
      totalCalls: webhook.totalCalls + 1,
      failureCount: response.ok
        ? webhook.failureCount
        : webhook.failureCount + 1,
    };

    webhooks.set(webhook.id, updatedWebhook);
  } catch (error) {
    console.error("Webhook call error:", error);

    const updatedEvent = {
      ...event,
      status: "failed" as const,
      response: error instanceof Error ? error.message : String(error),
    };

    webhookEvents.set(event.id, updatedEvent);

    // Update failure count
    const updatedWebhook = {
      ...webhook,
      failureCount: webhook.failureCount + 1,
    };

    webhooks.set(webhook.id, updatedWebhook);
  }
};
