// @ts-nocheck
import { NextResponse } from "next/server";

// Simple in-memory rate limiting (for production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

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
  console.log("🔍 [DEMO API] Request received at:", new Date().toISOString());

  // Basic rate limiting
  const clientIP =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  console.log("🔍 [DEMO API] Client IP:", clientIP);

  if (isRateLimited(clientIP)) {
    console.log("🔍 [DEMO API] Rate limit exceeded for:", clientIP);
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 },
    );
  }
  try {
    console.log("🔍 [DEMO API] Validating request body...");

    // Validate request has body
    if (!req.body) {
      console.log("🔍 [DEMO API] ERROR: No request body");
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 },
      );
    }

    let requestData;
    try {
      requestData = await req.json();
      console.log("🔍 [DEMO API] Request data parsed:", {
        hasCode: !!requestData.code,
        codeLength: requestData.code?.length,
        filename: requestData.filename,
        layers: requestData.layers,
        applyFixes: requestData.applyFixes,
      });
    } catch (parseError) {
      console.log("🔍 [DEMO API] ERROR: JSON parse failed:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { code, filename, layers = "auto", applyFixes = false } = requestData;

    // Comprehensive input validation
    if (typeof code !== "string" || code.length === 0) {
      return NextResponse.json(
        { error: "Parameter 'code' must be a non-empty string" },
        { status: 400 },
      );
    }

    // Security: Limit code size to prevent abuse
    if (code.length > 100000) {
      // 100KB limit
      return NextResponse.json(
        { error: "Code size too large. Maximum 100KB allowed." },
        { status: 413 },
      );
    }

    if (typeof filename !== "string" || filename.length === 0) {
      return NextResponse.json(
        { error: "Parameter 'filename' must be provided" },
        { status: 400 },
      );
    }

    // Validate filename extension
    if (!filename.match(/\.(ts|tsx|js|jsx)$/i)) {
      return NextResponse.json(
        {
          error: "Filename must have a valid extension (.ts, .tsx, .js, .jsx)",
        },
        { status: 400 },
      );
    }

    // Validate layers parameter
    if (layers !== "auto" && layers !== "all" && !Array.isArray(layers)) {
      return NextResponse.json(
        {
          error:
            "Parameter 'layers' must be 'auto', 'all', or an array of numbers",
        },
        { status: 400 },
      );
    }

    if (Array.isArray(layers)) {
      const validLayers = layers.every(
        (layer) => typeof layer === "number" && layer >= 1 && layer <= 6,
      );
      if (!validLayers) {
        return NextResponse.json(
          { error: "Layer numbers must be between 1 and 6" },
          { status: 400 },
        );
      }
    }

    if (typeof applyFixes !== "boolean") {
      return NextResponse.json(
        { error: "Parameter 'applyFixes' must be a boolean" },
        { status: 400 },
      );
    }

    console.log("🔍 [DEMO API] Importing NeuroLint Pro engine...");

    // Dynamically import the CommonJS engine with interop.
    // The path is relative to <projectRoot>/app/api/demo/route.ts
    // ../../.. brings us back to project root where neurolint-pro.js resides.
    let NeuroLintPro;
    try {
      NeuroLintPro = await import("../../../neurolint-pro.js");
      console.log("🔍 [DEMO API] Engine imported successfully:", {
        hasDefault: !!NeuroLintPro.default,
        hasEngine: !!NeuroLintPro,
        type: typeof (NeuroLintPro.default || NeuroLintPro),
      });
    } catch (importError) {
      console.log("🔍 [DEMO API] ERROR: Engine import failed:", importError);
      return NextResponse.json(
        {
          error: "Failed to load NeuroLint Pro engine: " + importError.message,
        },
        { status: 500 },
      );
    }

    const engine = NeuroLintPro.default || NeuroLintPro;

    if (!engine || typeof engine !== "function") {
      console.log("🔍 [DEMO API] ERROR: Engine not a function:", {
        hasEngine: !!engine,
        type: typeof engine,
        keys: engine ? Object.keys(engine) : "null",
      });
      return NextResponse.json(
        { error: "NeuroLint Pro engine not available or misconfigured" },
        { status: 500 },
      );
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

    console.log("🔍 [DEMO API] Calling engine with parameters:", {
      codeLength: code.length,
      filename,
      dryRun: !applyFixes,
      layersToUse,
    });

    // Call the engine with correct signature: (code, filePath, dryRun, requestedLayers, options)
    let result;
    try {
      result = await engine(
        code,
        filename,
        !applyFixes, // dryRun = true when applyFixes = false (demo mode)
        layersToUse,
        {
          isDemoMode: true,
          singleFile: true,
          verbose: false,
        },
      );
      console.log("🔍 [DEMO API] Engine execution completed:", {
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
      });
    } catch (engineError) {
      console.log("🔍 [DEMO API] ERROR: Engine execution failed:", engineError);
      return NextResponse.json(
        {
          error: "Engine execution failed: " + engineError.message,
          stack: engineError.stack,
        },
        { status: 500 },
      );
    }

    console.log("🔍 [DEMO API] Returning successful result");
    return NextResponse.json(result);
  } catch (error) {
    console.error("🔍 [DEMO API] CRITICAL ERROR:", error);
    console.error("🔍 [DEMO API] Error stack:", error.stack);
    console.error("🔍 [DEMO API] Error name:", error.name);
    console.error("🔍 [DEMO API] Error message:", error.message);

    return NextResponse.json(
      {
        error: "Internal server error processing code",
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
