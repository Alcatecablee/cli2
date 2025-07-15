import crypto from "crypto";

// In-memory storage for demo purposes - replace with database in production
export const apiKeys = new Map();
export const userApiKeys = new Map();

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  isActive: boolean;
  usageCount: number;
  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

export const generateApiKey = (): string => {
  const prefix = "nlp_";
  const key = crypto.randomBytes(32).toString("hex");
  return prefix + key;
};

// Utility function to validate API key (for use in other routes)
export const validateApiKey = (key: string): ApiKey | null => {
  for (const apiKey of apiKeys.values()) {
    if (apiKey.key === key && apiKey.isActive) {
      // Check expiration
      if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
        return null;
      }
      return apiKey;
    }
  }
  return null;
};
