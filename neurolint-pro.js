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

// Import enhanced AST engine if available
// Enhanced engine is now loaded explicitly via CLI flags
// No automatic loading - users control when to use AST features

// Execute existing layer scripts via child process since they are not properly modularized

/**
 * Core Architecture Principles (from IMPLEMENTATION_PATTERNS.md)
 * Layers must execute in order (1→2→3→4→5→6) because each builds on the previous
 */
const LAYER_EXECUTION_ORDER = [
  { id: 1, name: "Configuration", description: "Foundation setup" },
  { id: 2, name: "Entity Cleanup", description: "Preprocessing patterns" },
  { id: 3, name: "Components", description: "React/TS specific fixes" },
  { id: 4, name: "Hydration", description: "Runtime safety guards" },
  {
    id: 5,
    name: "Next.js App Router",
    description: "Next.js specific optimizations",
  },
  {
    id: 6,
    name: "Testing & Validation",
    description: "Testing patterns and validation",
  },
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
    5: [1, 2, 3, 4], // Next.js depends on all core layers
    6: [1, 2, 3, 4, 5], // Testing depends on all previous layers
  };

  static LAYER_INFO = {
    1: { name: "Configuration", critical: true },
    2: { name: "Entity Cleanup", critical: false },
    3: { name: "Components", critical: false },
    4: { name: "Hydration", critical: false },
    5: { name: "Next.js App Router", critical: false },
    6: { name: "Testing & Validation", critical: false },
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

  const totalLayers = enabledLayers.length;
  let completed = 0;

  for (const layerId of enabledLayers) {
    const previous = current;
    const startTime = performance.now();
    const layerInfo = LAYER_EXECUTION_ORDER.find((l) => l.id === layerId);

    if (options.verbose) {
      console.log(
        `%c🔧 LAYER ${layerId} STARTING`,
        "color: #2196f3; font-weight: bold;",
      );
      console.log(`   📛 Name: ${layerInfo?.name || "Unknown"}`);
      console.log(
        `   📝 Description: ${layerInfo?.description || "No description"}`,
      );
      console.log(
        `   📊 Progress: ${completed}/${totalLayers} (${Math.round((completed / totalLayers) * 100)}%)`,
      );
      console.log(`   📏 Input Code Size: ${current.length} characters`);
    }

    // Emit progress event: layer start
    if (typeof options.onProgress === "function") {
      options.onProgress({
        layerId,
        status: `Processing ${layerInfo?.name || `Layer ${layerId}`}`,
        completed,
        total: totalLayers,
        percent: Math.round((completed / totalLayers) * 100),
      });
    }

    try {
      // Apply transformation with error recovery
      const layerResult = await ErrorRecoverySystem.executeWithRecovery(
        current,
        layerId,
        options,
      );

      if (!layerResult.success) {
        // Handle layer execution failure
        results.push(layerResult);

        if (typeof options.onProgress === "function") {
          options.onProgress({
            layerId,
            status: "failed",
            completed,
            total: totalLayers,
            percent: Math.round((completed / totalLayers) * 100),
            error: layerResult.error || layerResult.revertReason,
          });
        }
        continue; // Skip to next layer
      }

      const transformed = layerResult.code;

      // Validate transformation safety
      const validation = TransformationValidator.validateTransformation(
        previous,
        transformed,
      );

      if (validation.shouldRevert) {
        const executionTime = performance.now() - startTime;
        console.warn(
          `%c⚠️  LAYER ${layerId} REVERTED`,
          "color: #ff9800; font-weight: bold;",
        );
        console.warn(`   🚫 Revert Reason: ${validation.reason}`);
        console.warn(`   ⏱️  Execution Time: ${executionTime.toFixed(0)}ms`);
        console.warn(`   🔄 Rolling back to previous safe state`);

        current = previous; // Rollback to safe state

        results.push({
          layerId,
          success: false,
          code: previous,
          executionTime,
          changeCount: 0,
          revertReason: validation.reason,
        });

        if (typeof options.onProgress === "function") {
          options.onProgress({
            layerId,
            status: "reverted",
            completed,
            total: totalLayers,
            percent: Math.round((completed / totalLayers) * 100),
            error: validation.reason,
          });
        }
      } else {
        const executionTime = performance.now() - startTime;
        const changeCount = calculateChanges(previous, transformed);
        const improvements = detectImprovements(previous, transformed);

        console.log(
          `%c✅ LAYER ${layerId} SUCCESS`,
          "color: #4caf50; font-weight: bold;",
        );
        console.log(`   ⏱️  Execution Time: ${executionTime.toFixed(0)}ms`);
        console.log(`   🔧 Changes Made: ${changeCount}`);
        console.log(
          `   📏 Code Size: ${previous.length} → ${transformed.length} characters`,
        );
        console.log(
          `   📈 Size Change: ${transformed.length - previous.length > 0 ? "+" : ""}${transformed.length - previous.length}`,
        );

        if (improvements.length > 0) {
          console.log(`   ✨ Improvements:`);
          improvements.forEach((improvement) =>
            console.log(`      • ${improvement}`),
          );
        }

        current = transformed; // Accept changes
        states.push(current);

        completed++;

        results.push({
          layerId,
          success: true,
          code: current,
          executionTime,
          changeCount,
          improvements,
        });

        if (typeof options.onProgress === "function") {
          options.onProgress({
            layerId,
            status: "complete",
            completed,
            total: totalLayers,
            percent: Math.round((completed / totalLayers) * 100),
          });
        }
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

      if (typeof options.onProgress === "function") {
        options.onProgress({
          layerId,
          status: "error",
          completed,
          total: totalLayers,
          percent: Math.round((completed / totalLayers) * 100),
          error: error.message,
        });
      }
    }
  }

  // Emit final progress 100%
  if (typeof options.onProgress === "function") {
    options.onProgress({
      status: "done",
      completed: totalLayers,
      total: totalLayers,
      percent: 100,
    });
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
 * Error Recovery and Reporting System (from IMPLEMENTATION_PATTERNS.md)
 * Advanced error recovery system with categorized error handling
 */
class ErrorRecoverySystem {
  /**
   * Execute layer with comprehensive error recovery
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static async executeWithRecovery(code, layerId, options = {}) {
    const startTime = performance.now();

    try {
      // Attempt normal execution
      const result = await executeLayer(layerId, code, options);

      return {
        success: true,
        code: result,
        executionTime: performance.now() - startTime,
        improvements: detectImprovements(code, result),
        layerId,
      };
    } catch (error) {
      // Categorize and handle errors appropriately
      const errorInfo = this.categorizeError(error, layerId, code);

      console.error(`❌ Layer ${layerId} error:`, errorInfo.message);

      return {
        success: false,
        code, // Return original code unchanged
        executionTime: performance.now() - startTime,
        error: errorInfo.message,
        errorCategory: errorInfo.category,
        suggestion: errorInfo.suggestion,
        recoveryOptions: errorInfo.recoveryOptions,
        layerId,
      };
    }
  }

  /**
   * Categorize errors for appropriate handling and user feedback
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static categorizeError(error, layerId, code) {
    const errorMessage = error.message || error.toString();

    // Syntax errors
    if (
      error.name === "SyntaxError" ||
      errorMessage.includes("Unexpected token")
    ) {
      return {
        category: "syntax",
        message: "Code syntax prevented transformation",
        suggestion: "Fix syntax errors before running NeuroLint",
        recoveryOptions: [
          "Run syntax validation first",
          "Use a code formatter",
          "Check for missing brackets or semicolons",
        ],
        severity: "high",
      };
    }

    // File system errors
    if (
      errorMessage.includes("ENOENT") ||
      errorMessage.includes("permission")
    ) {
      return {
        category: "filesystem",
        message: "File system access error",
        suggestion: "Check file permissions and paths",
        recoveryOptions: [
          "Verify file exists",
          "Check write permissions",
          "Run with elevated privileges if needed",
        ],
        severity: "high",
      };
    }

    // Layer-specific errors
    const layerSpecificError = this.getLayerSpecificError(
      layerId,
      errorMessage,
    );
    if (layerSpecificError) {
      return layerSpecificError;
    }

    // Generic errors
    return {
      category: "unknown",
      message: `Unexpected error in Layer ${layerId}`,
      suggestion: "Please report this issue with your code sample",
      recoveryOptions: [
        "Try running other layers individually",
        "Check console for additional details",
        "Report issue with minimal reproduction case",
      ],
      severity: "medium",
    };
  }

  /**
   * Handle layer-specific error patterns
   * Exact implementation from IMPLEMENTATION_PATTERNS.md
   */
  static getLayerSpecificError(layerId, errorMessage) {
    switch (layerId) {
      case 1: // Configuration layer
        if (errorMessage.includes("JSON")) {
          return {
            category: "config",
            message: "Invalid JSON in configuration file",
            suggestion: "Validate JSON syntax in config files",
            recoveryOptions: [
              "Use JSON validator",
              "Check for trailing commas",
            ],
            severity: "high",
          };
        }
        break;

      case 2: // Pattern layer
        if (errorMessage.includes("replace")) {
          return {
            category: "pattern",
            message: "Pattern replacement failed",
            suggestion: "Some patterns may conflict with your code structure",
            recoveryOptions: [
              "Skip pattern layer",
              "Review conflicting patterns",
            ],
            severity: "low",
          };
        }
        break;

      case 3: // Component layer
        if (errorMessage.includes("JSX")) {
          return {
            category: "component",
            message: "JSX transformation error",
            suggestion: "Complex JSX structures may need manual fixing",
            recoveryOptions: ["Simplify JSX", "Use manual key addition"],
            severity: "medium",
          };
        }
        break;

      case 4: // Hydration layer
        if (
          errorMessage.includes("localStorage") ||
          errorMessage.includes("window")
        ) {
          return {
            category: "hydration",
            message: "Browser API protection failed",
            suggestion: "Manual SSR guards may be needed for complex cases",
            recoveryOptions: [
              "Add manual typeof window checks",
              "Use useEffect hooks",
            ],
            severity: "medium",
          };
        }
        break;
    }

    return null;
  }
}

/**
 * Execute a specific layer with proper integration and debugging
 * FIXED: Now properly connects with your layer transformation system
 */
async function executeLayer(layerId, code, options = {}) {
  console.log(`🔧 [LAYER ${layerId}] Starting layer execution`);
  console.log(`🔧 [LAYER ${layerId}] Input code length: ${code.length}`);
  console.log(`🔧 [LAYER ${layerId}] Options:`, options);

  const layerName = getLayerName(layerId);
  console.log(`🔧 [LAYER ${layerId}] Layer name: ${layerName}`);

  // For demo/single file processing, skip script execution and use fallback directly
  if (options.isDemoMode || options.singleFile || !code.includes("src/")) {
    console.log(
      `🔧 [LAYER ${layerId}] Demo mode detected - using fallback transformations`,
    );
    return applyLayerTransformations(layerId, code, options);
  }

  // Create a temporary file for the specific code to be transformed
  const tempFile = path.join(
    process.cwd(),
    `.temp-layer-${layerId}-${Date.now()}.jsx`,
  );

  console.log(`🔧 [LAYER ${layerId}] Temp file: ${tempFile}`);

  try {
    // Write the input code to temp file
    fs.writeFileSync(tempFile, code);
    console.log(`🔧 [LAYER ${layerId}] Code written to temp file`);

    // Execute the appropriate layer script with temp file as argument
    const layerScript = `fix-layer-${layerId}-${layerName}.js`;
    console.log(`🔧 [LAYER ${layerId}] Looking for script: ${layerScript}`);

    if (!fs.existsSync(layerScript)) {
      console.error(
        `🔧 [LAYER ${layerId}] ❌ Layer script not found: ${layerScript}`,
      );
      // Instead of failing, apply basic transformations based on layer type
      return applyLayerTransformations(layerId, code, options);
    }

    console.log(`🔧 [LAYER ${layerId}] ✅ Layer script found, executing...`);

    // Run layer script with the temp file as an argument
    const command = `node ${layerScript} "${tempFile}"`;
    console.log(`🔧 [LAYER ${layerId}] Command: ${command}`);

    const result = execSync(command, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: options.verbose ? "inherit" : "pipe",
      timeout: 30000, // 30 second timeout
    });

    console.log(
      `🔧 [LAYER ${layerId}] Script execution result:`,
      result.substring(0, 200) + "...",
    );

    // Read the potentially modified temp file
    let transformedCode = code;
    if (fs.existsSync(tempFile)) {
      transformedCode = fs.readFileSync(tempFile, "utf8");
      console.log(
        `🔧 [LAYER ${layerId}] Read transformed code length: ${transformedCode.length}`,
      );

      // Check if code was actually modified
      const wasModified = transformedCode !== code;
      console.log(`🔧 [LAYER ${layerId}] Code was modified: ${wasModified}`);

      if (wasModified) {
        console.log(
          `🔧 [LAYER ${layerId}] ✅ Layer ${layerId} successfully transformed the code`,
        );
      } else {
        console.log(
          `🔧 [LAYER ${layerId}] ⚠️  Layer ${layerId} did not modify the code - applying fallback transformations`,
        );
        // Apply our own transformations as fallback
        transformedCode = applyLayerTransformations(layerId, code, options);
      }
    } else {
      console.log(
        `🔧 [LAYER ${layerId}] ⚠️  Temp file was deleted by script - applying fallback transformations`,
      );
      transformedCode = applyLayerTransformations(layerId, code, options);
    }

    console.log(
      `🔧 [LAYER ${layerId}] Final transformed code length: ${transformedCode.length}`,
    );
    return transformedCode;
  } catch (error) {
    console.error(
      `🔧 [LAYER ${layerId}] ❌ Error executing layer:`,
      error.message,
    );
    console.log(
      `🔧 [LAYER ${layerId}] Applying fallback transformations due to error`,
    );

    // Fallback to our own transformations
    return applyLayerTransformations(layerId, code, options);
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log(`🔧 [LAYER ${layerId}] Temp file cleaned up`);
    }
  }
}

/**
 * Apply layer-specific transformations (fallback implementation)
 * This ensures the layers are properly connected even if scripts fail
 */
function applyLayerTransformations(layerId, code, options = {}) {
  console.log(`🛠️  [FALLBACK] Applying Layer ${layerId} transformations`);

  let transformedCode = code;
  const appliedFixes = [];

  switch (layerId) {
    case 1: // Configuration Layer
      console.log(`🛠️  [FALLBACK] Layer 1: Configuration fixes`);
      // No direct code transformations for config layer in individual files
      break;

    case 2: // Entity & Pattern Cleanup
      console.log(`🛠️  [FALLBACK] Layer 2: Entity and pattern cleanup`);

      // Fix HTML entities
      if (transformedCode.includes("&quot;")) {
        transformedCode = transformedCode.replace(/&quot;/g, '"');
        appliedFixes.push("HTML Entity: Converted &quot; to quotes");
        console.log(`🛠️  [FALLBACK] Fixed HTML entities: &quot;`);
      }
      if (transformedCode.includes("&amp;")) {
        transformedCode = transformedCode.replace(/&amp;/g, "&");
        appliedFixes.push("HTML Entity: Converted &amp; to ampersand");
        console.log(`🛠️  [FALLBACK] Fixed HTML entities: &amp;`);
      }
      if (transformedCode.includes("&lt;")) {
        transformedCode = transformedCode.replace(/&lt;/g, "<");
        appliedFixes.push("HTML Entity: Converted &lt; to less-than");
        console.log(`🛠️  [FALLBACK] Fixed HTML entities: &lt;`);
      }
      if (transformedCode.includes("&gt;")) {
        transformedCode = transformedCode.replace(/&gt;/g, ">");
        appliedFixes.push("HTML Entity: Converted &gt; to greater-than");
        console.log(`🛠️  [FALLBACK] Fixed HTML entities: &gt;`);
      }

      // Clean up console statements - convert to console.debug (per documentation)
      if (transformedCode.includes("console.log")) {
        transformedCode = transformedCode.replace(
          /console\.log\(/g,
          "console.debug(",
        );
        appliedFixes.push(
          "Console Cleanup: Converted console.log to console.debug",
        );
        console.log(`🛠️  [FALLBACK] Converted console.log to console.debug`);
      }
      break;

    case 3: // Component Fixes
      console.log(`🛠️  [FALLBACK] Layer 3: Component fixes`);

      // Fix missing key props in mapped elements
      if (
        transformedCode.includes(".map(") &&
        !transformedCode.includes("key=")
      ) {
        // More comprehensive key prop fixing for various JSX patterns
        let hasChanges = false;
        const beforeFix = transformedCode;

        // Pattern 1: items.map(item => <element>...)
        transformedCode = transformedCode.replace(
          /(\w+)\.map\((\w+)\s*=>\s*<(\w+)([^>]*?)>/g,
          (match, array, item, tag, props) => {
            if (!props.includes("key=")) {
              return `${array}.map(${item} => <${tag} key={${item}.id || ${item}.name || \`${tag}-\${Math.random().toString(36).substr(2, 9)}\`}${props}>`;
            }
            return match;
          },
        );

        // Pattern 2: items.map(item => ( <element>...))
        transformedCode = transformedCode.replace(
          /(\w+)\.map\((\w+)\s*=>\s*\(\s*<(\w+)([^>]*?)>/g,
          (match, array, item, tag, props) => {
            if (!props.includes("key=")) {
              return `${array}.map(${item} => ( <${tag} key={${item}.id || ${item}.name || \`${tag}-\${Math.random().toString(36).substr(2, 9)}\`}${props}>`;
            }
            return match;
          },
        );

        hasChanges = beforeFix !== transformedCode;
        if (hasChanges) {
          appliedFixes.push(
            "React Keys: Added missing key props to mapped elements",
          );
          console.log(`🛠️  [FALLBACK] Added missing key props`);
        }
      }

      // Fix missing alt attributes
      if (
        transformedCode.includes("<img") &&
        !transformedCode.includes("alt=")
      ) {
        transformedCode = transformedCode.replace(
          /<img\s+src={([^}]+)}\s*\/?>/g,
          '<img src={$1} alt="" />',
        );
        transformedCode = transformedCode.replace(
          /<img\s+src={([^}]+)}\s+onClick/g,
          '<img src={$1} alt="" onClick',
        );
        appliedFixes.push("Accessibility: Added alt attributes to images");
        console.log(`🛠️  [FALLBACK] Added missing alt attributes`);
      }
      break;

    case 4: // Hydration Safety
      console.log(`🛠️  [FALLBACK] Layer 4: Hydration safety`);

      // Fix localStorage SSR issues
      if (
        transformedCode.includes("localStorage") &&
        !transformedCode.includes("typeof window")
      ) {
        transformedCode = transformedCode.replace(
          /localStorage\.getItem\('([^']+)'\)/g,
          "typeof window !== 'undefined' ? localStorage.getItem('$1') : null",
        );
        transformedCode = transformedCode.replace(
          /localStorage\.setItem\('([^']+)',\s*([^)]+)\)/g,
          "typeof window !== 'undefined' && localStorage.setItem('$1', $2)",
        );
        appliedFixes.push(
          "SSR Safety: Added SSR guards for localStorage access",
        );
        console.log(`🛠️  [FALLBACK] Added SSR guards for localStorage`);
      }

      // Fix document access
      if (
        transformedCode.includes("document.") &&
        !transformedCode.includes("typeof document")
      ) {
        transformedCode = transformedCode.replace(
          /document\.(\w+)/g,
          "typeof document !== 'undefined' ? document.$1 : null",
        );
        appliedFixes.push("SSR Safety: Added SSR guards for document access");
        console.log(`🛠️  [FALLBACK] Added SSR guards for document access`);
      }
      break;

    case 5: // Next.js App Router
      console.log(`🛠️  [FALLBACK] Layer 5: Next.js App Router fixes`);

      // Fix misplaced 'use client' directives
      if (
        transformedCode.includes("'use client'") &&
        !transformedCode.startsWith("'use client';")
      ) {
        // Remove misplaced 'use client'
        transformedCode = transformedCode.replace(/\n\s*'use client';/g, "");
        // Add at the top
        transformedCode = "'use client';\n\n" + transformedCode;
        appliedFixes.push("Next.js: Fixed misplaced use client directive");
        console.log(`🛠️  [FALLBACK] Fixed misplaced 'use client' directive`);
      }

      // Add missing 'use client' for components using hooks
      if (
        (transformedCode.includes("useState") ||
          transformedCode.includes("useEffect")) &&
        !transformedCode.includes("'use client'") &&
        (transformedCode.includes("export default function") ||
          transformedCode.includes("export function"))
      ) {
        transformedCode = "'use client';\n\n" + transformedCode;
        appliedFixes.push(
          "Next.js: Added missing use client directive for hooks",
        );
        console.log(`🛠️  [FALLBACK] Added missing 'use client' directive`);
      }

      // Fix corrupted import statements
      if (transformedCode.includes("import {\n import {")) {
        transformedCode = transformedCode.replace(
          /import\s*{\s*\n\s*import\s*{([^}]+)}\s*from\s*["']([^"']+)["']/gm,
          'import { $1 } from "$2"',
        );
        appliedFixes.push("Next.js: Fixed corrupted import statements");
        console.log(`🛠️  [FALLBACK] Fixed corrupted import statements`);
      }
      break;

    case 6: // Testing & Validation
      console.log(`🛠️  [FALLBACK] Layer 6: Testing and validation`);

      // Add missing prop types for TypeScript
      if (
        transformedCode.includes("export default function") &&
        transformedCode.includes("props") &&
        !transformedCode.includes("interface") &&
        !transformedCode.includes("type Props")
      ) {
        const componentMatch = transformedCode.match(
          /export default function (\w+)\(\s*{\s*([^}]+)\s*}/,
        );
        if (componentMatch) {
          const [, componentName, props] = componentMatch;
          const propNames = props
            .split(",")
            .map((p) => p.trim().split(":")[0].trim());
          const interfaceDefinition = `interface ${componentName}Props {\n  ${propNames.map((prop) => `${prop}: any;`).join("\n  ")}\n}\n\n`;
          transformedCode =
            interfaceDefinition +
            transformedCode.replace(
              `export default function ${componentName}({ ${props} }`,
              `export default function ${componentName}({ ${props} }: ${componentName}Props`,
            );
          appliedFixes.push("Testing: Added TypeScript prop interfaces");
          console.log(`🛠️  [FALLBACK] Added TypeScript prop interfaces`);
        }
      }

      // Add basic accessibility attributes
      if (
        transformedCode.includes("<button") &&
        !transformedCode.includes("aria-label")
      ) {
        transformedCode = transformedCode.replace(
          /<button([^>]*?)>/g,
          (match, attributes) => {
            if (!attributes.includes("aria-label")) {
              return `<button${attributes} aria-label="Button">`;
            }
            return match;
          },
        );
        appliedFixes.push("Testing: Added accessibility attributes to buttons");
        console.log(`🛠️  [FALLBACK] Added accessibility attributes`);
      }

      // Add error handling for async operations
      if (
        transformedCode.includes("async") &&
        transformedCode.includes("await") &&
        !transformedCode.includes("try") &&
        !transformedCode.includes("catch")
      ) {
        // Add basic error handling pattern
        const asyncMatch = transformedCode.match(
          /(const \w+ = async \([^)]*\) => {[\s\S]*?})/,
        );
        if (asyncMatch) {
          const asyncFunction = asyncMatch[1];
          const wrappedFunction = asyncFunction.replace(
            /(async \([^)]*\) => {)([\s\S]*)(})/,
            '$1\n    try {$2\n    } catch (error) {\n      console.error("Error:", error);\n    }\n  $3',
          );
          transformedCode = transformedCode.replace(
            asyncFunction,
            wrappedFunction,
          );
          appliedFixes.push(
            "Testing: Added error handling for async operations",
          );
          console.log(
            `🛠️  [FALLBACK] Added error handling for async operations`,
          );
        }
      }

      // Add loading states for async components
      if (
        transformedCode.includes("async") &&
        transformedCode.includes("useState") &&
        !transformedCode.includes("loading") &&
        !transformedCode.includes("isLoading")
      ) {
        const stateMatch = transformedCode.match(
          /const \[([^,]+),\s*set[^\]]+\] = useState/,
        );
        if (stateMatch) {
          transformedCode = transformedCode.replace(
            stateMatch[0],
            `const [isLoading, setIsLoading] = useState(false);\n  ${stateMatch[0]}`,
          );
          appliedFixes.push("Testing: Added loading state");
          console.log(`🛠️  [FALLBACK] Added loading state`);
        }
      }

      // Fix invalid component exports
      if (
        transformedCode.includes("function ") &&
        !transformedCode.includes("export default") &&
        !transformedCode.includes("export {")
      ) {
        const functionMatch = transformedCode.match(/function (\w+)\s*\(/);
        if (
          functionMatch &&
          !transformedCode.includes(`export default ${functionMatch[1]}`)
        ) {
          transformedCode += `\n\nexport default ${functionMatch[1]};`;
          appliedFixes.push("Testing: Added proper component export");
          console.log(`🛠️  [FALLBACK] Added proper component export`);
        }
      }

      // Replace 'any' types with 'unknown' for strict mode compliance
      if (
        transformedCode.includes("any") &&
        !transformedCode.includes("// @ts-ignore") &&
        transformedCode.includes("interface")
      ) {
        transformedCode = transformedCode
          .replace(/:\s*any(?!\[\])/g, ": unknown")
          .replace(/any\[\]/g, "unknown[]");
        appliedFixes.push(
          "Testing: Improved TypeScript strict mode compliance",
        );
        console.log(
          `🛠️  [FALLBACK] Improved TypeScript strict mode compliance`,
        );
      }
      break;

    default:
      console.log(
        `🛠️  [FALLBACK] Unknown layer ${layerId} - no transformations applied`,
      );
  }

  console.log(
    `🛠️  [FALLBACK] Layer ${layerId} applied ${appliedFixes.length} fixes:`,
    appliedFixes,
  );
  return transformedCode;
}

