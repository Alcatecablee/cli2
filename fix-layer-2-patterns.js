#!/usr/bin/env node

/**
 * Layer 2: Content & Pattern Standardization
 * - Remove unused imports
 * - Fix type assertions
 * - Fix HTML entity corruption
 * - Standardize quote usage
 * - Fix common React patterns
 * - Professional content standardization (emoji removal)
 * - Arrow and symbol standardization
 * - Enterprise code consistency
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

console.log("Layer 2: Content & Pattern Standardization");

// Pattern definitions for bulk fixes
const patterns = [
  // Fix HTML entity corruption
  {
    name: "HTML Entity Quotes",
    pattern: /&quot;/g,
    replacement: '"',
    fileTypes: ["ts", "tsx", "js", "jsx"],
  },
  {
    name: "HTML Entity Apostrophes",
    pattern: /&#x27;/g,
    replacement: "'",
    fileTypes: ["ts", "tsx", "js", "jsx"],
  },
  {
    name: "HTML Entity Ampersands",
    pattern: /&amp;/g,
    replacement: "&",
    fileTypes: ["ts", "tsx", "js", "jsx"],
  },

  // Fix common TypeScript issues
  {
    name: "Any Type Assertions",
    pattern: /as any\b/g,
    replacement: "// @ts-ignore\n",
    fileTypes: ["ts", "tsx"],
  },

  // Fix React patterns
  {
    name: "React Fragment Shorthand",
    pattern: /<React\.Fragment>/g,
    replacement: "<>",
    fileTypes: ["tsx", "jsx"],
  },
  {
    name: "React Fragment Shorthand Close",
    pattern: /<\/React\.Fragment>/g,
    replacement: "</>",
    fileTypes: ["tsx", "jsx"],
  },

  // Fix import patterns
  {
    name: "Default React Import",
    pattern: /import React, \{ /g,
    replacement: "import { ",
    fileTypes: ["tsx", "jsx"],
  },

  // Fix console statements for production
  {
    name: "Console Log to Debug",
    pattern: /console\.log\(/g,
    replacement: "console.debug(",
    fileTypes: ["ts", "tsx", "js", "jsx"],
  },

  // Fix common CSS-in-JS patterns
  {
    name: "Style Object Quotes",
    pattern: /style=\{\{([^}]+)\}\}/g,
    replacement: (match, content) => {
      // Convert camelCase to kebab-case for CSS properties
      const fixed = content.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `style={{${fixed}}}`;
    },
    fileTypes: ["tsx", "jsx"],
  },

  // ===== PROFESSIONAL CONTENT STANDARDIZATION =====
  // Advanced Context-Aware Emoji Standardization System
  // Implements semantic mapping, contextual preservation, and enterprise reporting

  // Smart Semantic Replacement - Replace with meaningful professional text
  {
    name: "Technical Tool Emojis",
    pattern: /🔧|⚙️|🛠️|🔩/g,
    replacement: (match, offset, string) => {
      // Context-aware replacement: preserve in documentation titles
      const beforeText = string.substring(Math.max(0, offset - 20), offset);
      const afterText = string.substring(offset, offset + 20);

      // Preserve in markdown headers or JSDoc comments
      if (/#{1,6}\s*$/.test(beforeText) || /\/\*\*[^*]*$/.test(beforeText)) {
        return "[Tool]"; // Professional placeholder
      }

      // In code comments, replace with descriptive text
      if (/\/\/\s*$/.test(beforeText) || /\/\*[^*]*$/.test(beforeText)) {
        return "CONFIG:"; // Clear context indicator
      }

      return ""; // Remove elsewhere
    },
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Cleaning Organization Emojis",
    pattern: /🧹|🗂️|📁|📂/g,
    replacement: "",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "React Component Emojis",
    pattern: /⚛️|🔄|🔀/g,
    replacement: (match, offset, string) => {
      const contextMap = {
        "⚛️": "[React]",
        "🔄": "[Refresh]",
        "🔀": "[Switch]",
      };

      const beforeText = string.substring(Math.max(0, offset - 15), offset);

      // In documentation or comments, use professional labels
      if (
        /#{1,6}\s*$/.test(beforeText) ||
        /\/\*\*?[^*]*$/.test(beforeText) ||
        /\/\/\s*$/.test(beforeText)
      ) {
        return contextMap[match] || "";
      }

      return ""; // Remove from code
    },
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Performance Speed Emojis",
    pattern: /🚀|⚡|💨/g,
    replacement: (match, offset, string) => {
      const performanceMap = {
        "🚀": "[Fast]",
        "⚡": "[Optimized]",
        "💨": "[Quick]",
      };

      const beforeText = string.substring(Math.max(0, offset - 20), offset);

      // Smart context detection
      if (/\b(performance|speed|optimization|fast)\b/i.test(beforeText)) {
        return " (" + performanceMap[match].slice(1, -1).toLowerCase() + ")"; // Convert to lowercase in context
      }

      if (/#{1,6}\s*$/.test(beforeText) || /\/\*\*?[^*]*$/.test(beforeText)) {
        return performanceMap[match];
      }

      return "";
    },
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Security Safety Emojis",
    pattern: /🛡️|🔒|🔐|🔑/g,
    replacement: "",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Success Validation Emojis",
    pattern: /✅|✔️|☑️/g,
    replacement: "",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Documentation Emojis",
    pattern: /📝|📄|📋|📊|📈|📉/g,
    replacement: "",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Warning Alert Emojis",
    pattern: /⚠️|🚨|❌|⛔/g,
    replacement: "",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Comprehensive Emoji Cleanup",
    pattern:
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{2328}]|[\u{23CF}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{24C2}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2B00}-\u{2BFF}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F171}]|[\u{1F17E}-\u{1F17F}]|[\u{1F18E}]|[\u{3030}]|[\u{2049}]|[\u{203C}]|[\u{2139}]|[\u{2122}]|[\u{2B50}]|[\u{2B55}]|[\u{00A9}]|[\u{00AE}]|[\u{FE0F}]/gu,
    replacement: "",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },

  // Smart Arrow standardization (convert to clean Unicode)
  {
    name: "Right Arrow Standardization",
    pattern: /➡️|→/g,
    replacement: "→",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Left Arrow Standardization",
    pattern: /⬅️|←/g,
    replacement: "←",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Up Arrow Standardization",
    pattern: /⬆️|↑/g,
    replacement: "↑",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
  {
    name: "Down Arrow Standardization",
    pattern: /⬇️|↓/g,
    replacement: "↓",
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },

  // Number emoji standardization
  {
    name: "Number Emoji to Text",
    pattern: /1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|0️⃣/g,
    replacement: (match) => {
      const map = {
        "1️⃣": "1",
        "2️⃣": "2",
        "3️⃣": "3",
        "4️⃣": "4",
        "5️⃣": "5",
        "6️⃣": "6",
        "7️⃣": "7",
        "8️⃣": "8",
        "9️⃣": "9",
        "0️⃣": "0",
      };
      return map[match] || match;
    },
    fileTypes: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
];

// Advanced pattern fixes
const advancedPatterns = [
  // Remove unused imports (basic detection)
  {
    name: "Unused React Import",
    test: (content) =>
      !content.includes("React.") &&
      !content.includes("<") &&
      content.includes("import React from 'react'"),
    fix: (content) =>
      content.replace(/import React from ['"]react['"];\n?/g, ""),
    fileTypes: ["tsx", "jsx"],
  },

  // Fix component prop destructuring
  {
    name: "Component Props Interface",
    test: (content) =>
      content.includes("function ") &&
      content.includes("props:") &&
      !content.includes("interface"),
    fix: (content) => {
      // Add interface definitions for component props
      return content.replace(
        /function (\w+)\(props: ([^)]+)\)/g,
        "interface $2Props {\n  // Add prop definitions here\n}\n\nfunction $1(props: $2Props)",
      );
    },
    fileTypes: ["tsx"],
  },
];

// ===== ENTERPRISE EMOJI ANALYTICS =====
// Advanced emoji tracking and reporting system
class EmojiAnalytics {
  constructor() {
    this.stats = {
      totalEmojisFound: 0,
      totalEmojisRemoved: 0,
      totalEmojisPreserved: 0,
      emojisByCategory: {},
      filesByEmojiDensity: [],
      contextualReplacements: 0,
      semanticMappings: {},
    };
  }

  recordEmoji(emoji, action, context, filePath) {
    this.stats.totalEmojisFound++;

    if (action === "removed") {
      this.stats.totalEmojisRemoved++;
    } else if (action === "preserved") {
      this.stats.totalEmojisPreserved++;
    } else if (action === "replaced") {
      this.stats.contextualReplacements++;
    }

    // Track semantic mappings
    if (action === "replaced" && context.replacement) {
      if (!this.stats.semanticMappings[emoji]) {
        this.stats.semanticMappings[emoji] = {};
      }
      this.stats.semanticMappings[emoji][context.replacement] =
        (this.stats.semanticMappings[emoji][context.replacement] || 0) + 1;
    }
  }

  calculateEmojiDensity(content, filePath) {
    const emojiCount = (
      content.match(
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/gu,
      ) || []
    ).length;
    const density = (emojiCount / content.length) * 1000; // Emojis per 1000 characters

    this.stats.filesByEmojiDensity.push({
      file: filePath,
      density: density,
      count: emojiCount,
      size: content.length,
    });

    return density;
  }

  generateReport() {
    const report = {
      summary: {
        totalFiles: this.stats.filesByEmojiDensity.length,
        totalEmojis: this.stats.totalEmojisFound,
        removalRate:
          this.stats.totalEmojisFound > 0
            ? (
                (this.stats.totalEmojisRemoved / this.stats.totalEmojisFound) *
                100
              ).toFixed(1) + "%"
            : "0%",
        preservationRate:
          this.stats.totalEmojisFound > 0
            ? (
                (this.stats.totalEmojisPreserved /
                  this.stats.totalEmojisFound) *
                100
              ).toFixed(1) + "%"
            : "0%",
        contextualReplacements: this.stats.contextualReplacements,
      },
      topEmojiDensityFiles: this.stats.filesByEmojiDensity
        .sort((a, b) => b.density - a.density)
        .slice(0, 5),
      semanticMappings: this.stats.semanticMappings,
      recommendations: this.generateRecommendations(),
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    const highDensityFiles = this.stats.filesByEmojiDensity.filter(
      (f) => f.density > 5,
    );
    if (highDensityFiles.length > 0) {
      recommendations.push({
        type: "High Emoji Density",
        severity: "medium",
        description: `${highDensityFiles.length} files have high emoji density (>5 per 1000 chars)`,
        action: "Consider manual review for contextual emoji usage",
      });
    }

    if (this.stats.totalEmojisPreserved > this.stats.totalEmojisRemoved) {
      recommendations.push({
        type: "Preservation Rate",
        severity: "info",
        description: "More emojis were preserved than removed",
        action: "Review preservation logic for enterprise compliance",
      });
    }

    return recommendations;
  }
}

// Global analytics instance
const emojiAnalytics = new EmojiAnalytics();

// Get all relevant files
function getFiles(extensions) {
  const patterns = extensions.map((ext) => `src/**/*.${ext}`);
  let files = [];

  patterns.forEach((pattern) => {
    files = files.concat(glob.sync(pattern));
  });

  return [...new Set(files)]; // Remove duplicates
}

// ===== INTELLIGENT EMOJI PROCESSING =====
// Smart preservation and context-aware processing
class EmojiProcessor {
  constructor() {
    this.preservationRules = [
      {
        name: "Documentation Headers",
        test: (context) => /#{1,6}\s+[^\n]*$/m.test(context.before),
        action: "preserve_with_label",
      },
      {
        name: "JSDoc Comments",
        test: (context) => /\/\*\*[^*]*\*\/\s*$/m.test(context.before),
        action: "preserve_with_label",
      },
      {
        name: "Brand Guidelines Comments",
        test: (context) =>
          /\b(brand|style\s*guide|design\s*system)\b/i.test(
            context.surrounding,
          ),
        action: "preserve",
      },
      {
        name: "Test Descriptions",
        test: (context) => /\b(describe|it|test)\s*\(["']/.test(context.before),
        action: "preserve",
      },
      {
        name: "User-Facing Strings",
        test: (context) => {
          const userFacingIndicators =
            /\b(placeholder|label|title|aria-label|alt)\s*[:=]/i;
          return userFacingIndicators.test(context.surrounding);
        },
        action: "preserve",
      },
    ];
  }

  shouldPreserveEmoji(emoji, offset, fullText) {
    const context = {
      before: fullText.substring(Math.max(0, offset - 50), offset),
      after: fullText.substring(offset, Math.min(fullText.length, offset + 50)),
      surrounding: fullText.substring(
        Math.max(0, offset - 100),
        Math.min(fullText.length, offset + 100),
      ),
    };

    for (const rule of this.preservationRules) {
      if (rule.test(context)) {
        return {
          preserve: true,
          rule: rule.name,
          action: rule.action,
        };
      }
    }

    return { preserve: false };
  }

  processEmojiInBatch(content, filePath) {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|🔧|⚙️|🛠️|🧹|⚛️|🚀|⚡|🛡️|✅|📝|⚠️|❌|🔍|💡|➡️|⬅️|⬆️|⬇️|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣/gu;

    let processedContent = content;
    let totalChanges = 0;
    const emojiReport = {
      preserved: [],
      removed: [],
      replaced: [],
    };

    // Calculate initial emoji density
    emojiAnalytics.calculateEmojiDensity(content, filePath);

    // Process emojis with advanced logic
    processedContent = content.replace(emojiRegex, (match, offset) => {
      const preservationResult = this.shouldPreserveEmoji(
        match,
        offset,
        content,
      );

      if (preservationResult.preserve) {
        emojiAnalytics.recordEmoji(
          match,
          "preserved",
          preservationResult,
          filePath,
        );
        emojiReport.preserved.push({
          emoji: match,
          rule: preservationResult.rule,
          position: offset,
        });

        if (preservationResult.action === "preserve_with_label") {
          const label = this.getSemanticLabel(match);
          emojiAnalytics.recordEmoji(
            match,
            "replaced",
            { replacement: label },
            filePath,
          );
          emojiReport.replaced.push({ emoji: match, replacement: label });
          return label;
        }

        return match; // Keep original
      } else {
        emojiAnalytics.recordEmoji(match, "removed", {}, filePath);
        emojiReport.removed.push({ emoji: match, position: offset });
        totalChanges++;
        return ""; // Remove
      }
    });

    return {
      content: processedContent,
      changes: totalChanges,
      emojiReport,
    };
  }

  getSemanticLabel(emoji) {
    const semanticMap = {
      "🔧": "[Configuration]",
      "⚙️": "[Settings]",
      "🛠️": "[Tools]",
      "🧹": "[Cleanup]",
      "⚛️": "[React]",
      "🚀": "[Performance]",
      "⚡": "[Fast]",
      "🛡️": "[Security]",
      "✅": "[Success]",
      "📝": "[Documentation]",
      "⚠️": "[Warning]",
      "❌": "[Error]",
      "🔍": "[Search]",
      "💡": "[Tip]",
      "➡️": "→",
      "⬅️": "←",
      "⬆️": "↑",
      "⬇️": "↓",
      "1️⃣": "1",
      "2️⃣": "2",
      "3️⃣": "3",
      "4️⃣": "4",
      "5️⃣": "5",
      "6️⃣": "6",
    };

    return semanticMap[emoji] || "[Symbol]";
  }
}

// Global processor instance
const emojiProcessor = new EmojiProcessor();

// Apply pattern fixes to a file
function applyPatternFixes(filePath, content) {
  let fixedContent = content;
  let changesCount = 0;
  const fileExt = path.extname(filePath).slice(1);

  // First, apply intelligent emoji processing
  const emojiResult = emojiProcessor.processEmojiInBatch(content, filePath);
  fixedContent = emojiResult.content;
  changesCount += emojiResult.changes;

  if (emojiResult.changes > 0) {
    console.log(`  🎯 Smart Emoji Processing: ${emojiResult.changes} changes`);
    console.log(
      `    📊 Preserved: ${emojiResult.emojiReport.preserved.length}`,
    );
    console.log(`    🗑️ Removed: ${emojiResult.emojiReport.removed.length}`);
    console.log(`    🔄 Replaced: ${emojiResult.emojiReport.replaced.length}`);
  }

  // Apply remaining pattern replacements (skip emoji patterns as they're handled above)
  patterns.forEach((pattern) => {
    // Skip emoji-related patterns as they're handled by the smart processor
    if (
      pattern.name.includes("Emoji") ||
      pattern.name.includes("Arrow") ||
      pattern.name.includes("Number")
    ) {
      return;
    }

    if (pattern.fileTypes.includes(fileExt)) {
      const before = fixedContent;

      if (typeof pattern.replacement === "function") {
        fixedContent = fixedContent.replace(
          pattern.pattern,
          pattern.replacement,
        );
      } else {
        fixedContent = fixedContent.replace(
          pattern.pattern,
          pattern.replacement,
        );
      }

      if (before !== fixedContent) {
        changesCount++;
        console.log(`  ✓ Applied ${pattern.name}`);
      }
    }
  });

  // Apply advanced pattern fixes
  advancedPatterns.forEach((pattern) => {
    if (pattern.fileTypes.includes(fileExt) && pattern.test(fixedContent)) {
      const before = fixedContent;
      fixedContent = pattern.fix(fixedContent);

      if (before !== fixedContent) {
        changesCount++;
        console.log(`  ✓ Applied ${pattern.name}`);
      }
    }
  });

  return { content: fixedContent, changes: changesCount };
}

// Remove unused imports more intelligently
function removeUnusedImports(content) {
  const lines = content.split("\n");
  const importLines = [];
  const codeLines = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith("import ")) {
      importLines.push({ line, index });
    } else {
      codeLines.push(line);
    }
  });

  const codeContent = codeLines.join("\n");
  const usedImports = [];

  importLines.forEach(({ line }) => {
    // Extract imported names
    const importMatch = line.match(
      /import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))/,
    );
    if (importMatch) {
      const [, namedImports, namespaceImport, defaultImport] = importMatch;

      let isUsed = false;

      if (namedImports) {
        // Check named imports
        const names = namedImports
          .split(",")
          .map((name) => name.trim().split(" as ")[0]);
        isUsed = names.some((name) => codeContent.includes(name));
      } else if (namespaceImport) {
        // Check namespace import
        isUsed = codeContent.includes(namespaceImport);
      } else if (defaultImport) {
        // Check default import
        isUsed = codeContent.includes(defaultImport);
      }

      if (isUsed) {
        usedImports.push(line);
      }
    } else {
      // Keep imports we can't parse
      usedImports.push(line);
    }
  });

  return [...usedImports, "", ...codeLines].join("\n");
}

// Main execution
async function runLayer2Fixes() {
  const files = getFiles(["ts", "tsx", "js", "jsx"]);
  let totalChanges = 0;
  let filesChanged = 0;

  console.log(`📁 Processing ${files.length} files...`);

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const { content: fixedContent, changes } = applyPatternFixes(
        filePath,
        content,
      );

      // Apply unused import removal
      const finalContent = removeUnusedImports(fixedContent);
      const hasUnusedImportChanges = finalContent !== fixedContent;

      if (changes > 0 || hasUnusedImportChanges) {
        fs.writeFileSync(filePath, finalContent);
        filesChanged++;
        totalChanges += changes + (hasUnusedImportChanges ? 1 : 0);
        console.log(
          `📝 ${filePath}: ${changes + (hasUnusedImportChanges ? 1 : 0)} fixes applied`,
        );

        if (hasUnusedImportChanges) {
          console.log(`  ✓ Removed unused imports`);
        }
      }
    } catch (error) {
      console.error(`��� Error processing ${filePath}:`, error.message);
    }
  }

  console.log(
    `\n🎉 Layer 2 completed: ${totalChanges} fixes applied to ${filesChanged} files`,
  );
}

// Check if glob is available, if not provide fallback
try {
  require("glob");
} catch (error) {
  console.log("📦 Installing glob dependency...");
  require("child_process").execSync("npm install glob --save-dev", {
    stdio: "inherit",
  });
}

runLayer2Fixes().catch((error) => {
  console.error("❌ Layer 2 fixes failed:", error.message);
  process.exit(1);
});
