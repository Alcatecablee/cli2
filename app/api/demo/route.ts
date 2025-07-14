// @ts-nocheck
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Simple in-memory rate limiting (for production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute
const MAX_CODE_SIZE = 100000; // 100KB limit
const ALLOWED_EXTENSIONS = /\.(ts|tsx|js|jsx)$/i;

// Performance tracking
const performanceMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  averageProcessingTime: 0,
  lastReset: Date.now(),
};

function updatePerformanceMetrics(processingTime: number, success: boolean) {
  performanceMetrics.totalRequests++;
  if (success) performanceMetrics.successfulRequests++;

  // Calculate rolling average
  const alpha = 0.1; // Smoothing factor
  performanceMetrics.averageProcessingTime =
    performanceMetrics.averageProcessingTime * (1 - alpha) +
    processingTime * alpha;
}

function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters while preserving code functionality
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
    .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
    .trim();
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (clientData.count >= RATE_LIMIT) {
    return true;
  }

  clientData.count++;
  return false;
}

// POST /api/demo
// Consumes JSON: { code: string, filename: string, layers?: number[] | "auto" | "all", applyFixes?: boolean }
// Returns the raw NeuroLintPro response or an error.
export async function POST(req: Request) {
  const requestId = randomUUID().substring(0, 8);
  const startTime = Date.now();

  console.log(
    `[DEMO API ${requestId}] Request received at:`,
    new Date().toISOString(),
  );

  // Basic rate limiting
  const clientIP =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  console.log(`[DEMO API ${requestId}] Client IP:`, clientIP);

  if (isRateLimited(clientIP)) {
    console.log(`[DEMO API ${requestId}] Rate limit exceeded for:`, clientIP);
    const response = NextResponse.json(
      {
        error: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil(RATE_WINDOW / 1000),
        requestId,
      },
      { status: 429 },
    );
    response.headers.set(
      "Retry-After",
      Math.ceil(RATE_WINDOW / 1000).toString(),
    );
    response.headers.set("X-RateLimit-Limit", RATE_LIMIT.toString());
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-Request-ID", requestId);
    return response;
  }
  try {
    console.log(`[DEMO API ${requestId}] Validating request body...`);

    // Validate request has body
    if (!req.body) {
      console.log(`[DEMO API ${requestId}] ERROR: No request body`);
      const response = NextResponse.json(
        { error: "Request body is required", requestId },
        { status: 400 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    let requestData;
    try {
      requestData = await req.json();
      console.log(`[DEMO API ${requestId}] Request data parsed:`, {
        hasCode: !!requestData.code,
        codeLength: requestData.code?.length,
        filename: requestData.filename,
        layers: requestData.layers,
        applyFixes: requestData.applyFixes,
      });
    } catch (parseError) {
      console.log(
        `[DEMO API ${requestId}] ERROR: JSON parse failed:`,
        parseError,
      );
      const response = NextResponse.json(
        { error: "Invalid JSON in request body", requestId },
        { status: 400 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    const { code, filename, layers = "auto", applyFixes = false } = requestData;

    // Comprehensive input validation
    if (typeof code !== "string" || code.length === 0) {
      const response = NextResponse.json(
        { error: "Parameter 'code' must be a non-empty string", requestId },
        { status: 400 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    // Security: Limit code size to prevent abuse
    if (code.length > MAX_CODE_SIZE) {
      const response = NextResponse.json(
        {
          error: `Code size too large. Maximum ${MAX_CODE_SIZE / 1000}KB allowed.`,
          receivedSize: code.length,
          maxSize: MAX_CODE_SIZE,
          requestId,
        },
        { status: 413 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    // Sanitize code input
    const sanitizedCode = sanitizeInput(code);

    if (typeof filename !== "string" || filename.length === 0) {
      const response = NextResponse.json(
        { error: "Parameter 'filename' must be provided", requestId },
        { status: 400 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    // Validate filename extension
    if (!filename.match(ALLOWED_EXTENSIONS)) {
      const response = NextResponse.json(
        {
          error: "Filename must have a valid extension (.ts, .tsx, .js, .jsx)",
          allowedExtensions: [".ts", ".tsx", ".js", ".jsx"],
          requestId,
        },
        { status: 400 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    // Additional filename security validation
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Validate layers parameter
    if (layers !== "auto" && layers !== "all" && !Array.isArray(layers)) {
      const response = NextResponse.json(
        {
          error:
            "Parameter 'layers' must be 'auto', 'all', or an array of numbers",
          validOptions: ["auto", "all", "array of numbers 1-6"],
          requestId,
        },
        { status: 400 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    if (Array.isArray(layers)) {
      const validLayers = layers.every(
        (layer) => typeof layer === "number" && layer >= 1 && layer <= 6,
      );
      if (!validLayers) {
        const response = NextResponse.json(
          {
            error: "Layer numbers must be between 1 and 6",
            validRange: { min: 1, max: 6 },
            requestId,
          },
          { status: 400 },
        );
        response.headers.set("X-Request-ID", requestId);
        return response;
      }
    }

    if (typeof applyFixes !== "boolean") {
      const response = NextResponse.json(
        {
          error: "Parameter 'applyFixes' must be a boolean",
          requestId,
        },
        { status: 400 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    console.log(`[DEMO API ${requestId}] Importing NeuroLint Pro engine...`);

    // Dynamically import the CommonJS engine with interop.
    // The path is relative to <projectRoot>/app/api/demo/route.ts
    // ../../.. brings us back to project root where neurolint-pro.js resides.
    let NeuroLintPro;
    try {
      NeuroLintPro = await import("../../../neurolint-pro.js");
      console.log(`[DEMO API ${requestId}] Engine imported successfully:`, {
        hasDefault: !!NeuroLintPro.default,
        hasEngine: !!NeuroLintPro,
        type: typeof (NeuroLintPro.default || NeuroLintPro),
      });
    } catch (importError) {
      console.log(
        `[DEMO API ${requestId}] ERROR: Engine import failed:`,
        importError,
      );
      const response = NextResponse.json(
        {
          error: "Failed to load NeuroLint Pro engine: " + importError.message,
          requestId,
        },
        { status: 500 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    const engine = NeuroLintPro.default || NeuroLintPro;

    if (!engine || typeof engine !== "function") {
      console.log(`[DEMO API ${requestId}] ERROR: Engine not a function:`, {
        hasEngine: !!engine,
        type: typeof engine,
        keys: engine ? Object.keys(engine) : "null",
      });
      const response = NextResponse.json(
        {
          error: "NeuroLint Pro engine not available or misconfigured",
          requestId,
        },
        { status: 500 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    // Parse layers parameter correctly
    let layersToUse = null;
    if (layers === "auto") {
      layersToUse = null; // Let engine auto-detect
    } else if (layers === "all") {
      layersToUse = [1, 2, 3, 4, 5, 6]; // All layers
    } else if (Array.isArray(layers)) {
      layersToUse = layers; // Use provided layers
    }

    console.log(`[DEMO API ${requestId}] Calling engine with parameters:`, {
      codeLength: sanitizedCode.length,
      filename: sanitizedFilename,
      dryRun: !applyFixes,
      layersToUse,
    });

    // Call the engine with correct signature: (code, filePath, dryRun, requestedLayers, options)
    let result;
    try {
      result = await engine(
        sanitizedCode,
        sanitizedFilename,
        !applyFixes, // dryRun = true when applyFixes = false (demo mode)
        layersToUse,
        {
          isDemoMode: true,
          singleFile: true,
          verbose: false,
          requestId, // Pass request ID for tracking
        },
      );
      const processingTime = Date.now() - startTime;
      updatePerformanceMetrics(processingTime, !!result?.success);

      console.log(`[DEMO API ${requestId}] Engine execution completed:`, {
        hasResult: !!result,
        resultType: typeof result,
        success: result?.success,
        dryRun: result?.dryRun,
        hasAnalysis: !!result?.analysis,
        hasLayers: !!result?.layers,
        hasError: !!result?.error,
        layerCount: result?.layers?.length || 0,
        analysisIssues: result?.analysis?.detectedIssues?.length || 0,
        recommendedLayers: result?.analysis?.recommendedLayers || [],
        errorMessage: result?.error,
        processingTimeMs: processingTime,
      });
    } catch (engineError) {
      const processingTime = Date.now() - startTime;
      updatePerformanceMetrics(processingTime, false);

      console.log(
        `[DEMO API ${requestId}] ERROR: Engine execution failed:`,
        engineError,
      );
      const response = NextResponse.json(
        {
          error: "Engine execution failed: " + engineError.message,
          stack:
            process.env.NODE_ENV === "development"
              ? engineError.stack
              : undefined,
          requestId,
          processingTimeMs: processingTime,
        },
        { status: 500 },
      );
      response.headers.set("X-Request-ID", requestId);
      return response;
    }

    const processingTime = Date.now() - startTime;
    console.log(
      `[DEMO API ${requestId}] Returning successful result (${processingTime}ms)`,
    );

    // Add metadata to successful response
    const enhancedResult = {
      ...result,
      metadata: {
        requestId,
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    const response = NextResponse.json(enhancedResult);

    // Add performance and security headers
    response.headers.set("X-Request-ID", requestId);
    response.headers.set("X-Processing-Time", processingTime.toString());
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    );
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");

    return response;
  } catch (error) {
    const processingTime = Date.now() - startTime;
    updatePerformanceMetrics(processingTime, false);

    console.error(`[DEMO API ${requestId}] CRITICAL ERROR:`, error);
    console.error(`[DEMO API ${requestId}] Error stack:`, error.stack);
    console.error(`[DEMO API ${requestId}] Error name:`, error.name);
    console.error(`[DEMO API ${requestId}] Error message:`, error.message);

    const response = NextResponse.json(
      {
        error: "Internal server error processing code",
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        requestId,
        processingTimeMs: processingTime,
      },
      { status: 500 },
    );

    response.headers.set("X-Request-ID", requestId);
    return response;
  }
}

// Health check endpoint
export async function GET() {
  const uptime = Date.now() - performanceMetrics.lastReset;
  const successRate =
    performanceMetrics.totalRequests > 0
      ? (
          (performanceMetrics.successfulRequests /
            performanceMetrics.totalRequests) *
          100
        ).toFixed(2)
      : "0.00";

  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 1000)}s`,
    metrics: {
      totalRequests: performanceMetrics.totalRequests,
      successfulRequests: performanceMetrics.successfulRequests,
      successRate: `${successRate}%`,
      averageProcessingTime: `${Math.round(performanceMetrics.averageProcessingTime)}ms`,
    },
    limits: {
      maxCodeSize: `${MAX_CODE_SIZE / 1000}KB`,
      rateLimit: `${RATE_LIMIT} requests per ${RATE_WINDOW / 1000}s`,
      allowedExtensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };

  const response = NextResponse.json(healthData);
  response.headers.set("Cache-Control", "no-cache");
  return response;
}
