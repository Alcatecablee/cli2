// Comprehensive HTML Entity Fix for NeuroLint Pro
// This file contains the updated patterns to fix all HTML entities

// 1. Detection patterns (for analysis)
const htmlEntityDetectionPatterns = [
  { pattern: /&quot;/g, name: "HTML quote entities" },
  { pattern: /&amp;/g, name: "HTML ampersand entities" },
  { pattern: /&lt;|&gt;/g, name: "HTML bracket entities" },
  { pattern: /&copy;/g, name: "HTML copyright entities" },
  { pattern: /&ndash;|&mdash;/g, name: "HTML dash entities" },
  { pattern: /&#36;|&amp;#36;/g, name: "HTML dollar sign entities" },
  { pattern: /&nbsp;/g, name: "HTML non-breaking space entities" },
  {
    pattern: /&sect;|&para;|&bull;|&deg;|&trade;/g,
    name: "HTML special character entities",
  },
];

// 2. Replacement patterns (for fixing)
const htmlEntityReplacements = [
  { from: /&quot;/g, to: '"', name: "quotes" },
  { from: /&amp;/g, to: "&", name: "ampersands" },
  { from: /&lt;/g, to: "<", name: "less-than" },
  { from: /&gt;/g, to: ">", name: "greater-than" },
  { from: /&copy;/g, to: "©", name: "copyright" },
  { from: /&ndash;/g, to: "–", name: "en-dash" },
  { from: /&mdash;/g, to: "—", name: "em-dash" },
  { from: /&#36;/g, to: "$", name: "dollar-sign-numeric" },
  { from: /&amp;#36;/g, to: "$", name: "dollar-sign-encoded" },
  { from: /&nbsp;/g, to: " ", name: "non-breaking-space" },
  { from: /&sect;/g, to: "§", name: "section-sign" },
  { from: /&para;/g, to: "¶", name: "paragraph-sign" },
  { from: /&bull;/g, to: "•", name: "bullet" },
  { from: /&deg;/g, to: "°", name: "degree-sign" },
  { from: /&trade;/g, to: "™", name: "trademark" },
];

// 3. Test with your sample code
const testCode = `Hello &amp; Welcome!
     
This is a &quot;test&quot; component with &lt;HTML&gt; entities.
      
Price: &amp;#36;99.99 €85.50
     
Copyright &copy; 2024 &ndash; All rights reserved.
       setCount(count + 1)}&gt;
        Count: {count}   Click me!
    
        Special chars: &sect; &para; &bull; &deg; &trade;`;

// Function to apply all HTML entity fixes
function fixHtmlEntities(code) {
  let fixedCode = code;
  const appliedFixes = [];

  htmlEntityReplacements.forEach(({ from, to, name }) => {
    if (
      fixedCode.includes(
        from.source.replace(/\\\//g, "/").replace(/\\\|/g, "|"),
      )
    ) {
      const before = fixedCode;
      fixedCode = fixedCode.replace(from, to);
      if (before !== fixedCode) {
        appliedFixes.push(`HTML Entity: Converted ${name}`);
      }
    }
  });

  return { code: fixedCode, fixes: appliedFixes };
}

// Test the fix
const result = fixHtmlEntities(testCode);
console.log("ORIGINAL:");
console.log(testCode);
console.log("\nFIXED:");
console.log(result.code);
console.log("\nAPPLIED FIXES:");
result.fixes.forEach((fix) => console.log(`- ${fix}`));

module.exports = {
  htmlEntityDetectionPatterns,
  htmlEntityReplacements,
  fixHtmlEntities,
};
