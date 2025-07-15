import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Import webhook trigger function
import { triggerWebhook } from "../webhooks/route";

// In-memory storage (same references as other routes)
const apiKeys = new Map();
const projects = new Map();
const projectAnalyses = new Map();

// Import the neurolint engine
const getNeuroLintEngine = async () => {
  try {
    const engine = await import("../../../neurolint-pro.js");
    return engine.default || engine;
  } catch (error) {
    console.error("Failed to load NeuroLint engine:", error);
    throw new Error("NeuroLint engine not available");
  }
};

// API Key validation
const validateApiKey = (key: string): any => {
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

// Rate limiting for API keys
const checkApiRateLimit = (
  apiKey: any,
): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const hourWindow = 60 * 60 * 1000;
  const dayWindow = 24 * 60 * 60 * 1000;

  // Simple rate limiting - in production, use Redis or similar
  const hourlyCount = apiKey.hourlyUsage || 0;
  const dailyCount = apiKey.dailyUsage || 0;
  const lastHourReset = apiKey.lastHourReset || 0;
  const lastDayReset = apiKey.lastDayReset || 0;

  // Reset counters if needed
  if (now - lastHourReset > hourWindow) {
    apiKey.hourlyUsage = 0;
    apiKey.lastHourReset = now;
  }

  if (now - lastDayReset > dayWindow) {
    apiKey.dailyUsage = 0;
    apiKey.lastDayReset = now;
  }

  const hourlyAllowed = apiKey.hourlyUsage < apiKey.rateLimit.requestsPerHour;
  const dailyAllowed = apiKey.dailyUsage < apiKey.rateLimit.requestsPerDay;

  return {
    allowed: hourlyAllowed && dailyAllowed,
    remaining: Math.min(
      apiKey.rateLimit.requestsPerHour - apiKey.hourlyUsage,
      apiKey.rateLimit.requestsPerDay - apiKey.dailyUsage,
    ),
  };
};

