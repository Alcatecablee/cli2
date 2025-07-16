#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Enhanced AST System
 *
 * Tests all new capabilities while ensuring backward compatibility
 */

const fs = require("fs");
const path = require("path");

// Test cases for different scenarios
const testCases = {
  missingKeys: {
    filename: "TestComponent.tsx",
    code: `import React from 'react';

const items = [
  { id: 1, name: "React Component" },
  { id: 2, name: "Next.js App" },
  { id: 3, name: "TypeScript Fix" }
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

export default ItemList;`,
    expectedImprovements: ["Missing key props", "Component analysis"],
  },

  htmlEntities: {
    filename: "MessageComponent.tsx",
    code: `const message = &quot;Welcome to NeuroLint Pro&quot;;
const description = &quot;Detects &amp; fixes 50+ issues&quot;;
const note = &quot;Smart confidence scoring &amp; impact estimation&quot;;

console.log(&quot;Processing HTML entities...&quot;);

function Display() {
  return (
    <div>
      <h1>{message}</h1>
      <p>{description}</p>
      <small>{note}</small>
    </div>
  );
}`,
    expectedImprovements: ["HTML entities", "Console cleanup"],
  },

  ssrIssues: {
    filename: "ThemeToggle.tsx",
    code: `import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}

export default ThemeToggle;`,
    expectedImprovements: ["SSR guards", "Hydration safety"],
  },

  nextjsComponent: {
    filename: "page.tsx",
    code: `import { useState } from 'react';

function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Welcome to Next.js</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default HomePage;`,
    expectedImprovements: ["Next.js optimization", "Client directive"],
  },
};

async function runTests() {
  console.log("🧪 Running Enhanced AST System Tests...\n");

  // Test 1: Check if enhanced engine loads
  console.log("Test 1: Enhanced Engine Loading");
  try {
    const NeuroLintProEnhanced = require("./neurolint-pro-enhanced");
    console.log("✅ Enhanced engine loaded successfully");
  } catch (error) {
    console.log("❌ Enhanced engine failed to load:", error.message);
    return;
  }

  // Test 2: Check if standard engine can load enhanced features
  console.log("\nTest 2: Standard Engine Enhanced Integration");
  try {
    const NeuroLintPro = require("./neurolint-pro");
    console.log("✅ Standard engine with enhanced features loaded");
  } catch (error) {
    console.log("❌ Standard engine failed to load:", error.message);
    return;
  }

  // Test 3: Run analysis on test cases
  console.log("\nTest 3: Enhanced AST Analysis Tests");
  const NeuroLintPro = require("./neurolint-pro");

  for (const [testName, testCase] of Object.entries(testCases)) {
    console.log(`\n--- Testing: ${testName} ---`);

    try {
      const result = await NeuroLintPro(
        testCase.code,
        testCase.filename,
        true, // dry-run
        null, // auto-detect layers
        {
          verbose: false,
          useEnhancedAST: true,
        },
      );

      console.log(`📊 Analysis Results for ${testName}:`);
      console.log(`   Success: ${result.success}`);
      console.log(
        `   Layers executed: ${result.successfulLayers}/${result.layers?.length || 0}`,
      );
      console.log(
        `   Processing time: ${result.totalExecutionTime?.toFixed(0) || 0}ms`,
      );

      if (result.analysis) {
        console.log(
          `   Issues detected: ${result.analysis.detectedIssues?.length || 0}`,
        );
        console.log(
          `   Confidence: ${((result.analysis.confidence || 0) * 100).toFixed(1)}%`,
        );
        console.log(
          `   Recommended layers: [${result.analysis.recommendedLayers?.join(", ") || ""}]`,
        );

        if (result.analysis.detectedIssues?.length > 0) {
          console.log(`   📋 Detected issues:`);
          result.analysis.detectedIssues.forEach((issue) => {
            console.log(
              `      - ${issue.description} (Layer ${issue.fixedByLayer})`,
            );
          });
        }
      }

      if (result.layers?.length > 0) {
        console.log(`   📈 Layer results:`);
        result.layers.forEach((layer) => {
          const status = layer.success ? "✅" : "❌";
          console.log(
            `      ${status} Layer ${layer.layerId}: ${layer.changeCount || 0} changes (${layer.executionTime?.toFixed(0) || 0}ms)`,
          );
          if (layer.improvements?.length > 0) {
            layer.improvements.forEach((improvement) => {
              console.log(`         📝 ${improvement}`);
            });
          }
        });
      }

      console.log(`✅ ${testName} test completed successfully`);
    } catch (error) {
      console.log(`❌ ${testName} test failed:`, error.message);
    }
  }

  // Test 4: Performance comparison
  console.log("\n--- Performance Comparison ---");
  const performanceTest = testCases.missingKeys;

  console.log("Testing with Enhanced AST Engine:");
  const startEnhanced = Date.now();
  try {
    const enhancedResult = await NeuroLintPro(
      performanceTest.code,
      performanceTest.filename,
      true,
      null,
      { useEnhancedAST: true },
    );
    const enhancedTime = Date.now() - startEnhanced;
    console.log(
      `✅ Enhanced engine: ${enhancedTime}ms, Issues: ${enhancedResult.analysis?.detectedIssues?.length || 0}`,
    );
  } catch (error) {
    console.log(`❌ Enhanced engine failed: ${error.message}`);
  }

  console.log("Testing with Standard Engine:");
  const startStandard = Date.now();
  try {
    const standardResult = await NeuroLintPro(
      performanceTest.code,
      performanceTest.filename,
      true,
      null,
      { useEnhancedAST: false },
    );
    const standardTime = Date.now() - startStandard;
    console.log(
      `✅ Standard engine: ${standardTime}ms, Issues: ${standardResult.analysis?.detectedIssues?.length || 0}`,
    );
  } catch (error) {
    console.log(`❌ Standard engine failed: ${error.message}`);
  }

  // Test 5: AST Engine Components
  console.log("\n--- AST Engine Components Test ---");
  try {
    const { EnhancedASTEngine } = require("./lib/enhanced-ast-engine");
    const astEngine = new EnhancedASTEngine();

    const parseResult = astEngine.parseCode(
      testCases.missingKeys.code,
      "test.tsx",
    );
    console.log(
      `✅ AST Parsing: ${parseResult.success ? "Success" : "Failed"}`,
    );

    if (parseResult.success) {
      const context = astEngine.semanticContext.get("test.tsx");
      console.log(`   Components found: ${context?.components?.size || 0}`);
      console.log(`   Imports found: ${context?.imports?.size || 0}`);
      console.log(`   Hooks found: ${context?.hooks?.size || 0}`);
    }
  } catch (error) {
    console.log(`❌ AST Engine components test failed: ${error.message}`);
  }

  console.log("\n🎉 All tests completed!");
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error("Test suite failed:", error);
    process.exit(1);
  });
}

module.exports = { runTests, testCases };
