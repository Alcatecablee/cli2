#!/usr/bin/env node

/**
 * Test script to debug the upload feature
 */

const fs = require("fs");

// Create a simple test file to upload
const testCode = `import React, { useState } from 'react';

const items = [
  { id: 1, name: &quot;Test Item&quot; },
  { id: 2, name: &quot;Another Item&quot; }
];

function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Component</h1>
      <p>Count: {count}</p>
      <ul>
        {items.map(item => 
          <li>{item.name}</li>
        )}
      </ul>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default TestComponent;`;

console.log("🧪 Testing upload feature with sample code...");
console.log("📝 Sample code length:", testCode.length);
console.log("📁 Sample code preview:", testCode.substring(0, 200) + "...");

// Test the API endpoint
async function testUpload() {
  try {
    const payload = {
      code: testCode,
      filename: "TestComponent.tsx",
      layers: "auto",
      applyFixes: false,
    };

    console.log("🔄 Sending request to /api/demo...");
    console.log("📦 Payload summary:", {
      codeLength: payload.code.length,
      filename: payload.filename,
      layers: payload.layers,
      applyFixes: payload.applyFixes,
    });

    const response = await fetch("http://localhost:3000/api/demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📈 Response status:", response.status);
    console.log(
      "📋 Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Error response:", errorText);
      return;
    }

    const result = await response.json();
    console.log("✅ Success! Result summary:", {
      success: result.success,
      dryRun: result.dryRun,
      hasAnalysis: !!result.analysis,
      hasLayers: !!result.layers,
      hasError: !!result.error,
    });

    if (result.analysis) {
      console.log("🔍 Analysis details:", {
        confidence: result.analysis.confidence,
        recommendedLayers: result.analysis.recommendedLayers,
        issuesFound: result.analysis.detectedIssues?.length || 0,
      });
    }

    if (result.error) {
      console.log("🚨 Engine error:", result.error);
    }
  } catch (error) {
    console.error("💥 Network/JS error:", error.message);
    console.error("📚 Full error:", error);
  }
}

testUpload();