export async function POST(request: NextRequest) {
  const requestId = randomUUID().substring(0, 8);
  const startTime = Date.now();

  try {
    // Check for API key authentication
    const apiKeyHeader =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    let authenticatedUser = null;
    let rateLimitInfo = null;

    if (apiKeyHeader) {
      const apiKey = validateApiKey(apiKeyHeader);
      if (!apiKey) {
        return NextResponse.json(
          { error: "Invalid or expired API key" },
          { status: 401 },
        );
      }

      // Check permissions
      if (
        !apiKey.permissions.includes("analyze") &&
        !apiKey.permissions.includes("*")
      ) {
        return NextResponse.json(
          { error: "Insufficient permissions for analysis" },
          { status: 403 },
        );
      }

      // Check rate limits
      const rateLimit = checkApiRateLimit(apiKey);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            remaining: rateLimit.remaining,
            resetTime: apiKey.lastHourReset + 60 * 60 * 1000,
          },
          { status: 429 },
        );
      }

      authenticatedUser = {
        userId: apiKey.userId,
        keyId: apiKey.id,
        permissions: apiKey.permissions,
      };

      rateLimitInfo = {
        remaining: rateLimit.remaining,
        hourlyLimit: apiKey.rateLimit.requestsPerHour,
        dailyLimit: apiKey.rateLimit.requestsPerDay,
      };

      // Update usage counters
      apiKey.hourlyUsage = (apiKey.hourlyUsage || 0) + 1;
      apiKey.dailyUsage = (apiKey.dailyUsage || 0) + 1;
      apiKey.usageCount = (apiKey.usageCount || 0) + 1;
      apiKey.lastUsed = new Date().toISOString();
    }

    const body = await request.json();
    const {
      code,
      filename,
      layers = "auto",
      applyFixes = false,
      projectId,
      metadata = {},
    } = body;

    console.log(`[ANALYZE API ${requestId}] Request:`, {
      filename,
      codeLength: code?.length,
      layers,
      applyFixes,
      projectId,
      authenticated: !!authenticatedUser,
    });

    // Validate input
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required and must be a string" },
        { status: 400 },
      );
    }

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      );
    }

    // File size limit
    const maxSize = authenticatedUser ? 1000000 : 200000; // 1MB for API users, 200KB for anonymous
    if (code.length > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSize / 1000}KB` },
        { status: 413 },
      );
    }

    // Validate file extension
    if (!filename.match(/\.(ts|tsx|js|jsx)$/i)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload .ts, .tsx, .js, or .jsx files",
        },
        { status: 400 },
      );
    }

    // Check project access if projectId provided
    let project = null;
    if (projectId) {
      project = projects.get(projectId);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }

      if (authenticatedUser && project.userId !== authenticatedUser.userId) {
        return NextResponse.json(
          { error: "Access denied to project" },
          { status: 403 },
        );
      }
    }

    console.log(`[ANALYZE API ${requestId}] Loading NeuroLint Pro engine...`);

    // Get the analysis engine
    const engine = await getNeuroLintEngine();

    // Parse layers parameter
    let layersToUse = null;
    if (layers === "auto") {
      layersToUse = null; // Let engine auto-detect
    } else if (layers === "all") {
      layersToUse = [1, 2, 3, 4, 5, 6];
    } else if (Array.isArray(layers)) {
      layersToUse = layers.filter(
        (l) => typeof l === "number" && l >= 1 && l <= 6,
      );
    }

    console.log(`[ANALYZE API ${requestId}] Running analysis...`);

    // Run the analysis
    const result = await engine(
      code,
      filename,
      !applyFixes, // dryRun = true when applyFixes = false
      layersToUse,
      {
        isApi: true,
        singleFile: true,
        verbose: false,
        requestId,
        projectId,
        userId: authenticatedUser?.userId,
        ...metadata,
      },
    );

    const processingTime = Date.now() - startTime;

    console.log(`[ANALYZE API ${requestId}] Analysis complete:`, {
      success: result?.success,
      processingTime,
      issuesFound: result?.analysis?.detectedIssues?.length || 0,
    });

    // Save analysis to project if specified
    if (projectId && result.success) {
      const analyses = projectAnalyses.get(projectId) || [];
      const analysisRecord = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        filename,
        timestamp: new Date().toISOString(),
        result,
        layers: layersToUse || result.analysis?.recommendedLayers || [],
        executionTime: processingTime,
        userId: authenticatedUser?.userId || "anonymous",
        metadata,
      };

      analyses.push(analysisRecord);
      projectAnalyses.set(projectId, analyses.slice(-100)); // Keep last 100 analyses

      // Update project stats
      if (project) {
        const totalIssues = analyses.reduce(
          (sum, analysis) =>
            sum + (analysis.result.analysis?.detectedIssues?.length || 0),
          0,
        );
        const avgConfidence =
          analyses.reduce(
            (sum, analysis) =>
              sum + (analysis.result.analysis?.confidence || 0),
            0,
          ) / analyses.length;

        project.stats.totalIssues = totalIssues;
        project.stats.lastAnalyzed = new Date().toISOString();
        project.stats.qualityScore = Math.round(avgConfidence * 100);
        project.updatedAt = new Date().toISOString();
        projects.set(projectId, project);
      }
    }

    // Trigger webhooks for authenticated users
    if (authenticatedUser) {
      try {
        await triggerWebhook(authenticatedUser.userId, "analysis.completed", {
          filename,
          projectId,
          issuesFound: result.analysis?.detectedIssues?.length || 0,
          qualityScore: Math.round((result.analysis?.confidence || 0) * 100),
          processingTime,
        });
      } catch (webhookError) {
        console.error("Webhook trigger failed:", webhookError);
        // Don't fail the analysis if webhook fails
      }
    }

    // Build response
    const response = {
      ...result,
      metadata: {
        requestId,
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        version: "api-1.0.0",
        authenticated: !!authenticatedUser,
        projectId: projectId || null,
      },
    };

    // Add rate limit info for authenticated users
    if (rateLimitInfo) {
      response.rateLimitInfo = rateLimitInfo;
    }

    return NextResponse.json(response);
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[ANALYZE API ${requestId}] Error:`, error);

    // Trigger error webhook for authenticated users
    if (authenticatedUser) {
      try {
        await triggerWebhook(authenticatedUser.userId, "analysis.failed", {
          filename: body?.filename || "unknown",
          error: error.message,
          processingTime,
        });
      } catch (webhookError) {
        console.error("Error webhook trigger failed:", webhookError);
      }
    }

    return NextResponse.json(
      {
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "Unknown error",
        metadata: {
          requestId,
          processingTimeMs: processingTime,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  // API health check and documentation link
  return NextResponse.json({
    status: "healthy",
    service: "NeuroLint Pro Analysis API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    documentation: "/api/docs",
    endpoints: {
      analyze: {
        method: "POST",
        path: "/api/analyze",
        description: "Analyze React/Next.js code",
        authentication: "Optional (X-API-Key header)",
      },
      projects: {
        method: "GET/POST/PUT/DELETE",
        path: "/api/projects",
        description: "Manage projects",
        authentication: "Required",
      },
      webhooks: {
        method: "GET/POST/PUT/DELETE",
        path: "/api/webhooks",
        description: "Manage webhooks",
        authentication: "Required",
      },
      teams: {
        method: "GET/POST/PUT/DELETE",
        path: "/api/teams",
        description: "Team collaboration",
        authentication: "Required",
      },
    },
    features: [
      "Real-time code analysis",
      "Project management",
      "Team collaboration",
      "Webhook notifications",
      "CI/CD integrations",
      "API key management",
      "Rate limiting",
      "Comprehensive documentation",
    ],
  });
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
    },
  });
}
