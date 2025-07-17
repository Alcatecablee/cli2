const fetch = require("node-fetch");

async function testHtmlEntityFixes() {
  const testCode = `const msg = &quot;Hello &amp; Welcome&quot;;
const price = &amp;#36;99.99;
const copyright = &copy; 2024;
const trademark = &trade; Brand;`;

  try {
    const response = await fetch("http://localhost:3000/api/demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: testCode,
        filename: "test.tsx",
        applyFixes: false,
      }),
    });

    const result = await response.json();

    console.log("🧪 Testing HTML Entity Fixes");
    console.log("📥 Input code:", testCode);
    console.log(
      "📊 Detected Issues:",
      result.analysis?.detectedIssues?.length || 0,
    );

    if (result.analysis?.detectedIssues) {
      result.analysis.detectedIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.description} (${issue.pattern})`);
      });
    }

    console.log("📤 Transformed code:", result.transformed);
    console.log(
      "✅ Success:",
      result.transformed !== testCode ? "FIXED" : "NO CHANGES",
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testHtmlEntityFixes();
