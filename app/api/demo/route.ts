// @ts-nocheck
import { NextResponse } from "next/server";

// POST /api/demo
// Consumes JSON: { code: string, filename: string, layers?: number[] | "auto" | "all", applyFixes?: boolean }
// Returns the raw NeuroLintPro response or an error.
export async function POST(req: Request) {
  try {
    // Validate request has body
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 },
      );
    }

    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
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

    // Dynamically import the CommonJS engine with interop.
    // The path is relative to <projectRoot>/app/api/demo/route.ts
    // ../../.. brings us back to project root where neurolint-pro.js resides.
    const NeuroLintPro = await import("../../../neurolint-pro.js");
    const engine = NeuroLintPro.default || NeuroLintPro;

    if (!engine || typeof engine !== "function") {
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

    // Call the engine with correct signature: (code, filePath, dryRun, requestedLayers)
    const result = await engine(
      code,
      filename,
      !applyFixes, // dryRun = true when applyFixes = false (demo mode)
      layersToUse,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Demo API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error processing code",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
