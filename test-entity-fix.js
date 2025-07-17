// Quick test of HTML entity patterns
const testCode = `Hello &amp; Welcome!
This is a &quot;test&quot; component with &lt;HTML&gt; entities.
Price: &amp;#36;99.99
Copyright &copy; 2024 &ndash; All rights reserved.
Special chars: &sect; &para; &bull; &deg; &trade;`;

// Updated entity replacements
const entities = [
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

console.log("ORIGINAL:");
console.log(testCode);
console.log("\nFIXED:");

let fixedCode = testCode;
entities.forEach(({ from, to, name }) => {
  const before = fixedCode;
  fixedCode = fixedCode.replace(from, to);
  if (before !== fixedCode) {
    console.log(`Applied fix: ${name}`);
  }
});

console.log(fixedCode);
