"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Layer2PatternsPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "examples" | "performance" | "cli"
  >("overview");

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">📚 Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#layer-reference">🔧 Layer Reference</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            Layer 2: Pattern Fixes
          </span>
        </div>

        <h1 className="docs-page-title">🧹 Layer 2: Pattern Fixes</h1>
        <p className="docs-page-subtitle">
          HTML entity cleanup, import optimization, and legacy pattern
          modernization
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">⏱️ 10 min read</span>
          <span className="docs-meta-item difficulty-intermediate">
            🟡 Intermediate
          </span>
          <span className="docs-meta-item layer-badge">🧹 Cleanup Layer</span>
          <span className="docs-meta-item">📝 Last updated: Dec 2024</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="docs-tab-nav">
        <button
          className={`docs-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📋 Overview
        </button>
        <button
          className={`docs-tab ${activeTab === "examples" ? "active" : ""}`}
          onClick={() => setActiveTab("examples")}
        >
          📝 Examples
        </button>
        <button
          className={`docs-tab ${activeTab === "performance" ? "active" : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          ⚡ Performance
        </button>
        <button
          className={`docs-tab ${activeTab === "cli" ? "active" : ""}`}
          onClick={() => setActiveTab("cli")}
        >
          💻 CLI Usage
        </button>
      </div>

      <div className="docs-page-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Quick Summary */}
            <div className="docs-highlight-box info">
              <h3>🎯 Layer 2 Purpose</h3>
              <p>
                Layer 2 performs <strong>bulk pattern cleanup</strong> across
                your codebase. It fixes HTML entity corruption, removes unused
                imports, modernizes legacy patterns, and prepares your code for
                the more sophisticated component-level transformations in Layer
                3.
              </p>
            </div>

            {/* What It Fixes */}
            <div className="docs-section">
              <h2 id="what-it-fixes">🧹 What Layer 2 Fixes</h2>

              <div className="docs-fix-categories">
                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🔤</div>
                  <h3>HTML Entity Corruption</h3>
                  <ul>
                    <li>
                      <strong>&amp;quot; fixes:</strong> Converts{" "}
                      <code>&amp;quot;</code> back to proper quotes
                    </li>
                    <li>
                      <strong>&amp;amp; fixes:</strong> Converts{" "}
                      <code>&amp;amp;</code> back to <code>&amp;</code>
                    </li>
                    <li>
                      <strong>&amp;lt;/&amp;gt; fixes:</strong> Converts{" "}
                      <code>&amp;lt;</code> and <code>&amp;gt;</code> back to
                      proper brackets
                    </li>
                    <li>
                      <strong>&#x27; fixes:</strong> Converts{" "}
                      <code>&#x27;</code> back to single quotes
                    </li>
                    <li>
                      <strong>Complex entity chains:</strong> Fixes
                      double-encoded entities like <code>&amp;amp;quot;</code>
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">📦</div>
                  <h3>Import Cleanup</h3>
                  <ul>
                    <li>
                      <strong>Unused import removal:</strong> Intelligently
                      removes imports that aren't used
                    </li>
                    <li>
                      <strong>Duplicate import consolidation:</strong> Merges
                      multiple imports from same module
                    </li>
                    <li>
                      <strong>Empty import cleanup:</strong> Removes import
                      statements with empty destructuring
                    </li>
                    <li>
                      <strong>Side-effect preservation:</strong> Keeps imports
                      needed for side effects
                    </li>
                    <li>
                      <strong>Type-only import optimization:</strong> Converts
                      to <code>import type</code> where appropriate
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🔄</div>
                  <h3>Legacy Pattern Updates</h3>
                  <ul>
                    <li>
                      <strong>React.Fragment:</strong> Converts{" "}
                      <code>&lt;React.Fragment&gt;</code> to{" "}
                      <code>&lt;&gt;</code>
                    </li>
                    <li>
                      <strong>console.log removal:</strong> Converts to{" "}
                      <code>console.debug</code> or removes entirely
                    </li>
                    <li>
                      <strong>var declarations:</strong> Updates{" "}
                      <code>var</code> to <code>let</code> or <code>const</code>
                    </li>
                    <li>
                      <strong>Function expressions:</strong> Modernizes to arrow
                      functions where appropriate
                    </li>
                    <li>
                      <strong>String concatenation:</strong> Updates to template
                      literals
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🎨</div>
                  <h3>Code Style Normalization</h3>
                  <ul>
                    <li>
                      <strong>Quotemark consistency:</strong> Standardizes to
                      single or double quotes
                    </li>
                    <li>
                      <strong>Semicolon normalization:</strong> Adds or removes
                      semicolons consistently
                    </li>
                    <li>
                      <strong>Whitespace cleanup:</strong> Removes trailing
                      whitespace and normalizes line endings
                    </li>
                    <li>
                      <strong>Indentation fixes:</strong> Standardizes to spaces
                      or tabs consistently
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Corruption Patterns */}
            <div className="docs-section">
              <h2 id="corruption-patterns">🚨 Common Corruption Patterns</h2>

              <div className="docs-corruption-examples">
                <div className="docs-corruption-item">
                  <h4>📝 String Literal Corruption</h4>
                  <div className="docs-corruption-before-after">
                    <div className="corruption-before">
                      <strong>❌ Corrupted:</strong>
                      <code>
                        const message = &quot;Hello &amp; welcome&quot;;
                      </code>
                    </div>
                    <div className="corruption-after">
                      <strong>✅ Fixed:</strong>
                      <code>const message = "Hello & welcome";</code>
                    </div>
                  </div>
                </div>

                <div className="docs-corruption-item">
                  <h4>⚛️ JSX Attribute Corruption</h4>
                  <div className="docs-corruption-before-after">
                    <div className="corruption-before">
                      <strong>❌ Corrupted:</strong>
                      <code>
                        &lt;Button title=&quot;Click &amp; Save&quot; /&gt;
                      </code>
                    </div>
                    <div className="corruption-after">
                      <strong>✅ Fixed:</strong>
                      <code>&lt;Button title="Click & Save" /&gt;</code>
                    </div>
                  </div>
                </div>

                <div className="docs-corruption-item">
                  <h4>🔗 Complex Entity Chains</h4>
                  <div className="docs-corruption-before-after">
                    <div className="corruption-before">
                      <strong>❌ Corrupted:</strong>
                      <code>
                        const html =
                        &amp;quot;&amp;lt;div&amp;gt;Content&amp;lt;/div&amp;gt;&amp;quot;
                      </code>
                    </div>
                    <div className="corruption-after">
                      <strong>✅ Fixed:</strong>
                      <code>const html = "&lt;div&gt;Content&lt;/div&gt;"</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detection Strategy */}
            <div className="docs-section">
              <h2 id="detection-strategy">🔍 How Layer 2 Detects Issues</h2>

              <div className="docs-detection-flow">
                <div className="docs-detection-step">
                  <div className="docs-step-number">1</div>
                  <div className="docs-step-content">
                    <h4>🔍 Pattern Scanning</h4>
                    <p>
                      Uses optimized regex patterns to scan for HTML entities,
                      unused imports, and legacy patterns
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">2</div>
                  <div className="docs-step-content">
                    <h4>🧠 Context Analysis</h4>
                    <p>
                      Analyzes surrounding code to ensure transformations won't
                      break functionality
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">3</div>
                  <div className="docs-step-content">
                    <h4>⚡ Batch Processing</h4>
                    <p>
                      Groups similar patterns for efficient bulk transformation
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">4</div>
                  <div className="docs-step-content">
                    <h4>✅ Safety Validation</h4>
                    <p>
                      Ensures all transformations maintain code functionality
                      and syntax correctness
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why It's Important */}
            <div className="docs-section">
              <h2 id="why-important">⚡ Why Layer 2 is Critical</h2>

              <div className="docs-importance-grid">
                <div className="docs-importance-item">
                  <h4>🧹 Clean Foundation</h4>
                  <p>
                    Removes corruption and clutter that could interfere with
                    AST-based transformations in later layers.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🚀 Build Performance</h4>
                  <p>
                    Unused import removal can significantly reduce bundle size
                    and compilation time.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🔍 Code Readability</h4>
                  <p>
                    Fixes corruption that makes code hard to read and maintain
                    for developers.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🛡️ Runtime Safety</h4>
                  <p>
                    Prevents string corruption from causing runtime errors in
                    production.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div className="docs-section">
              <h2 id="safety-features">🛡️ Safety Features</h2>

              <div className="docs-safety-grid">
                <div className="docs-safety-feature">
                  <h4>🎯 Selective Matching</h4>
                  <p>
                    Only transforms patterns that match exact corruption
                    signatures to avoid false positives.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🔒 String Context Awareness</h4>
                  <p>
                    Differentiates between corrupted entities and intentional
                    HTML entities in strings.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>📦 Import Usage Analysis</h4>
                  <p>
                    Thoroughly analyzes code usage before removing any imports
                    to prevent breaking changes.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🔄 Reversible Operations</h4>
                  <p>
                    All pattern fixes can be reverted if they cause issues in
                    later validation.
                  </p>
                </div>
              </div>
            </div>

            {/* Known Limitations */}
            <div className="docs-section">
              <h2 id="limitations">⚠️ Known Limitations</h2>

              <div className="docs-highlight-box warning">
                <h3>🔍 Current Limitations</h3>
                <ul>
                  <li>
                    <strong>Complex string templates:</strong> Very complex
                    template literals may not be fully optimized
                  </li>
                  <li>
                    <strong>Dynamic imports:</strong> Imports determined at
                    runtime cannot be analyzed for usage
                  </li>
                  <li>
                    <strong>Commented code:</strong> HTML entities in comments
                    are preserved to maintain documentation
                  </li>
                  <li>
                    <strong>Third-party patterns:</strong> Some library-specific
                    patterns may not be recognized
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Examples Tab */}
        {activeTab === "examples" && (
          <>
            <div className="docs-section">
              <h2>📝 Before & After Examples</h2>

              <div className="docs-example-group">
                <h3>🔤 HTML Entity Corruption Fixes</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Corrupted)</h4>
                    <pre>
                      <code>{`// String literals with HTML entities
const welcomeMessage = &quot;Welcome to our app!&quot;;
const description = &quot;This &amp; that feature&quot;;
const htmlContent = &quot;&lt;div&gt;Hello World&lt;/div&gt;&quot;;

// JSX with corrupted attributes
<Button 
  title=&quot;Save &amp; Continue&quot;
  aria-label=&quot;Click to save &amp; continue&quot;
>
  Save &amp; Continue
</Button>

// Complex corruption chains
const complexString = &amp;quot;&amp;lt;span&amp;gt;Hello &amp;amp; goodbye&amp;lt;/span&amp;gt;&quot;;

// Single quote entities
const singleQuoteExample = &#x27;Don&#x27;t break&#x27;;`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Clean)</h4>
                    <pre>
                      <code>{`// String literals with proper quotes
const welcomeMessage = "Welcome to our app!";
const description = "This & that feature";
const htmlContent = "<div>Hello World</div>";

// JSX with clean attributes
<Button 
  title="Save & Continue"
  aria-label="Click to save & continue"
>
  Save & Continue
</Button>

// Clean strings without entity corruption
const complexString = "<span>Hello & goodbye</span>";

// Proper single quotes
const singleQuoteExample = "Don't break";`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Fixed 8 instances of <code>&amp;quot;</code> →{" "}
                      <code>"</code>
                    </li>
                    <li>
                      ✅ Fixed 4 instances of <code>&amp;amp;</code> →{" "}
                      <code>&amp;</code>
                    </li>
                    <li>
                      ✅ Fixed 4 instances of <code>&amp;lt;</code>/
                      <code>&amp;gt;</code> → <code>&lt;</code>/
                      <code>&gt;</code>
                    </li>
                    <li>
                      ✅ Fixed 3 instances of <code>&#x27;</code> →{" "}
                      <code>'</code>
                    </li>
                    <li>✅ Resolved complex entity chains</li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>📦 Unused Import Cleanup</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Cluttered)</h4>
                    <pre>
                      <code>{`import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Button, Input, Card, Modal, Tooltip } from '@/components/ui';
import { formatDate, parseDate, validateEmail } from '@/utils/helpers';
import { ApiClient } from '@/lib/api';
import { Logger } from '@/lib/logger';
import lodash from 'lodash';
import moment from 'moment';

// Only using a few of these imports
export default function UserProfile() {
  const [name, setName] = useState('');
  
  return (
    <Card>
      <Input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Button>Save</Button>
    </Card>
  );
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Optimized)</h4>
                    <pre>
                      <code>{`import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';

// Only the imports actually being used
export default function UserProfile() {
  const [name, setName] = useState('');
  
  return (
    <Card>
      <Input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Button>Save</Button>
    </Card>
  );
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      🗑️ Removed unused React hooks: <code>useEffect</code>,{" "}
                      <code>useContext</code>, <code>useMemo</code>
                    </li>
                    <li>
                      🗑️ Removed unused UI components: <code>Modal</code>,{" "}
                      <code>Tooltip</code>
                    </li>
                    <li>
                      🗑️ Removed unused utility functions:{" "}
                      <code>formatDate</code>, <code>parseDate</code>,{" "}
                      <code>validateEmail</code>
                    </li>
                    <li>
                      🗑️ Removed unused libraries: <code>ApiClient</code>,{" "}
                      <code>Logger</code>, <code>lodash</code>,{" "}
                      <code>moment</code>
                    </li>
                    <li>
                      ✅ Kept only imports that are actually used in the
                      component
                    </li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>🔄 Legacy Pattern Updates</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Legacy)</h4>
                    <pre>
                      <code>{`// Old React.Fragment syntax
return (
  <React.Fragment>
    <div>Content 1</div>
    <div>Content 2</div>
  </React.Fragment>
);

// console.log statements
console.log('Debug info:', userData);
console.log('Processing step 1');

// var declarations
var userName = 'John';
var isLoggedIn = false;

// Old function expressions
const handleClick = function() {
  return processData();
};

// String concatenation
const fullName = firstName + ' ' + lastName;
const message = 'Hello ' + userName + ', welcome back!';`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Modern)</h4>
                    <pre>
                      <code>{`// Modern React fragment syntax
return (
  <>
    <div>Content 1</div>
    <div>Content 2</div>
  </>
);

// Debug-level logging (or removed in production)
console.debug('Debug info:', userData);
console.debug('Processing step 1');

// const/let declarations
const userName = 'John';
let isLoggedIn = false;

// Arrow function expressions
const handleClick = () => {
  return processData();
};

// Template literals
const fullName = \`\${firstName} \${lastName}\`;
const message = \`Hello \${userName}, welcome back!\`;`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Converted <code>React.Fragment</code> to short syntax{" "}
                      <code>&lt;&gt;</code>
                    </li>
                    <li>
                      ✅ Updated <code>console.log</code> to{" "}
                      <code>console.debug</code>
                    </li>
                    <li>
                      ✅ Converted <code>var</code> to <code>const</code>/
                      <code>let</code> appropriately
                    </li>
                    <li>
                      ✅ Modernized function expressions to arrow functions
                    </li>
                    <li>
                      ✅ Replaced string concatenation with template literals
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <>
            <div className="docs-section">
              <h2>⚡ Performance Impact</h2>

              <div className="docs-performance-stats">
                <div className="docs-performance-metric">
                  <div className="docs-metric-value">10-30s</div>
                  <div className="docs-metric-label">Execution Time</div>
                  <div className="docs-metric-description">
                    Depends on codebase size
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">~10-40%</div>
                  <div className="docs-metric-label">Bundle Size Reduction</div>
                  <div className="docs-metric-description">
                    From unused import removal
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">Zero</div>
                  <div className="docs-metric-label">Runtime Overhead</div>
                  <div className="docs-metric-description">
                    Pure code cleanup
                  </div>
                </div>
              </div>

              <div className="docs-performance-details">
                <h3>📊 Detailed Performance Analysis</h3>

                <div className="docs-performance-section">
                  <h4>🚀 Build Time Improvements</h4>
                  <ul>
                    <li>
                      <strong>Unused import removal:</strong> Can reduce
                      compilation time by 15-30% on large projects
                    </li>
                    <li>
                      <strong>Cleaner code parsing:</strong> Fewer tokens for
                      bundlers to process
                    </li>
                    <li>
                      <strong>Tree shaking efficiency:</strong> Better dead code
                      elimination with cleaner imports
                    </li>
                    <li>
                      <strong>Module resolution:</strong> Fewer modules to
                      resolve and bundle
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>📦 Bundle Size Impact</h4>
                  <ul>
                    <li>
                      <strong>Direct size reduction:</strong> Removed unused
                      imports don't get bundled
                    </li>
                    <li>
                      <strong>Library optimization:</strong> Unused library
                      functions are tree-shaken more effectively
                    </li>
                    <li>
                      <strong>Cleaner code:</strong> Less string corruption
                      means smaller string constants
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>🔍 Development Experience</h4>
                  <ul>
                    <li>
                      <strong>Faster IDE performance:</strong> Less code for
                      IntelliSense to analyze
                    </li>
                    <li>
                      <strong>Cleaner git diffs:</strong> No more HTML entity
                      noise in version control
                    </li>
                    <li>
                      <strong>Better code navigation:</strong> Cleaner imports
                      make "Go to Definition" more reliable
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>⚡ Execution Speed</h4>
                  <ul>
                    <li>
                      <strong>Regex optimization:</strong> Uses compiled
                      patterns for maximum speed
                    </li>
                    <li>
                      <strong>Batch processing:</strong> Groups similar
                      transformations for efficiency
                    </li>
                    <li>
                      <strong>Memory efficient:</strong> Processes files in
                      streams for large codebases
                    </li>
                    <li>
                      <strong>Parallel analysis:</strong> Can analyze multiple
                      files simultaneously
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CLI Usage Tab */}
        {activeTab === "cli" && (
          <>
            <div className="docs-section">
              <h2>💻 Command Line Usage</h2>

              <div className="docs-cli-section">
                <h3>🎯 Run Layer 2 Only</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>npm run fix-layer-2</code>
                  </pre>
                  <p>Executes only the pattern fixes layer</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🔍 Preview Layer 2 Changes</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-2-patterns.js --dry-run</code>
                  </pre>
                  <p>
                    Shows what patterns would be fixed without applying changes
                  </p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📝 Verbose Output</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-2-patterns.js --verbose</code>
                  </pre>
                  <p>
                    Provides detailed information about each pattern
                    transformation
                  </p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🎛️ Advanced Options</h3>
                <div className="docs-cli-options">
                  <div className="docs-cli-option">
                    <code>--skip-entities</code>
                    <p>Skip HTML entity fixes</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-imports</code>
                    <p>Skip unused import removal</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-console</code>
                    <p>Skip console.log transformations</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--preserve-fragments</code>
                    <p>Keep React.Fragment instead of converting to &lt;&gt;</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--file-pattern</code>
                    <p>Specify custom file pattern to process</p>
                  </div>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📊 Example Output</h3>
                <div className="docs-cli-output">
                  <pre>
                    <code>{`🧹 NeuroLint Pro - Layer 2: Pattern Fixes

📁 Scanning for source files...
✅ Found 47 TypeScript/JavaScript files
✅ Found 23 React component files

🔍 Analyzing patterns...
⚠️  32 HTML entity corruptions detected
⚠️  15 unused imports found
⚠️  8 console.log statements found
⚠️  5 legacy React.Fragment usages

🛠️  Applying pattern fixes...
✅ Fixed &quot; entities in 12 files
✅ Fixed &amp; entities in 8 files  
✅ Fixed &lt;&gt; entities in 7 files
✅ Removed 15 unused imports
✅ Updated 8 console.log to console.debug
✅ Converted 5 React.Fragment to <>

📊 Summary:
   • 32 HTML entity corruptions fixed
   • 15 unused imports removed (~180KB bundle reduction)
   • 8 console statements updated
   • 5 React fragments modernized
   • 0 errors encountered
   
✨ Layer 2 completed successfully!
   Estimated bundle size reduction: ~180KB`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Page Navigation */}
      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/layer-reference/layer-1-config"
            className="docs-nav-link prev"
          >
            ← Layer 1: Configuration Fixes
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/layer-reference/layer-3-components"
            className="docs-nav-link next"
          >
            Layer 3: Component Fixes →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .docs-page {
          min-height: 100vh;
          background: #000000;
          color: white;
          font-family: var(--font-sans, "Inter", sans-serif);
        }

        .docs-page-header {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.08) 0%,
            rgba(0, 0, 0, 0.95) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
        }

        .docs-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .docs-breadcrumb a {
          color: var(--status-info);
          text-decoration: none;
        }

        .docs-breadcrumb a:hover {
          text-decoration: underline;
        }

        .docs-breadcrumb-separator {
          color: rgba(255, 255, 255, 0.4);
        }

        .docs-breadcrumb-current {
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-page-title {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #ffffff 0%, #2196f3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .docs-page-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .docs-page-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .docs-meta-item {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .difficulty-intermediate {
          color: var(--status-processing);
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.1);
        }

        .layer-badge {
          color: var(--status-processing);
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.1);
        }

        .docs-tab-nav {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0 40px;
          display: flex;
          gap: 8px;
        }

        .docs-tab {
          padding: 16px 24px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .docs-tab:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }

        .docs-tab.active {
          color: var(--status-info);
          border-bottom-color: var(--status-info);
          background: rgba(33, 150, 243, 0.1);
        }

        .docs-page-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 40px;
          line-height: 1.7;
        }

        .docs-section {
          margin-bottom: 60px;
        }

        .docs-section h2 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 24px 0;
          color: white;
        }

        .docs-section h3 {
          font-size: 24px;
          font-weight: 600;
          margin: 32px 0 16px 0;
          color: white;
        }

        .docs-section h4 {
          font-size: 18px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          color: white;
        }

        .docs-section p {
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-highlight-box {
          padding: 24px;
          border-radius: 12px;
          margin: 32px 0;
          border: 1px solid;
        }

        .docs-highlight-box.info {
          background: rgba(33, 150, 243, 0.1);
          border-color: rgba(33, 150, 243, 0.3);
        }

        .docs-highlight-box.warning {
          background: rgba(255, 152, 0, 0.1);
          border-color: rgba(255, 152, 0, 0.3);
        }

        .docs-highlight-box h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }

        .docs-highlight-box p {
          margin: 0;
        }

        .docs-highlight-box ul {
          margin: 12px 0 0 0;
          padding-left: 20px;
        }

        .docs-highlight-box li {
          margin-bottom: 8px;
        }

        .docs-fix-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-fix-category {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-fix-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .docs-fix-category h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
        }

        .docs-fix-category ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-fix-category li {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-corruption-examples {
          margin: 32px 0;
        }

        .docs-corruption-item {
          margin: 24px 0;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-corruption-item h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
        }

        .docs-corruption-before-after {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .corruption-before,
        .corruption-after {
          padding: 12px;
          border-radius: 8px;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
        }

        .corruption-before {
          background: rgba(229, 62, 62, 0.1);
          border: 1px solid rgba(229, 62, 62, 0.3);
        }

        .corruption-after {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .corruption-before strong {
          color: #ff6b6b;
        }

        .corruption-after strong {
          color: #4caf50;
        }

        .docs-detection-flow {
          margin: 32px 0;
        }

        .docs-detection-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .docs-step-number {
          width: 32px;
          height: 32px;
          background: var(--status-processing);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .docs-step-content h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        .docs-step-content p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-importance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-importance-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-importance-item h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-importance-item p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-safety-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-safety-feature {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-safety-feature h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-safety-feature p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-example-group {
          margin: 40px 0;
          padding: 32px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .docs-example-group h3 {
          margin: 0 0 24px 0;
          font-size: 22px;
        }

        .docs-code-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 24px 0;
        }

        .docs-code-before,
        .docs-code-after {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .docs-code-before h4 {
          background: rgba(229, 62, 62, 0.2);
          color: #ff6b6b;
          margin: 0;
          padding: 12px 16px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-code-after h4 {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          margin: 0;
          padding: 12px 16px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .docs-code-before pre,
        .docs-code-after pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
        }

        .docs-code-before code,
        .docs-code-after code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-changes-summary {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .docs-changes-summary h4 {
          margin: 0 0 12px 0;
          color: var(--status-info);
        }

        .docs-changes-summary ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-changes-summary li {
          margin-bottom: 6px;
          font-size: 14px;
        }

        .docs-performance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-performance-metric {
          text-align: center;
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .docs-metric-value {
          font-size: 36px;
          font-weight: 700;
          color: var(--status-processing);
          margin-bottom: 8px;
        }

        .docs-metric-label {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .docs-metric-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .docs-performance-details {
          margin: 40px 0;
        }

        .docs-performance-section {
          margin: 24px 0;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-performance-section h4 {
          margin: 0 0 12px 0;
        }

        .docs-performance-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-performance-section li {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .docs-cli-section {
          margin: 32px 0;
        }

        .docs-cli-section h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
        }

        .docs-cli-command {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .docs-cli-command pre {
          margin: 0 0 8px 0;
        }

        .docs-cli-command code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 14px;
          color: var(--status-processing);
        }

        .docs-cli-command p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-cli-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .docs-cli-option {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }

        .docs-cli-option code {
          color: var(--status-info);
          font-weight: 600;
          font-size: 14px;
        }

        .docs-cli-option p {
          margin: 8px 0 0 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-cli-output {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }

        .docs-cli-output pre {
          margin: 0;
          overflow-x: auto;
        }

        .docs-cli-output code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-page-nav {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          display: flex;
          justify-content: space-between;
        }

        .docs-nav-link {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          text-decoration: none;
          color: white;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .docs-nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 0.9em;
        }

        strong {
          color: white;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .docs-page-header,
          .docs-page-content,
          .docs-page-nav {
            padding-left: 20px;
            padding-right: 20px;
          }

          .docs-tab-nav {
            padding-left: 20px;
            padding-right: 20px;
            overflow-x: auto;
          }

          .docs-page-title {
            font-size: 36px;
          }

          .docs-code-comparison {
            grid-template-columns: 1fr;
          }

          .docs-page-nav {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
