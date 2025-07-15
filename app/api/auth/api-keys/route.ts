import { NextRequest, NextResponse } from "next/server";
import {
  apiKeys,
  userApiKeys,
  generateApiKey,
  type ApiKey,
} from "@/lib/api-key-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const keyId = searchParams.get("keyId");

    if (keyId) {
      // Get specific API key
      const apiKey = apiKeys.get(keyId);
      if (!apiKey || apiKey.userId !== userId) {
        return NextResponse.json(
          { error: "API key not found" },
          { status: 404 },
        );
      }

      // Don't return the actual key value for security
      const { key, ...safeApiKey } = apiKey;
      return NextResponse.json({
        apiKey: {
          ...safeApiKey,
          keyPreview: key.substring(0, 12) + "..." + key.slice(-4),
        },
      });
    }

    // Get all API keys for user
    const userKeys = userApiKeys.get(userId) || [];
    const keys = userKeys
      .map((keyId: string) => {
        const apiKey = apiKeys.get(keyId);
        if (!apiKey) return null;

        const { key, ...safeApiKey } = apiKey;
        return {
          ...safeApiKey,
          keyPreview: key.substring(0, 12) + "..." + key.slice(-4),
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      apiKeys: keys,
      total: keys.length,
    });
  } catch (error) {
    console.error("API keys GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      permissions = ["analyze", "projects"],
      expiresInDays,
      rateLimit = { requestsPerHour: 100, requestsPerDay: 1000 },
      userId = "demo-user",
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "API key name is required" },
        { status: 400 },
      );
    }

    const keyId = `key_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const key = generateApiKey();

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const apiKey: ApiKey = {
      id: keyId,
      key,
      name,
      userId,
      permissions,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      expiresAt,
      isActive: true,
      usageCount: 0,
      rateLimit,
    };

    apiKeys.set(keyId, apiKey);

    // Add to user's key list
    const userKeys = userApiKeys.get(userId) || [];
    userKeys.push(keyId);
    userApiKeys.set(userId, userKeys);

    return NextResponse.json(
      {
        apiKey: {
          id: keyId,
          key, // Return the key only on creation
          name,
          permissions,
          expiresAt,
          rateLimit,
        },
        message:
          "API key created successfully. Please save this key as it won't be shown again.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API keys POST error:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyId, updates, userId = "demo-user" } = body;

    if (!keyId) {
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 },
      );
    }

    const apiKey = apiKeys.get(keyId);
    if (!apiKey || apiKey.userId !== userId) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    const updatedApiKey = {
      ...apiKey,
      ...updates,
      // Prevent updating sensitive fields
      id: apiKey.id,
      key: apiKey.key,
      userId: apiKey.userId,
      createdAt: apiKey.createdAt,
    };

    apiKeys.set(keyId, updatedApiKey);

    const { key, ...safeApiKey } = updatedApiKey;
    return NextResponse.json({
      apiKey: {
        ...safeApiKey,
        keyPreview: key.substring(0, 12) + "..." + key.slice(-4),
      },
    });
  } catch (error) {
    console.error("API keys PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("keyId");
    const userId = searchParams.get("userId") || "demo-user";

    if (!keyId) {
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 },
      );
    }

    const apiKey = apiKeys.get(keyId);
    if (!apiKey || apiKey.userId !== userId) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    apiKeys.delete(keyId);

    // Remove from user's key list
    const userKeys = userApiKeys.get(userId) || [];
    const updatedKeys = userKeys.filter((id: string) => id !== keyId);
    userApiKeys.set(userId, updatedKeys);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API keys DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 },
    );
  }
}

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
