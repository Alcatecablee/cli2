#!/usr/bin/env node

/**
 * Test script to verify NeuroLint Pro standard engine functionality
 */

const NeuroLintPro = require("./neurolint-pro.js");

async function testEngine() {
  console.log("🧪 Testing NeuroLint Pro Standard Engine...");

  // Test code with HTML entities and missing key props
  const testCode = `const items = [
  { id: 1, name: &quot;React Component&quot; },
  { id: 2, name: &quot;Next.js App&quot; },
  { id: 3, name: &quot;TypeScript Fix&quot; }
];

function ItemList() {
  return (
    <ul>
      {items.map(item =>
        <li>{item.name}</li>
      )}
    </ul>
  );
}

export default ItemList;`;

  try {
    console.log("📝 Input code length:", testCode.length);
    console.log("🔧 Running analysis...");

    const result = await NeuroLintPro(
      testCode,
      "test.tsx",
      true, // dry run mode
      null, // auto-detect layers
      {
        isDemoMode: true,
        singleFile: true,
        verbose: true,
      },
    );

    console.log("✅ Analysis complete!");
    console.log("📊 Result:", {
      success: result.success,
      hasAnalysis: !!result.analysis,
      hasTransformed: !!result.transformed,
      layerCount: result.layers?.length || 0,
      issueCount: result.analysis?.detectedIssues?.length || 0,
      originalLength: result.originalCode?.length || 0,
      transformedLength: result.transformed?.length || 0,
    });

    if (result.analysis?.detectedIssues) {
      console.log("🐛 Detected Issues:");
      result.analysis.detectedIssues.forEach((issue, index) => {
        console.log(
          `   ${index + 1}. [Layer ${issue.fixedByLayer}] ${issue.description}`,
        );
      });
    }

    if (result.error) {
      console.error("❌ Error:", result.error);
    }

    return result.success;
  } catch (error) {
    console.error("💥 Test failed:", error.message);
    console.error("Stack:", error.stack);
    return false;
  }
}

// Run the test
testEngine()
  .then((success) => {
    if (success) {
      console.log("🎉 Standard engine test PASSED!");
      process.exit(0);
    } else {
      console.log("❌ Standard engine test FAILED!");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("💥 Test execution failed:", error);
    process.exit(1);
  });
