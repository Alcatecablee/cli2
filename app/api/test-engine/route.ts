import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 [TEST] Attempting to import NeuroLint Pro engine...");

    const NeuroLintPro = await import("../../../neurolint-pro.js");
    console.log("🔍 [TEST] Import result:", {
      hasDefault: !!NeuroLintPro.default,
      hasEngine: !!NeuroLintPro,
      defaultType: typeof NeuroLintPro.default,
      engineType: typeof NeuroLintPro,
      keys: Object.keys(NeuroLintPro),
    });

    const engine = NeuroLintPro.default || NeuroLintPro;
    console.log("🔍 [TEST] Final engine:", {
      type: typeof engine,
      isFunction: typeof engine === "function",
    });

    if (typeof engine === "function") {
      console.log("🔍 [TEST] Testing engine with simple code...");
      const result = await engine(
        'const test = "hello";',
        "test.ts",
        true, // dry run
        null, // auto layers
      );
      console.log("🔍 [TEST] Engine test result:", result);

      return NextResponse.json({
        success: true,
        engineTest: result,
        importInfo: {
          hasDefault: !!NeuroLintPro.default,
          hasEngine: !!NeuroLintPro,
          defaultType: typeof NeuroLintPro.default,
          engineType: typeof NeuroLintPro,
          keys: Object.keys(NeuroLintPro),
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Engine is not a function",
        type: typeof engine,
        engine: engine,
      });
    }
  } catch (error) {
    console.log("🔍 [TEST] ERROR:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}
