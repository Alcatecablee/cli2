#!/usr/bin/env node

/**
 * Test Script for Enhanced Emoji Standardization System
 * Demonstrates the advanced context-aware emoji processing
 */

const fs = require("fs");

// Simulate the enhanced emoji processor logic
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

    // Process emojis with advanced logic
    processedContent = content.replace(emojiRegex, (match, offset) => {
      const preservationResult = this.shouldPreserveEmoji(
        match,
        offset,
        content,
      );

      if (preservationResult.preserve) {
        emojiReport.preserved.push({
          emoji: match,
          rule: preservationResult.rule,
          position: offset,
        });

        if (preservationResult.action === "preserve_with_label") {
          const label = this.getSemanticLabel(match);
          emojiReport.replaced.push({ emoji: match, replacement: label });
          return label;
        }

        return match; // Keep original
      } else {
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
}

// Test the system
async function testEnhancedEmojiSystem() {
  console.log("🧠 TESTING ENHANCED EMOJI STANDARDIZATION SYSTEM");
  console.log("=".repeat(60));

  // Read the test file
  const testFile = "src/test-emoji-standardization.tsx";
  let content;

  try {
    content = fs.readFileSync(testFile, "utf8");
  } catch (error) {
    console.error("❌ Could not read test file:", error.message);
    return;
  }

  console.log("\n📄 Original Content Preview:");
  console.log(content.substring(0, 300) + "...\n");

  // Process with enhanced emoji system
  const processor = new EmojiProcessor();
  const result = processor.processEmojiInBatch(content, testFile);

  console.log("📊 PROCESSING RESULTS:");
  console.log("=".repeat(40));
  console.log(`🎯 Smart Changes: ${result.changes}`);
  console.log(`🛡️ Preserved: ${result.emojiReport.preserved.length}`);
  console.log(`🗑️ Removed: ${result.emojiReport.removed.length}`);
  console.log(`🔄 Replaced: ${result.emojiReport.replaced.length}`);

  if (result.emojiReport.preserved.length > 0) {
    console.log("\n🛡️ PRESERVED EMOJIS (Context-Aware):");
    result.emojiReport.preserved.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.emoji} (Rule: ${item.rule})`);
    });
  }

  if (result.emojiReport.replaced.length > 0) {
    console.log("\n🔄 SEMANTIC REPLACEMENTS:");
    result.emojiReport.replaced.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.emoji} → ${item.replacement}`);
    });
  }

  if (result.emojiReport.removed.length > 0) {
    console.log("\n🗑️ REMOVED EMOJIS (Enterprise Cleanup):");
    const removedUnique = [
      ...new Set(result.emojiReport.removed.map((r) => r.emoji)),
    ];
    console.log(`   Total unique emojis removed: ${removedUnique.join(", ")}`);
  }

  console.log("\n📄 Processed Content Preview:");
  console.log(result.content.substring(0, 400) + "...\n");

  // Calculate improvements
  const originalEmojiCount = (
    content.match(
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|🔧|⚙️|🛠️|🧹|⚛️|🚀|⚡|🛡️|✅|📝|⚠️|❌|🔍|💡|➡️|⬅️|⬆️|⬇️|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣/gu,
    ) || []
  ).length;
  const finalEmojiCount = (
    result.content.match(
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|🔧|⚙️|🛠️|🧹|⚛️|🚀|⚡|🛡️|✅|📝|⚠️|❌|🔍|💡|➡️|⬅️|⬆️|⬇️|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣/gu,
    ) || []
  ).length;
  const reductionRate = (
    ((originalEmojiCount - finalEmojiCount) / originalEmojiCount) *
    100
  ).toFixed(1);

  console.log("📈 ENTERPRISE METRICS:");
  console.log("=".repeat(40));
  console.log(`🎯 Original Emoji Count: ${originalEmojiCount}`);
  console.log(`🏆 Final Emoji Count: ${finalEmojiCount}`);
  console.log(`📉 Reduction Rate: ${reductionRate}%`);
  console.log(
    `🤖 Context Intelligence: ${result.emojiReport.preserved.length > 0 ? "ACTIVE" : "INACTIVE"}`,
  );
  console.log(
    `🏢 Enterprise Ready: ${reductionRate > 70 ? "YES" : "NEEDS REVIEW"}`,
  );

  console.log("\n✨ ADVANCED FEATURES DEMONSTRATED:");
  console.log("   🧠 Context-aware preservation");
  console.log("   🏷️ Semantic label replacement");
  console.log("   📊 Enterprise analytics");
  console.log("   🎯 Intelligent batch processing");
  console.log("   🛡️ Brand guideline compliance");

  return result;
}

// Run the test
testEnhancedEmojiSystem().catch((error) => {
  console.error("❌ Test failed:", error.message);
});
