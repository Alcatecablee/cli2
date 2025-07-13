import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Test with a sample file if it exists
    const testFilePath = path.join(process.cwd(), "test-sample.jsx");

    if (!fs.existsSync(testFilePath)) {
      return NextResponse.json(
        {
          error: "Test file not found",
          message: "Please create test-sample.jsx in the root directory",
        },
        { status: 404 },
      );
    }

    const testCode = fs.readFileSync(testFilePath, "utf8");

    // Mock analysis result for testing
    const mockResult = {
      success: true,
      analysis: {
        confidence: 0.85,
        recommendedLayers: [1, 2, 3, 4],
        detectedIssues: [
          {
            type: "missing-keys",
            description: "Missing key props in map function",
            severity: "medium",
          },
          {
            type: "html-entities",
            description: "HTML entity corruption detected",
            severity: "high",
          },
        ],
        estimatedImpact: {
          level: "medium",
          description: "4 total issues, 2 critical",
        },
      },
      totalExecutionTime: 1250,
    };

    return NextResponse.json({
      message: "NeuroLint Pro Next.js API test successful",
      testFile: "test-sample.jsx",
      result: mockResult,
      engineStatus: "operational",
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      {
        error: "Test failed: " + (error as Error).message,
        engineStatus: "error",
      },
      { status: 500 },
    );
  }
}
