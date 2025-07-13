#!/usr/bin/env node

/**
 * NeuroLint Pro - Premium Debugging Service
 *
 * Implements the exact patterns from IMPLEMENTATION_PATTERNS.md:
 * - Safe Layer Execution Pattern
 * - Layer Dependency Management
 * - Incremental Validation System
 * - Smart Layer Selection
 * - Error Recovery and Reporting
 *
 * CRITICAL: This follows the documented patterns exactly to prevent layer corruption
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Import existing layer scripts
const fixLayer1 = require("./fix-layer-1-config.js");
const fixLayer2 = require("./fix-layer-2-patterns.js");
const fixLayer3 = require("./fix-layer-3-components.js");
const fixLayer4 = require("./fix-layer-4-hydration.js");

/**
 * Core Architecture Principles (from IMPLEMENTATION_PATTERNS.md)
 * Layers must execute in order (1→2→3→4) because each builds on the previous
 */
const LAYER_EXECUTION_ORDER = [
  { id: 1, name: "Configuration", description: "Foundation setup" },
  { id: 2, name: "Entity Cleanup", description: "Preprocessing patterns" },
  { id: 3, name: "Components", description: "React/TS specific fixes" },
  { id: 4, name: "Hydration", description: "Runtime safety guards" },
];

/**
 * Layer Dependency Management (from IMPLEMENTATION_PATTERNS.md)
 * Ensures layers execute in the correct order with proper dependencies
 */
class LayerDependencyManager {
  static DEPENDENCIES = {
    1: [], // Configuration has no dependencies
    2: [1], // Entity cleanup depends on config foundation
    3: [1, 2], // Components depend on config + cleanup
    4: [1, 2, 3], // Hydration depends on all previous layers
  };

  static LAYER_INFO = {
    1: { name: "Configuration", critical: true },
    2: { name: "Entity Cleanup", critical: false },
    3: { name: "Components", critical: false },
    4: { name: "Hydration", critical: false },
  };

