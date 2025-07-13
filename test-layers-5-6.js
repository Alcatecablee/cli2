#!/usr/bin/env node

/**
 * Test script to verify layers 5 and 6 are working
 */

const NeuroLintPro = require("./neurolint-pro.js");

async function testLayers() {
  console.log("🧪 Testing NeuroLint Pro 6-Layer System\n");

  // Test Layer 5: Next.js App Router fixes
  const nextjsCode = `import { useState } from 'react';

import {
import { Button, Card } from 'components/ui';

export default function ClientComponent({ data }) {
  const [count, setCount] = useState(0);
  
  return (
    <Card>
      <h2>Interactive Component</h2>
      <Button onClick={() => setCount(count + 1)}>
        Count: {count}
      </Button>
    </Card>
  );
}`;

  console.log("🔧 Testing Layer 5: Next.js App Router...");
  try {
    const result5 = await NeuroLintPro(
      nextjsCode,
      "ClientComponent.tsx",
      true,
      [5],
    );
    console.log("✅ Layer 5 Result:", {
      recommendedLayers: result5.recommendedLayers,
      detectedIssues: result5.detectedIssues?.length || 0,
      confidence: result5.confidence,
    });
  } catch (error) {
    console.error("❌ Layer 5 Error:", error.message);
  }

  // Test Layer 6: Testing & Validation fixes
  const testingCode = `import React from 'react';

export default function UserProfile({ user, onUpdate }) {
  const handleSubmit = async (formData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    onUpdate(result);
  };

  return (
    <div>
      <h2>User Profile</h2>
      <button onClick={handleSubmit}>
        Update Profile
      </button>
    </div>
  );
}`;

  console.log("\n🧪 Testing Layer 6: Testing & Validation...");
  try {
    const result6 = await NeuroLintPro(testingCode, "UserProfile.tsx", true, [
      6,
    ]);
    console.log("✅ Layer 6 Result:", {
      recommendedLayers: result6.recommendedLayers,
      detectedIssues: result6.detectedIssues?.length || 0,
      confidence: result6.confidence,
    });
  } catch (error) {
    console.error("❌ Layer 6 Error:", error.message);
  }

  // Test complete 6-layer system
  console.log("\n🚀 Testing Complete 6-Layer System...");
  try {
    const fullResult = await NeuroLintPro(
      nextjsCode,
      "TestComponent.tsx",
      true,
    );
    console.log("✅ Full System Result:", {
      recommendedLayers: fullResult.recommendedLayers,
      detectedIssues: fullResult.detectedIssues?.length || 0,
      confidence: fullResult.confidence,
    });
  } catch (error) {
    console.error("❌ Full System Error:", error.message);
  }
}

testLayers().catch(console.error);
