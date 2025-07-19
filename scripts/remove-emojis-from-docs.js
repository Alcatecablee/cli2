#!/usr/bin/env node

/**
 * NeuroLint Pro - Documentation Emoji Removal Script
 *
 * Automatically scans and removes all emojis from documentation files
 * to maintain professional consistency across the docs.
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Comprehensive emoji regex pattern
const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{2328}]|[\u{23CF}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{24C2}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2B00}-\u{2BFF}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F171}]|[\u{1F17E}-\u{1F17F}]|[\u{1F18E}]|[\u{3030}]|[\u{2049}]|[\u{203C}]|[\u{2139}]|[\u{2122}]|[\u{2B50}]|[\u{2B55}]|[\u{00A9}]|[\u{00AE}]|[\u{FE0F}]/gu;

// Common emoji mappings to professional alternatives
const EMOJI_REPLACEMENTS = {
  // Tools and technical
  "🔧": "",
  "⚙️": "",
  "🛠️": "",
  "🔩": "",

  // Cleaning and organization
  "🧹": "",
  "🗂️": "",
  "📁": "",
  "📂": "",

  // React and components
  "⚛️": "",
  "🔄": "",
  "🔀": "",

  // Water/hydration
  "💧": "",
  "🌊": "",

  // Speed and performance
  "🚀": "",
  "⚡": "",
  "💨": "",

  // Security and safety
  "🛡️": "",
  "🔒": "",
  "🔐": "",
  "🔑": "",

  // Success and validation
  "✅": "",
  "✔️": "",
  "☑️": "",

  // Information and documentation
  "📝": "",
  "📄": "",
  "📋": "",
  "📊": "",
  "📈": "",
  "📉": "",

  // Arrows and navigation
  "➡️": "→",
  "⬅️": "←",
  "⬆️": "↑",
  "⬇️": "↓",
  "↗️": "↗",
  "↖️": "↖",
  "↘️": "↘",
  "↙️": "↙",

  // Warning and alerts
  "⚠️": "",
  "🚨": "",
  "❌": "",
  "⛔": "",

  // Checkmarks and status
  "🔍": "",
  "👀": "",
  "🎯": "",
  "🎪": "",

  // Numbers and counting
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

  // Hearts and emphasis
  "❤️": "",
  "💙": "",
  "💚": "",
  "💛": "",
  "🧡": "",
  "💜": "",
  "🖤": "",
  "🤍": "",
  "🤎": "",

  // Common symbols that might appear
  "📐": "",
  "🏗️": "",
  "🔧": "",
  "🎨": "",
  "🎮": "",
  "🎲": "",
  "🎯": "",
  "🎪": "",
  "🎭": "",
  "🎨": "",
  "🎬": "",
  "🎤": "",
  "🎧": "",
  "🎵": "",
  "🎶": "",
  "🎼": "",
  "🥇": "",
  "🥈": "",
  "🥉": "",
  "🏆": "",
  "🏅": "",
  "🎖️": "",
  "🎗️": "",
  "🎫": "",
  "🎟️": "",
  "🎪": "",

  // Additional cleanup for common patterns
  "🚀": "",
  "⭐": "",
  "🌟": "",
  "💡": "",
  "🔥": "",
  "💪": "",
  "👍": "",
  "👎": "",
  "👌": "",
  "✋": "",
  "🤝": "",
  "🙏": "",
  "👏": "",
  "🎉": "",
  "🎊": "",
  "🎁": "",
  "🎈": "",
  "🎂": "",
  "🍰": "",
};

// Statistics tracking
let stats = {
  filesScanned: 0,
  filesModified: 0,
  emojisRemoved: 0,
  patterns: new Set(),
};

/**
 * Clean emoji from text content
 */
function cleanEmojis(content) {
  let cleanedContent = content;
  let removedCount = 0;

  // First, handle specific emoji replacements
  for (const [emoji, replacement] of Object.entries(EMOJI_REPLACEMENTS)) {
    const regex = new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    const matches = cleanedContent.match(regex);
    if (matches) {
      cleanedContent = cleanedContent.replace(regex, replacement);
      removedCount += matches.length;
      stats.patterns.add(emoji);
    }
  }

  // Then remove any remaining emojis with the comprehensive regex
  const remainingEmojis = cleanedContent.match(EMOJI_REGEX);
  if (remainingEmojis) {
    remainingEmojis.forEach((emoji) => stats.patterns.add(emoji));
    cleanedContent = cleanedContent.replace(EMOJI_REGEX, "");
    removedCount += remainingEmojis.length;
  }

  // Clean up multiple spaces that might be left behind
  cleanedContent = cleanedContent.replace(/\s{3,}/g, "  ");

  return { content: cleanedContent, removed: removedCount };
}

/**
 * Process a single documentation file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { content: cleanedContent, removed } = cleanEmojis(content);

    stats.filesScanned++;

    if (removed > 0) {
      fs.writeFileSync(filePath, cleanedContent, "utf8");
      stats.filesModified++;
      stats.emojisRemoved += removed;

      console.log(`✓ ${filePath}: Removed ${removed} emoji(s)`);
    } else {
      console.log(`- ${filePath}: No emojis found`);
    }

    return removed > 0;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution function
 */
function main() {
  console.log("🧹 NeuroLint Pro - Documentation Emoji Removal");
  console.log("================================================\n");

  // Find all documentation files
  const docsPattern = "app/docs/**/*.{tsx,ts,jsx,js,md,mdx}";
  const files = glob.sync(docsPattern, {
    ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  });

  if (files.length === 0) {
    console.log("No documentation files found.");
    return;
  }

  console.log(`Found ${files.length} documentation files to scan...\n`);

  // Process each file
  files.forEach(processFile);

  // Print summary
  console.log("\n================================================");
  console.log("📊 SUMMARY:");
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Total emojis removed: ${stats.emojisRemoved}`);

  if (stats.patterns.size > 0) {
    console.log(
      `\nEmoji patterns found: ${Array.from(stats.patterns).join(" ")}`,
    );
  }

  if (stats.filesModified > 0) {
    console.log("\n✅ Documentation emoji cleanup complete!");
    console.log("All files now maintain professional consistency.");
  } else {
    console.log("\n✨ No emojis found - documentation is already clean!");
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { cleanEmojis, processFile, EMOJI_REGEX, EMOJI_REPLACEMENTS };