  /**
   * Validates and potentially auto-corrects layer selection
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static validateAndCorrectLayers(requestedLayers) {
    const warnings = [];
    const autoAdded = [];
    let correctedLayers = [...requestedLayers];

    // Sort layers in execution order
    correctedLayers.sort((a, b) => a - b);

    // Check dependencies for each requested layer
    for (const layerId of requestedLayers) {
      const dependencies = this.DEPENDENCIES[layerId] || [];
      const missingDeps = dependencies.filter(
        (dep) => !correctedLayers.includes(dep),
      );

      if (missingDeps.length > 0) {
        // Auto-add missing dependencies
        correctedLayers.push(...missingDeps);
        autoAdded.push(...missingDeps);

        warnings.push(
          `Layer ${layerId} (${this.LAYER_INFO[layerId]?.name}) requires ` +
            `${missingDeps.map((dep) => `${dep} (${this.LAYER_INFO[dep]?.name})`).join(", ")}. ` +
            `Auto-added missing dependencies.`,
        );
      }
    }

    // Remove duplicates and sort
    correctedLayers = [...new Set(correctedLayers)].sort((a, b) => a - b);

    return {
      correctedLayers,
      warnings,
      autoAdded,
    };
  }

  /**
   * Suggests optimal layer combinations based on code analysis
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static suggestLayers(code) {
    const recommended = [];
    const reasons = [];

    // Always recommend config layer for foundation
    recommended.push(1);
    reasons.push("Configuration layer provides essential foundation");

    // Check for HTML entities or old patterns
    if (/&quot;|&amp;|&lt;|&gt;|console\.log/.test(code)) {
      recommended.push(2);
      reasons.push("Entity cleanup needed for HTML entities and old patterns");
    }

    // Check for React components needing fixes
    if (code.includes("map(") && code.includes("<") && !code.includes("key=")) {
      recommended.push(3);
      reasons.push("Component fixes needed for missing key props");
    }

    // Check for hydration issues
    if (code.includes("localStorage") && !code.includes("typeof window")) {
      recommended.push(4);
      reasons.push("Hydration fixes needed for SSR safety");
    }

    return { recommended, reasons };
  }
}

/**
 * Incremental Validation System (from IMPLEMENTATION_PATTERNS.md)
 * Prevents cascading failures by validating each transformation step
 */
class TransformationValidator {
  /**
   * Main validation entry point
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static validateTransformation(before, after) {
    // Skip validation if no changes were made
    if (before === after) {
      return { shouldRevert: false, reason: "No changes made" };
    }

    // Check for syntax validity
    const syntaxCheck = this.validateSyntax(after);
    if (!syntaxCheck.valid) {
      return {
        shouldRevert: true,
        reason: `Syntax error: ${syntaxCheck.error}`,
      };
    }

    // Check for code corruption patterns
    const corruptionCheck = this.detectCorruption(before, after);
    if (corruptionCheck.detected) {
      return {
        shouldRevert: true,
        reason: `Corruption detected: ${corruptionCheck.pattern}`,
      };
    }

    // Check for logical issues
    const logicalCheck = this.validateLogicalIntegrity(before, after);
    if (!logicalCheck.valid) {
      return {
        shouldRevert: true,
        reason: `Logical issue: ${logicalCheck.reason}`,
      };
    }

    return { shouldRevert: false };
  }

  /**
   * Parse code to check for syntax errors
   * Simplified validation since we don't have Babel parser in this context
   */
  static validateSyntax(code) {
    try {
      // Basic syntax checks for common issues
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;

      if (openBraces !== closeBraces) {
        return { valid: false, error: "Mismatched braces" };
      }

      if (openParens !== closeParens) {
        return { valid: false, error: "Mismatched parentheses" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown syntax error",
      };
    }
  }

  /**
   * Detect common corruption patterns introduced by faulty transformations
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static detectCorruption(before, after) {
    const corruptionPatterns = [
      {
        name: "Double function calls",
        regex: /onClick=\{[^}]*\([^)]*\)\s*=>\s*\(\)\s*=>/g,
      },
      {
        name: "Malformed event handlers",
        regex: /onClick=\{[^}]*\)\([^)]*\)$/g,
      },
      {
        name: "Invalid JSX attributes",
        regex: /\w+=\{[^}]*\)[^}]*\}/g,
      },
      {
        name: "Broken import statements",
        regex: /import\s*{\s*\n\s*import\s*{/g,
      },
    ];

    for (const pattern of corruptionPatterns) {
      // Check if pattern exists in after but not before
      if (pattern.regex.test(after) && !pattern.regex.test(before)) {
        return {
          detected: true,
          pattern: pattern.name,
        };
      }
    }

    return { detected: false };
  }

  /**
   * Validate logical integrity of transformations
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static validateLogicalIntegrity(before, after) {
    // Check that essential imports weren't accidentally removed
    const beforeImports = this.extractImports(before);
    const afterImports = this.extractImports(after);

    const removedImports = beforeImports.filter(
      (imp) => !afterImports.includes(imp),
    );
    const criticalImports = ["React", "useState", "useEffect"];

    const removedCritical = removedImports.filter((imp) =>
      criticalImports.some((critical) => imp.includes(critical)),
    );

    if (removedCritical.length > 0) {
      return {
        valid: false,
        reason: `Critical imports removed: ${removedCritical.join(", ")}`,
      };
    }

    return { valid: true };
  }

  static extractImports(code) {
    const importRegex = /import\s+.*?\s+from\s+['"][^'"]+['"]/g;
    return code.match(importRegex) || [];
  }
}

/**
 * Safe Layer Execution Pattern (from IMPLEMENTATION_PATTERNS.md)
 * Executes layers with automatic rollback on failure
 */
async function executeLayers(code, enabledLayers, options = {}) {
  let current = code;
  const results = [];
  const states = [code]; // Track all intermediate states

  for (const layerId of enabledLayers) {
    const previous = current;
    const startTime = performance.now();

    if (options.verbose) {
      console.log(`🔧 Executing Layer ${layerId}...`);
    }

    try {
      // Apply transformation
      const transformed = await executeLayer(layerId, current, options);

      // Validate transformation safety
      const validation = TransformationValidator.validateTransformation(
        previous,
        transformed,
      );

      if (validation.shouldRevert) {
        console.warn(`⚠️  Reverting Layer ${layerId}: ${validation.reason}`);
        current = previous; // Rollback to safe state

        results.push({
          layerId,
          success: false,
          code: previous,
          executionTime: performance.now() - startTime,
          changeCount: 0,
          revertReason: validation.reason,
        });
      } else {
        current = transformed; // Accept changes
        states.push(current);

        results.push({
          layerId,
          success: true,
          code: current,
          executionTime: performance.now() - startTime,
          changeCount: calculateChanges(previous, transformed),
          improvements: detectImprovements(previous, transformed),
        });
      }
    } catch (error) {
      console.error(`❌ Layer ${layerId} failed:`, error.message);

      results.push({
        layerId,
        success: false,
        code: previous, // Keep previous safe state
        executionTime: performance.now() - startTime,
        changeCount: 0,
        error: error.message,
      });
    }
  }

  return {
    finalCode: current,
    results,
    states,
    totalExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
    successfulLayers: results.filter((r) => r.success).length,
  };
}

/**
 * Execute individual layer (maps to existing layer scripts)
 */
async function executeLayer(layerId, code, options = {}) {
  switch (layerId) {
    case 1:
      return await fixLayer1(code, options);
    case 2:
      return await fixLayer2(code, options);
    case 3:
      return await fixLayer3(code, options);
    case 4:
      return await fixLayer4(code, options);
    default:
      throw new Error(`Unknown layer: ${layerId}`);
  }
}

/**
 * Calculate changes between before and after code
 */
function calculateChanges(before, after) {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  let changes = Math.abs(beforeLines.length - afterLines.length);

  const minLength = Math.min(beforeLines.length, afterLines.length);
  for (let i = 0; i < minLength; i++) {
    if (beforeLines[i] !== afterLines[i]) changes++;
  }

  return changes;
}

/**
 * Detect improvements made by transformation
 */
function detectImprovements(before, after) {
  const improvements = [];

  // Check for HTML entity fixes
  if (
    /&quot;|&amp;|&lt;|&gt;/.test(before) &&
    !/&quot;|&amp;|&lt;|&gt;/.test(after)
  ) {
    improvements.push("HTML entities converted to proper characters");
  }

  // Check for key prop additions
  if (!before.includes("key=") && after.includes("key=")) {
    improvements.push("Missing key props added to map elements");
  }

  // Check for SSR guards
  if (
    before.includes("localStorage") &&
    !before.includes("typeof window") &&
    after.includes("typeof window")
  ) {
    improvements.push("SSR guards added for browser APIs");
  }

  // Check for console.log improvements
  if (before.includes("console.log") && after.includes("console.debug")) {
    improvements.push("Console.log statements converted to console.debug");
  }

  return improvements;
}

/**
 * Smart Layer Selection (from IMPLEMENTATION_PATTERNS.md)
 * Automatically determine which layers are needed based on code analysis
 */
class SmartLayerSelector {
  /**
   * Analyze code and suggest appropriate layers
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static analyzeAndRecommend(code, filePath) {
    const issues = this.detectIssues(code, filePath);
    const recommendations = this.generateRecommendations(issues);

    return {
      recommendedLayers: recommendations.layers,
      detectedIssues: issues,
      reasoning: recommendations.reasons,
      confidence: this.calculateConfidence(issues),
      estimatedImpact: this.estimateImpact(issues),
    };
  }

  /**
   * Detect specific issues in code that layers can fix
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static detectIssues(code, filePath) {
    const issues = [];

    // Layer 1: Configuration issues
    if (
      filePath &&
      (filePath.includes("tsconfig") || filePath.includes("next.config"))
    ) {
      if (
        code.includes('"target": "es5"') ||
        code.includes("reactStrictMode: false")
      ) {
        issues.push({
          type: "config",
          severity: "high",
          description: "Outdated configuration detected",
          fixedByLayer: 1,
          pattern: "Configuration modernization needed",
        });
      }
    }

    // Layer 2: Entity and pattern issues
    const entityPatterns = [
      { pattern: /&quot;/g, name: "HTML quote entities" },
      { pattern: /&amp;/g, name: "HTML ampersand entities" },
      { pattern: /&lt;|&gt;/g, name: "HTML bracket entities" },
      { pattern: /console\.log\(/g, name: "Console.log usage" },
      { pattern: /\bvar\s+/g, name: "Var declarations" },
    ];

    entityPatterns.forEach(({ pattern, name }) => {
      const matches = code.match(pattern);
      if (matches) {
        issues.push({
          type: "pattern",
          severity: "medium",
          description: `${name} found (${matches.length} occurrences)`,
          fixedByLayer: 2,
          pattern: name,
          count: matches.length,
        });
      }
    });

    // Layer 3: Component issues
    if (this.isReactComponent(code)) {
      // Missing key props in map functions
      const mapWithoutKey = /\.map\s*\([^)]*\)\s*=>\s*<[^>]*(?!.*key=)/g;
      const mapMatches = code.match(mapWithoutKey);
      if (mapMatches) {
        issues.push({
          type: "component",
          severity: "high",
          description: `Missing key props in ${mapMatches.length} map operations`,
          fixedByLayer: 3,
          pattern: "Missing key props",
          count: mapMatches.length,
        });
      }

      // Missing React imports
      if (code.includes("useState") && !code.includes("import { useState")) {
        issues.push({
          type: "component",
          severity: "high",
          description: "Missing React hook imports",
          fixedByLayer: 3,
          pattern: "Missing imports",
        });
      }

      // Accessibility issues
      const imgWithoutAlt = /<img(?![^>]*alt=)[^>]*>/g;
      const imgMatches = code.match(imgWithoutAlt);
      if (imgMatches) {
        issues.push({
          type: "component",
          severity: "medium",
          description: `${imgMatches.length} images missing alt attributes`,
          fixedByLayer: 3,
          pattern: "Accessibility issues",
          count: imgMatches.length,
        });
      }
    }

    // Layer 4: Hydration issues
    if (code.includes("localStorage") && !code.includes("typeof window")) {
      const localStorageMatches = code.match(/localStorage\./g);
      issues.push({
        type: "hydration",
        severity: "high",
        description: `${localStorageMatches?.length || 1} unguarded localStorage usage`,
        fixedByLayer: 4,
        pattern: "SSR safety",
        count: localStorageMatches?.length || 1,
      });
    }

    return issues;
  }

  /**
   * Generate layer recommendations based on detected issues
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static generateRecommendations(issues) {
    const layers = new Set();
    const reasons = [];

    // Group issues by layer
    const issuesByLayer = issues.reduce((acc, issue) => {
      if (!acc[issue.fixedByLayer]) {
        acc[issue.fixedByLayer] = [];
      }
      acc[issue.fixedByLayer].push(issue);
      return acc;
    }, {});

    // Always include layer 1 for foundation
    layers.add(1);
    reasons.push("Configuration layer provides essential foundation");

    // Add layers based on detected issues
    Object.entries(issuesByLayer).forEach(([layerId, layerIssues]) => {
      const id = parseInt(layerId);
      layers.add(id);

      const highSeverity = layerIssues.filter(
        (i) => i.severity === "high",
      ).length;
      const mediumSeverity = layerIssues.filter(
        (i) => i.severity === "medium",
      ).length;

      if (highSeverity > 0) {
        reasons.push(`Layer ${id}: ${highSeverity} critical issues detected`);
      }
      if (mediumSeverity > 0) {
        reasons.push(
          `Layer ${id}: ${mediumSeverity} medium priority issues detected`,
        );
      }
    });

    // Ensure dependency order
    const sortedLayers = Array.from(layers).sort((a, b) => a - b);

    return {
      layers: sortedLayers,
      reasons,
    };
  }

  static isReactComponent(code) {
    return (
      code.includes("import React") ||
      code.includes("import { ") ||
      (code.includes("function ") && code.includes("return (")) ||
      (code.includes("const ") && code.includes("=> ("))
    );
  }

  static calculateConfidence(issues) {
    const totalIssues = issues.length;
    const highSeverityCount = issues.filter(
      (i) => i.severity === "high",
    ).length;

    if (totalIssues === 0) return 0.5; // Neutral confidence when no issues

    // Higher confidence when more high-severity issues are detected
    return Math.min(0.9, 0.6 + (highSeverityCount / totalIssues) * 0.3);
  }

  static estimateImpact(issues) {
    const totalIssues = issues.length;
    const criticalCount = issues.filter((i) => i.severity === "high").length;

    return {
      level: criticalCount > 3 ? "high" : criticalCount > 0 ? "medium" : "low",
      description: `${totalIssues} total issues, ${criticalCount} critical`,
      estimatedFixTime: Math.max(30, totalIssues * 10) + " seconds",
    };
  }
}

/**
 * NeuroLint Pro Main Orchestrator
 * Entry point that follows all documented patterns
 */
async function NeuroLintPro(
  code,
  filePath,
  dryRun = false,
  requestedLayers = null,
) {
  console.log("🧠 NeuroLint Pro - Premium Debugging Service");
  console.log("==========================================");

  const startTime = performance.now();

  try {
    // Step 1: Smart Layer Selection (if layers not specified)
    let layersToExecute;
    let analysis;

    if (requestedLayers) {
      // Use provided layers but validate dependencies
      const validation =
        LayerDependencyManager.validateAndCorrectLayers(requestedLayers);
      layersToExecute = validation.correctedLayers;

      if (validation.warnings.length > 0) {
        console.log("⚠️  Layer Dependencies:");
        validation.warnings.forEach((warning) => console.log(`   ${warning}`));
      }
    } else {
      // Auto-detect layers needed
      analysis = SmartLayerSelector.analyzeAndRecommend(code, filePath);
      layersToExecute = analysis.recommendedLayers;

      console.log("🔍 Analysis Results:");
      console.log(`   Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
      console.log(
        `   Impact: ${analysis.estimatedImpact.level} (${analysis.estimatedImpact.description})`,
      );
      console.log(`   Recommended Layers: ${layersToExecute.join(", ")}`);

      if (analysis.reasoning.length > 0) {
        console.log("📋 Reasoning:");
        analysis.reasoning.forEach((reason) => console.log(`   • ${reason}`));
      }
    }

    if (dryRun) {
      console.log(
        "🔍 [DRY RUN] Would execute layers:",
        layersToExecute.join(", "),
      );
      return {
        dryRun: true,
        recommendedLayers: layersToExecute,
        analysis: analysis || null,
        estimatedChanges: analysis ? analysis.detectedIssues.length : 0,
      };
    }

    // Step 2: Execute Layers with Safe Pattern
    console.log(`🚀 Executing ${layersToExecute.length} layers...`);

    const result = await executeLayers(code, layersToExecute, {
      verbose: true,
    });

    // Step 3: Generate Results
    const totalTime = performance.now() - startTime;

    console.log("📊 Execution Results:");
    console.log(`   Total Time: ${totalTime.toFixed(0)}ms`);
    console.log(
      `   Successful Layers: ${result.successfulLayers}/${layersToExecute.length}`,
    );
    console.log(
      `   Total Changes: ${result.results.reduce((sum, r) => sum + r.changeCount, 0)}`,
    );

    // Show improvements
    const allImprovements = result.results
      .filter((r) => r.success && r.improvements)
      .flatMap((r) => r.improvements);

    if (allImprovements.length > 0) {
      console.log("✨ Improvements Made:");
      allImprovements.forEach((improvement) =>
        console.log(`   • ${improvement}`),
      );
    }

    // Show any reverted layers
    const revertedLayers = result.results.filter((r) => r.revertReason);
    if (revertedLayers.length > 0) {
      console.log("⚠️  Reverted Layers:");
      revertedLayers.forEach((layer) =>
        console.log(`   Layer ${layer.layerId}: ${layer.revertReason}`),
      );
    }

    return {
      success: result.successfulLayers === layersToExecute.length,
      transformed: result.finalCode,
      originalCode: code,
      layers: result.results,
      analysis: analysis || null,
      totalExecutionTime: totalTime,
      states: result.states,
    };
  } catch (error) {
    console.error("❌ NeuroLint Pro execution failed:", error.message);
    return {
      success: false,
      error: error.message,
      transformed: code, // Return original code on failure
      layers: [],
    };
  }
}

module.exports = NeuroLintPro;

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      "Usage: node neurolint-pro.js <file-path> [--dry-run] [--layers 1,2,3,4]",
    );
    process.exit(1);
  }

  const filePath = args[0];
  const dryRun = args.includes("--dry-run");
  const layersArg = args.find((arg) => arg.startsWith("--layers"));
  const requestedLayers = layersArg
    ? layersArg
        .split("=")[1]
        .split(",")
        .map((n) => parseInt(n.trim()))
    : null;

  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    process.exit(1);
  }

  const code = fs.readFileSync(filePath, "utf8");

  NeuroLintPro(code, filePath, dryRun, requestedLayers)
    .then((result) => {
      if (result.success && !result.dryRun) {
        // Write transformed code back to file
        fs.writeFileSync(filePath, result.transformed);
        console.log("✅ File successfully transformed");
      }
    })
    .catch((error) => {
      console.error("❌ Execution failed:", error.message);
      process.exit(1);
    });
}
