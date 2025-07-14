// @ts-nocheck
import { NextResponse } from "next/server";

// POST /api/demo
// Consumes JSON: { code: string, filename: string, layers?: number[] | "auto" | "all", applyFixes?: boolean }
// Returns the raw NeuroLintPro response or an error.
export async function POST(req: Request) {
  try {
    const {
      code,
      filename,
      layers = "auto",
      applyFixes = false,
    } = await req.json();

    if (typeof code !== "string" || code.length === 0) {
      return NextResponse.json(
        { error: "Parameter 'code' must be a non-empty string" },
        { status: 400 },
      );
    }
    if (typeof filename !== "string" || filename.length === 0) {
      return NextResponse.json(
        { error: "Parameter 'filename' must be provided" },
        { status: 400 },
      );
    }

    // Dynamically import the CommonJS engine with interop.
    // The path is relative to <projectRoot>/app/api/demo/route.ts
    // ../../.. brings us back to project root where neurolint-pro.js resides.
    const NeuroLintPro = await import("../../../neurolint-pro.js");
    const engine = NeuroLintPro.default || NeuroLintPro;

    if (!engine || typeof engine.processCode !== "function") {
      return NextResponse.json(
        { error: "NeuroLint Pro engine not available or misconfigured" },
        { status: 500 },
      );
    }

    // Call the engine with the provided parameters
    const result = await engine.processCode(code, filename, {
      layers,
      applyFixes,
    });

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