/**
 * Get layer name for script filename
 */
function getLayerName(layerId) {
  const names = {
    1: "config",
    2: "patterns",
    3: "components",
    4: "hydration",
    5: "nextjs",
    6: "testing",
  };
  return names[layerId] || "unknown";
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

    // Layer 5: Next.js App Router issues (based on fix-layer-5-nextjs.js)
    if (this.isReactComponent(code)) {
      // Corrupted import statements - more comprehensive detection
      if (
        /import\s*{\s*$|import\s*{\s*\n\s*import/m.test(code) ||
        /import\s*{\s*[^}]*\n\s*[^}]*from/m.test(code)
      ) {
        issues.push({
          type: "nextjs",
          severity: "critical",
          description:
            "Corrupted import statements detected - builds will fail",
          fixedByLayer: 5,
          pattern: "Corrupted imports",
        });
      }

      // Misplaced 'use client' directives
      const hasUseClient = code.includes("'use client'");
      if (hasUseClient) {
        const lines = code.split("\n");
        const useClientIndex = lines.findIndex(
          (line) => line.trim() === "'use client';",
        );

        // Check if there are imports or other statements before 'use client'
        let hasMisplacedUseClient = false;
        for (let i = 0; i < useClientIndex; i++) {
          const line = lines[i].trim();
          if (line && !line.startsWith("//") && !line.startsWith("/*")) {
            hasMisplacedUseClient = true;
            break;
          }
        }

        if (hasMisplacedUseClient) {
          issues.push({
            type: "nextjs",
            severity: "high",
            description:
              "'use client' directive must be at the top of the file",
            fixedByLayer: 5,
            pattern: "Misplaced use client",
          });
        }
      }

      // Missing 'use client' for components using hooks
      const hasHooks =
        /use(State|Effect|Router|Context|Reducer|Callback|Memo|Ref|ImperativeHandle|LayoutEffect|DebugValue)/.test(
          code,
        );
      const isComponent =
        code.includes("export default function") ||
        code.includes("export function");

      if (hasHooks && !hasUseClient && isComponent) {
        issues.push({
          type: "nextjs",
          severity: "high",
          description:
            "Components using React hooks need 'use client' directive",
          fixedByLayer: 5,
          pattern: "Missing use client for hooks",
        });
      }

      // Import order issues after 'use client'
      if (hasUseClient && code.includes("\n\nimport")) {
        const afterUseClient = code.split("'use client';")[1];
        if (afterUseClient && !/^\n\n/.test(afterUseClient)) {
          issues.push({
            type: "nextjs",
            severity: "medium",
            description: "Improper spacing after 'use client' directive",
            fixedByLayer: 5,
            pattern: "Import order after use client",
          });
        }
      }

      // React import issues with 'use client'
      if (
        hasUseClient &&
        !code.includes("import React") &&
        (code.includes("useState") || code.includes("useEffect"))
      ) {
        issues.push({
          type: "nextjs",
          severity: "medium",
          description: "Missing React import in client component using hooks",
          fixedByLayer: 5,
          pattern: "React import cleanup",
        });
      }
    }

    // Layer 6: Testing and validation issues (based on fix-layer-6-testing.js)
    if (this.isReactComponent(code)) {
      // Missing error boundaries for components that might fail
      if (
        code.includes("export default function") &&
        code.includes("useState") &&
        !code.includes("ErrorBoundary") &&
        !code.includes("componentDidCatch") &&
        (code.includes("PDF") ||
          code.includes("upload") ||
          code.includes("API"))
      ) {
        issues.push({
          type: "testing",
          severity: "high",
          description:
            "Component handling uploads/APIs should have error boundaries",
          fixedByLayer: 6,
          pattern: "Missing error boundaries",
        });
      }

      // Missing prop types for TypeScript
      if (
        code.includes("export default function") &&
        code.includes("props") &&
        !code.includes("interface") &&
        !code.includes("type Props")
      ) {
        issues.push({
          type: "testing",
          severity: "medium",
          description: "Missing TypeScript prop type definitions",
          fixedByLayer: 6,
          pattern: "Missing prop types",
        });
      }

      // Missing loading states for async components
      if (
        code.includes("async") &&
        code.includes("useState") &&
        !code.includes("loading") &&
        !code.includes("isLoading")
      ) {
        issues.push({
          type: "testing",
          severity: "medium",
          description: "Async operations should have loading states",
          fixedByLayer: 6,
          pattern: "Missing loading states",
        });
      }

      // Invalid component exports
      if (
        code.includes("function ") &&
        !code.includes("export default") &&
        !code.includes("export {")
      ) {
        issues.push({
          type: "testing",
          severity: "high",
          description: "Component function should be properly exported",
          fixedByLayer: 6,
          pattern: "Invalid component exports",
        });
      }

      // Missing accessibility attributes
      if (
        code.includes("<button") &&
        !code.includes("aria-label") &&
        !code.includes("aria-describedby")
      ) {
        const buttonMatches = code.match(/<button/g);
        issues.push({
          type: "testing",
          severity: "medium",
          description: `${buttonMatches?.length || 1} buttons missing accessibility attributes`,
          fixedByLayer: 6,
          pattern: "Missing accessibility attributes",
          count: buttonMatches?.length || 1,
        });
      }

      // Missing React.memo for pure components
      if (
        code.includes("export default function") &&
        !code.includes("useState") &&
        !code.includes("useEffect") &&
        !code.includes("React.memo") &&
        code.includes("props")
      ) {
        issues.push({
          type: "testing",
          severity: "low",
          description:
            "Pure component could benefit from React.memo optimization",
          fixedByLayer: 6,
          pattern: "Performance optimization",
        });
      }

      // Missing error handling for async operations
      if (
        code.includes("async") &&
        code.includes("await") &&
        !code.includes("try") &&
        !code.includes("catch")
      ) {
        const asyncMatches = code.match(/async/g);
        issues.push({
          type: "testing",
          severity: "high",
          description: `${asyncMatches?.length || 1} async operations without error handling`,
          fixedByLayer: 6,
          pattern: "Missing error handling",
          count: asyncMatches?.length || 1,
        });
      }
    }

    // Additional Layer 6 validations
    // Potential circular dependencies
    if (filePath) {
      const imports = code.match(/import.*from ['"](\.[^'"]+)['"]/g) || [];
      const currentDir = filePath.split("/").slice(0, -1).join("/");
      const currentFileName = filePath
        .split("/")
        .pop()
        ?.replace(/\.(ts|tsx|js|jsx)$/, "");

      const hasCircularRisk = imports.some((imp) => {
        const importPath = imp.match(/from ['"](\.[^'"]+)['"]/)?.[1];
        return (
          importPath && currentFileName && importPath.includes(currentFileName)
        );
      });

      if (hasCircularRisk) {
        issues.push({
          type: "testing",
          severity: "medium",
          description: "Potential circular dependency detected",
          fixedByLayer: 6,
          pattern: "Circular dependencies",
        });
      }
    }

    // TypeScript strict mode compliance
    if (
      code.includes("any") &&
      !code.includes("// @ts-ignore") &&
      code.includes("interface")
    ) {
      const anyMatches = code.match(/:\s*any(?!\[\])/g);
      if (anyMatches && anyMatches.length > 0) {
        issues.push({
          type: "testing",
          severity: "low",
          description: `${anyMatches.length} uses of 'any' type - consider more specific types`,
          fixedByLayer: 6,
          pattern: "TypeScript strict mode",
          count: anyMatches.length,
        });
      }
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
 * Generate simulated fixes for demo preview
 * Shows what would be fixed without actually running the layers
 */
function generateSimulatedFixes(code, detectedIssues) {
  let previewCode = code;

  // Apply quick fixes based on detected issues for demo preview
  detectedIssues.forEach((issue) => {
    switch (issue.pattern) {
      case "HTML quote entities":
        previewCode = previewCode.replace(/&quot;/g, '"');
        break;
      case "HTML ampersand entities":
        previewCode = previewCode.replace(/&amp;/g, "&");
        break;
      case "HTML bracket entities":
        previewCode = previewCode.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        break;
      case "Console.log usage":
        previewCode = previewCode.replace(/console\.log\(/g, "console.debug(");
        break;
      case "Missing key props":
        // Add key props to simple map patterns
        previewCode = previewCode.replace(
          /(\w+)\.map\((\w+)\s*=>\s*<(\w+)([^>]*?)>/g,
          (match, array, item, tag, props) => {
            if (!props.includes("key=")) {
              return `${array}.map(${item} => <${tag} key={${item}.id || ${item}.name || \`${tag}-\${Math.random().toString(36).substr(2, 9)}\`}${props}>`;
            }
            return match;
          },
        );
        break;
      case "Accessibility issues":
        // Add basic alt attributes
        previewCode = previewCode.replace(
          /<img\s+src={([^}]+)}([^>]*?)>/g,
          (match, src, props) => {
            if (!props.includes("alt=")) {
              return `<img src={${src}} alt=""${props}>`;
            }
            return match;
          },
        );
        break;
      case "SSR safety":
        // Add SSR guards
        previewCode = previewCode.replace(
          /localStorage\.getItem\(/g,
          'typeof window !== "undefined" && localStorage.getItem(',
        );
        previewCode = previewCode.replace(
          /document\.(\w+)/g,
          'typeof document !== "undefined" && document.$1',
        );
        break;
      case "Missing use client for hooks":
        // Add use client directive if not present
        if (!previewCode.includes("'use client'")) {
          previewCode = "'use client';\n\n" + previewCode;
        }
        break;
      case "Missing accessibility attributes":
        // Add aria-label to buttons
        previewCode = previewCode.replace(
          /<button([^>]*?)>/g,
          (match, attributes) => {
            if (!attributes.includes("aria-label")) {
              return `<button${attributes} aria-label="Button">`;
            }
            return match;
          },
        );
        break;
    }
  });

  return previewCode;
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
  options = {},
) {
  // Try enhanced AST engine first if available and not explicitly disabled
  if (NeuroLintProEnhanced && options.useEnhancedAST !== false) {
    try {
      console.log(
        "[NEUROLINT PRO] Using enhanced AST engine with semantic analysis",
      );
      const enhancedOptions = {
        ...options,
        filename: filePath,
        dryRun,
        verbose: options.verbose || false,
      };
      return await NeuroLintProEnhanced(
        code,
        filePath,
        dryRun,
        requestedLayers,
        enhancedOptions,
      );
    } catch (error) {
      console.warn(
        "[NEUROLINT PRO] Enhanced AST engine failed, falling back to standard engine:",
        error.message,
      );
      // Continue with standard execution below
    }
  }

  console.log(
    "%c🧠 NEUROLINT PRO ENGINE STARTED (Standard Mode)",
    "color: #ff6b35; font-weight: bold; font-size: 18px; background: #000; padding: 4px;",
  );
  console.log(
    "%c==========================================",
    "color: #ff6b35; font-weight: bold;",
  );
  console.log(
    "%c📋 ENGINE CONFIGURATION",
    "color: #4fc3f7; font-weight: bold;",
  );
  console.log(`   📄 File: ${filePath}`);
  console.log(
    `   🔧 Mode: ${dryRun ? "🔍 Analysis Only (Demo)" : "⚡ Full Transform"}`,
  );
  console.log(
    `   🎯 Requested Layers: ${requestedLayers || "🌟 Auto-detect (All 6)"}`,
  );
  console.log(`   📊 Code Size: ${code.length} characters`);
  console.log(`   ⏱️ Start Time: ${new Date().toISOString()}`);
  console.log(`   ���� Engine Options:`, options);

  const startTime = performance.now();

  try {
    // Step 1: Smart Layer Selection (if layers not specified)
    let layersToExecute;
    let analysis;

    console.log(
      "%c🎯 LAYER SELECTION PROCESS",
      "color: #9c27b0; font-weight: bold;",
    );

    if (requestedLayers) {
      console.log("📌 Using Specific Layers:", requestedLayers);
      // Use provided layers but validate dependencies
      const validation =
        LayerDependencyManager.validateAndCorrectLayers(requestedLayers);
      layersToExecute = validation.correctedLayers;

      console.log("✅ Layer Validation Complete:");
      console.log("   - Original Requested:", requestedLayers);
      console.log("   - Final Corrected:", layersToExecute);

      if (validation.warnings.length > 0) {
        console.log(
          "%c⚠️  DEPENDENCY WARNINGS:",
          "color: #ff9800; font-weight: bold;",
        );
        validation.warnings.forEach((warning) => console.log(`   ${warning}`));
      }
    } else {
      console.log("🔍 Auto-detecting Required Layers...");
      // Auto-detect layers needed
      analysis = SmartLayerSelector.analyzeAndRecommend(code, filePath);
      layersToExecute = analysis.recommendedLayers;

      console.log(
        "%c🔍 SMART ANALYSIS RESULTS",
        "color: #4caf50; font-weight: bold;",
      );
      console.log(
        `   📊 Confidence: ${(analysis.confidence * 100).toFixed(1)}%`,
      );
      console.log(`   🎯 Impact Level: ${analysis.estimatedImpact.level}`);
      console.log(
        `   📝 Impact Description: ${analysis.estimatedImpact.description}`,
      );
      console.log(`   🌟 Recommended Layers: [${layersToExecute.join(", ")}]`);
      console.log(
        `   📋 Issues Detected: ${analysis.detectedIssues?.length || 0}`,
      );

      if (analysis.reasoning.length > 0) {
        console.log(
          "%c📋 ANALYSIS REASONING:",
          "color: #2196f3; font-weight: bold;",
        );
        analysis.reasoning.forEach((reason, index) =>
          console.log(`   ${index + 1}. ${reason}`),
        );
      }

      if (analysis.detectedIssues?.length > 0) {
        console.log(
          "%c🐛 DETECTED ISSUES:",
          "color: #f44336; font-weight: bold;",
        );
        analysis.detectedIssues.forEach((issue, index) =>
          console.log(
            `   ${index + 1}. [${issue.layer}] ${issue.type}: ${issue.description}`,
          ),
        );
      }
    }

    if (dryRun) {
      console.log("🔍 [DRY RUN] === DEMO MODE ANALYSIS ===");
      console.log(
        "🔍 [DRY RUN] Would execute layers:",
        layersToExecute.join(", "),
      );
      console.log("🔍 [DRY RUN] Analysis object:", analysis);
      console.log(
        "🔍 [DRY RUN] Detected issues:",
        analysis ? analysis.detectedIssues : "none",
      );
      console.log("🔍 [DRY RUN] Recommended layers:", layersToExecute);
      console.log(
        "🔍 [DRY RUN] Confidence:",
        analysis ? analysis.confidence : "no analysis",
      );

      // Generate a simulated transformation preview for demo purposes
      let simulatedTransformed = code;
      if (analysis && analysis.detectedIssues.length > 0) {
        console.log(
          "🔍 [DRY RUN] Generating simulated transformation preview...",
        );

        // Apply basic transformations to show what would be fixed
        simulatedTransformed = generateSimulatedFixes(
          code,
          analysis.detectedIssues,
        );
      }

      const dryRunResult = {
        dryRun: true,
        recommendedLayers: layersToExecute,
        analysis: analysis || null,
        estimatedChanges: analysis ? analysis.detectedIssues.length : 0,
        // Add demo-friendly properties that match what the frontend expects
        detectedIssues: analysis ? analysis.detectedIssues : [],
        confidence: analysis ? analysis.confidence : 0,
        demo: true,
        // Add before/after code for demo visualization
        originalCode: code,
        transformed: simulatedTransformed,
      };

      console.log(
        "🔍 [DRY RUN] Final response being returned to demo:",
        dryRunResult,
      );
      console.log("🔍 [DRY RUN] === END DEMO MODE ANALYSIS ===");

      return dryRunResult;
    }

    // Step 2: Execute Layers with Safe Pattern
    console.log(
      "%c🚀 LAYER EXECUTION PIPELINE",
      "color: #ff5722; font-weight: bold; font-size: 16px;",
    );
    console.log(`📋 Executing ${layersToExecute.length} layers in sequence...`);
    console.log(`🔧 Layer Execution Order: [${layersToExecute.join(" → ")}]`);

    const result = await executeLayers(code, layersToExecute, {
      verbose: options.verbose !== undefined ? options.verbose : true,
      onProgress: options.onProgress,
      isDemoMode: options.isDemoMode,
      singleFile: options.singleFile,
    });

    // Step 3: Generate Results
    const totalTime = performance.now() - startTime;

    console.log(
      "%c📊 TRANSFORMATION RESULTS",
      "color: #4caf50; font-weight: bold; font-size: 16px;",
    );
    console.log(`   ⏱️  Total Execution Time: ${totalTime.toFixed(0)}ms`);
    console.log(
      `   ✅ Successful Layers: ${result.successfulLayers}/${layersToExecute.length}`,
    );
    console.log(
      `   🔧 Total Changes Applied: ${result.results.reduce((sum, r) => sum + r.changeCount, 0)}`,
    );
    console.log(
      `   📏 Final Code Size: ${result.finalCode?.length || 0} characters`,
    );
    console.log(
      `   📈 Size Change: ${result.finalCode ? (result.finalCode.length - code.length > 0 ? "+" : "") + (result.finalCode.length - code.length) : 0} characters`,
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

// Export main function and utility functions
module.exports = NeuroLintPro;
module.exports.applyLayerTransformations = applyLayerTransformations;

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
      console.error("�� Execution failed:", error.message);
      process.exit(1);
    });
}
