// @ts-nocheck
import { NextResponse } from "next/server";

// POST /api/demo
// Consumes JSON: { code: string, filename: string, layers?: number[] | "auto" | "all", applyFixes?: boolean }
// Returns the raw NeuroLintPro response or an error.
export async function POST(req: Request) {
  try {
    const { code, filename, layers = "auto", applyFixes = false } = await req.json();

    if (typeof code !== "string" || code.length === 0) {
      return NextResponse.json({ error: "Parameter 'code' must be a non-empty string" }, { status: 400 });
    }
    if (typeof filename !== "string" || filename.length === 0) {
      return NextResponse.json({ error: "Parameter 'filename' must be provided" }, { status: 400 });
    }

    // Dynamically import the CommonJS engine with interop.
    // The path is relative to <projectRoot>/app/api/demo/route.ts
    // ../../.. brings us back to project root where neurolint-pro.js resides.
    // Using dynamic import sidesteps Next.js ESM ↔ CJS mismatch.
    // @ts-ignore - Node will handle CommonJS default export
    const neuroLintModule = await import("../../../neurolint-pro.js");
    // Handle both `module.exports = fn` and `{ default: fn }` patterns.
    const NeuroLintPro = neuroLintModule.default || neuroLintModule;

    // Determine layer argument for the engine
    let layerArg: number[] | null = null;
    if (Array.isArray(layers)) {
      layerArg = layers.map((n) => parseInt(String(n), 10)).filter((n) => !Number.isNaN(n));
    } else if (layers !== "auto" && layers !== "all") {
      // Accept comma-separated string e.g. "1,2,3"
      layerArg = layers
        .split(",")
        .map((n: string) => parseInt(n.trim(), 10))
        .filter((n: number) => !Number.isNaN(n));
    }

    // Run the real NeuroLint engine
    const result = await NeuroLintPro(code, filename, !applyFixes, layerArg);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[NeuroLint Demo API]", error);
    return NextResponse.json({ error: (error as Error).message || "Internal server error" }, { status: 500 });
  }
}