"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Layer3ComponentsPage() {
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
            Layer 3: Component Fixes
          </span>
        </div>

        <h1 className="docs-page-title">⚛️ Layer 3: Component Fixes</h1>
        <p className="docs-page-subtitle">
          React component improvements, missing key props, accessibility
          enhancements, and component best practices
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">⏱️ 12 min read</span>
          <span className="docs-meta-item difficulty-intermediate">
            🟡 Intermediate
          </span>
          <span className="docs-meta-item layer-badge">⚛️ React Layer</span>
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
              <h3>🎯 Layer 3 Purpose</h3>
              <p>
                Layer 3 focuses on{" "}
                <strong>React component-specific improvements</strong>. It fixes
                missing key props, adds accessibility attributes, standardizes
                component patterns, ensures proper imports, and optimizes
                component structure for performance and maintainability.
              </p>
            </div>

            {/* What It Fixes */}
            <div className="docs-section">
              <h2 id="what-it-fixes">⚛️ What Layer 3 Fixes</h2>

              <div className="docs-fix-categories">
                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🗝️</div>
                  <h3>Missing Key Props</h3>
                  <ul>
                    <li>
                      <strong>Array.map() keys:</strong> Adds key props to
                      mapped JSX elements
                    </li>
                    <li>
                      <strong>Smart key generation:</strong> Uses{" "}
                      <code>item.id</code> or falls back to index
                    </li>
                    <li>
                      <strong>Fragment keys:</strong> Adds keys to React
                      fragments in lists
                    </li>
                    <li>
                      <strong>Nested mapping:</strong> Handles complex nested
                      map operations
                    </li>
                    <li>
                      <strong>Dynamic lists:</strong> Ensures all dynamic list
                      elements have unique keys
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">🎛️</div>
                  <h3>Component Props & Variants</h3>
                  <ul>
                    <li>
                      <strong>Button variants:</strong> Adds default{" "}
                      <code>variant="default"</code> to buttons
                    </li>
                    <li>
                      <strong>Input types:</strong> Ensures proper input type
                      attributes
                    </li>
                    <li>
                      <strong>Form validation:</strong> Adds required validation
                      attributes
                    </li>
                    <li>
                      <strong>Icon sizing:</strong> Standardizes icon component
                      size props
                    </li>
                    <li>
                      <strong>UI component consistency:</strong> Ensures
                      consistent prop usage across UI libraries
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">♿</div>
                  <h3>Accessibility Improvements</h3>
                  <ul>
                    <li>
                      <strong>Alt attributes:</strong> Adds missing alt text to
                      images
                    </li>
                    <li>
                      <strong>ARIA labels:</strong> Adds appropriate aria-label
                      attributes
                    </li>
                    <li>
                      <strong>Semantic HTML:</strong> Suggests better semantic
                      element usage
                    </li>
                    <li>
                      <strong>Focus management:</strong> Ensures interactive
                      elements are focusable
                    </li>
                    <li>
                      <strong>Screen reader support:</strong> Adds
                      aria-describedby and role attributes
                    </li>
                  </ul>
                </div>

                <div className="docs-fix-category">
                  <div className="docs-fix-icon">📦</div>
                  <h3>Import Management</h3>
                  <ul>
                    <li>
                      <strong>Missing React imports:</strong> Adds{" "}
                      <code>import React</code> where needed
                    </li>
                    <li>
                      <strong>Hook imports:</strong> Adds missing useState,
                      useEffect imports
                    </li>
                    <li>
                      <strong>Component imports:</strong> Auto-imports missing
                      UI components
                    </li>
                    <li>
                      <strong>Type imports:</strong> Adds missing TypeScript
                      type imports
                    </li>
                    <li>
                      <strong>Default imports:</strong> Converts named imports
                      to default where appropriate
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AST vs Regex Strategy */}
            <div className="docs-section">
              <h2 id="ast-strategy">🌳 AST-First Transformation Strategy</h2>

              <div className="docs-highlight-box info">
                <h3>🧠 Why Layer 3 Uses AST</h3>
                <p>
                  Layer 3 primarily uses{" "}
                  <strong>Abstract Syntax Tree (AST) analysis</strong> because
                  component transformations require understanding code
                  structure, not just pattern matching. AST provides semantic
                  understanding of React components, JSX, and TypeScript.
                </p>
              </div>

              <div className="docs-ast-advantages">
                <div className="docs-ast-advantage">
                  <h4>🎯 Precise Component Analysis</h4>
                  <p>
                    Understands JSX structure, component props, and React
                    patterns accurately
                  </p>
                </div>

                <div className="docs-ast-advantage">
                  <h4>🔍 Context Awareness</h4>
                  <p>
                    Knows the difference between JSX elements, function calls,
                    and variable references
                  </p>
                </div>

                <div className="docs-ast-advantage">
                  <h4>🛡️ Safer Transformations</h4>
                  <p>
                    Avoids false positives by understanding code semantics, not
                    just text patterns
                  </p>
                </div>

                <div className="docs-ast-advantage">
                  <h4>📐 Complex Modifications</h4>
                  <p>
                    Can add, modify, or remove JSX attributes and elements with
                    precision
                  </p>
                </div>
              </div>
            </div>

            {/* Component Detection */}
            <div className="docs-section">
              <h2 id="component-detection">🔍 How Layer 3 Detects Issues</h2>

              <div className="docs-detection-flow">
                <div className="docs-detection-step">
                  <div className="docs-step-number">1</div>
                  <div className="docs-step-content">
                    <h4>🌳 AST Parsing</h4>
                    <p>
                      Parses React/TypeScript files into Abstract Syntax Trees
                      for semantic analysis
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">2</div>
                  <div className="docs-step-content">
                    <h4>⚛️ JSX Traversal</h4>
                    <p>
                      Walks through JSX elements to identify missing props,
                      keys, and accessibility issues
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">3</div>
                  <div className="docs-step-content">
                    <h4>📊 Pattern Recognition</h4>
                    <p>
                      Identifies common React patterns like mapping, conditional
                      rendering, and event handling
                    </p>
                  </div>
                </div>

                <div className="docs-detection-step">
                  <div className="docs-step-number">4</div>
                  <div className="docs-step-content">
                    <h4>🔧 Smart Transformation</h4>
                    <p>
                      Applies fixes while preserving existing logic and
                      maintaining code style
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Props Strategy */}
            <div className="docs-section">
              <h2 id="key-props-strategy">🗝️ Smart Key Prop Generation</h2>

              <div className="docs-key-strategy">
                <div className="docs-strategy-item">
                  <h4>🎯 Intelligent Key Selection</h4>
                  <div className="docs-strategy-examples">
                    <div className="docs-strategy-example">
                      <strong>If item has .id:</strong>{" "}
                      <code>key=&#123;item.id&#125;</code>
                    </div>
                    <div className="docs-strategy-example">
                      <strong>If item has .key:</strong>{" "}
                      <code>key=&#123;item.key&#125;</code>
                    </div>
                    <div className="docs-strategy-example">
                      <strong>If item is primitive:</strong>{" "}
                      <code>key=&#123;item&#125;</code>
                    </div>
                    <div className="docs-strategy-example">
                      <strong>Fallback:</strong>{" "}
                      <code>key=&#123;index&#125;</code>
                    </div>
                  </div>
                </div>

                <div className="docs-strategy-item">
                  <h4>⚡ Performance Optimization</h4>
                  <p>
                    Prioritizes stable keys over index-based keys to prevent
                    unnecessary re-renders
                  </p>
                </div>

                <div className="docs-strategy-item">
                  <h4>��� Nested Structure Support</h4>
                  <p>
                    Handles complex nested mapping and conditional rendering
                    scenarios
                  </p>
                </div>
              </div>
            </div>

            {/* Why It's Important */}
            <div className="docs-section">
              <h2 id="why-important">⚡ Why Layer 3 is Critical</h2>

              <div className="docs-importance-grid">
                <div className="docs-importance-item">
                  <h4>🚀 React Performance</h4>
                  <p>
                    Proper key props prevent unnecessary re-renders and improve
                    list performance significantly.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>♿ Accessibility Compliance</h4>
                  <p>
                    Automated accessibility fixes help meet WCAG guidelines and
                    improve user experience.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>🛡️ Runtime Stability</h4>
                  <p>
                    Missing imports and props can cause runtime errors that are
                    caught and fixed.
                  </p>
                </div>

                <div className="docs-importance-item">
                  <h4>📊 Development Experience</h4>
                  <p>
                    Consistent component patterns make code more maintainable
                    and easier to understand.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div className="docs-section">
              <h2 id="safety-features">🛡️ Safety Features</h2>

              <div className="docs-safety-grid">
                <div className="docs-safety-feature">
                  <h4>🌳 AST Validation</h4>
                  <p>
                    All transformations are validated through AST to ensure
                    syntactic correctness.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🔍 Scope Analysis</h4>
                  <p>
                    Understands variable scope to avoid adding conflicting
                    imports or references.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>⚛️ React Pattern Awareness</h4>
                  <p>
                    Recognizes React-specific patterns to avoid breaking
                    component logic.
                  </p>
                </div>

                <div className="docs-safety-feature">
                  <h4>🔄 Fallback Strategy</h4>
                  <p>
                    Falls back to regex-based fixes if AST parsing fails,
                    ensuring robustness.
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
                    <strong>Complex JSX expressions:</strong> Very complex
                    nested JSX may not be fully optimized
                  </li>
                  <li>
                    <strong>Dynamic component names:</strong> Components
                    determined at runtime cannot be analyzed
                  </li>
                  <li>
                    <strong>Third-party components:</strong> Custom prop
                    requirements may not be recognized
                  </li>
                  <li>
                    <strong>Advanced TypeScript:</strong> Complex generic types
                    may not be fully inferred
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
                <h3>🗝️ Missing Key Props</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Missing Keys)</h4>
                    <pre>
                      <code>{`// Simple mapping without keys
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li>{user.name}</li>
      ))}
    </ul>
  );
}

// Complex nested mapping
function CategoryList({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <div>
          <h3>{category.name}</h3>
          {category.items.map(item => (
            <span>{item.title}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

// Fragment mapping
function TagList({ tags }) {
  return (
    <>
      {tags.map(tag => (
        <React.Fragment>
          <span>{tag}</span>
          <span>, </span>
        </React.Fragment>
      ))}
    </>
  );
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (With Keys)</h4>
                    <pre>
                      <code>{`// Simple mapping with intelligent keys
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Complex nested mapping with unique keys
function CategoryList({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          {category.items.map(item => (
            <span key={item.id}>{item.title}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

// Fragment mapping with proper keys
function TagList({ tags }) {
  return (
    <>
      {tags.map((tag, index) => (
        <React.Fragment key={index}>
          <span>{tag}</span>
          <span>, </span>
        </React.Fragment>
      ))}
    </>
  );
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Added <code>key=&#123;user.id&#125;</code> to list
                      items with ID properties
                    </li>
                    <li>
                      ✅ Added <code>key=&#123;category.id&#125;</code> to
                      nested category elements
                    </li>
                    <li>
                      ✅ Added <code>key=&#123;item.id&#125;</code> to nested
                      item elements
                    </li>
                    <li>
                      ✅ Added <code>key=&#123;index&#125;</code> to
                      React.Fragment as fallback
                    </li>
                    <li>✅ Maintained existing JSX structure and logic</li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>♿ Accessibility Improvements</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Accessibility Issues)</h4>
                    <pre>
                      <code>{`// Images without alt text
function ProductCard({ product }) {
  return (
    <div>
      <img src={product.image} />
      <h3>{product.name}</h3>
      <button onClick={handleBuy}>Buy Now</button>
    </div>
  );
}

// Forms without proper labels
function ContactForm() {
  return (
    <form>
      <input type="text" placeholder="Your name" />
      <input type="email" placeholder="Email" />
      <textarea placeholder="Message"></textarea>
      <button type="submit">Send</button>
    </form>
  );
}

// Interactive elements without accessibility
function Modal({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>×</span>
        {children}
      </div>
    </div>
  );
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Accessible)</h4>
                    <pre>
                      <code>{`// Images with proper alt text
function ProductCard({ product }) {
  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <button onClick={handleBuy} aria-label={\`Buy \${product.name}\`}>
        Buy Now
      </button>
    </div>
  );
}

// Forms with proper labels and accessibility
function ContactForm() {
  return (
    <form>
      <input 
        type="text" 
        placeholder="Your name" 
        aria-label="Your name"
        required
      />
      <input 
        type="email" 
        placeholder="Email" 
        aria-label="Email address"
        required
      />
      <textarea 
        placeholder="Message"
        aria-label="Your message"
        required
      ></textarea>
      <button type="submit">Send</button>
    </form>
  );
}

// Interactive elements with full accessibility
function Modal({ onClose, children }) {
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content">
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Added <code>alt=&#123;product.name&#125;</code> to
                      product images
                    </li>
                    <li>
                      ✅ Added <code>aria-label</code> attributes to form inputs
                    </li>
                    <li>
                      ✅ Added <code>required</code> attributes to form fields
                    </li>
                    <li>
                      ✅ Added <code>role="dialog"</code> and{" "}
                      <code>aria-modal="true"</code> to modal
                    </li>
                    <li>
                      ✅ Added descriptive <code>aria-label</code> to close
                      button
                    </li>
                  </ul>
                </div>
              </div>

              <div className="docs-example-group">
                <h3>🎛️ Component Props & Variants</h3>

                <div className="docs-code-comparison">
                  <div className="docs-code-before">
                    <h4>❌ Before (Inconsistent Props)</h4>
                    <pre>
                      <code>{`// Buttons without variants
function ActionBar() {
  return (
    <div>
      <Button>Save</Button>
      <Button>Cancel</Button>
      <Button>Delete</Button>
    </div>
  );
}

// Icons without consistent sizing
function IconBar() {
  return (
    <div>
      <SearchIcon />
      <UserIcon />
      <SettingsIcon />
    </div>
  );
}

// Forms with missing types
function LoginForm() {
  return (
    <form>
      <Input placeholder="Username" />
      <Input placeholder="Password" />
      <Button type="submit">Login</Button>
    </form>
  );
}`}</code>
                    </pre>
                  </div>

                  <div className="docs-code-after">
                    <h4>✅ After (Consistent Props)</h4>
                    <pre>
                      <code>{`// Buttons with explicit variants
function ActionBar() {
  return (
    <div>
      <Button variant="default">Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}

// Icons with consistent sizing
function IconBar() {
  return (
    <div>
      <SearchIcon size={16} />
      <UserIcon size={16} />
      <SettingsIcon size={16} />
    </div>
  );
}

// Forms with proper input types
function LoginForm() {
  return (
    <form>
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      <Button type="submit" variant="default">Login</Button>
    </form>
  );
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="docs-changes-summary">
                  <h4>📊 Changes Made:</h4>
                  <ul>
                    <li>
                      ✅ Added appropriate <code>variant</code> props to buttons
                    </li>
                    <li>
                      ✅ Added consistent <code>size=&#123;16&#125;</code> props
                      to icons
                    </li>
                    <li>
                      ✅ Added proper <code>type="text"</code> and{" "}
                      <code>type="password"</code> to inputs
                    </li>
                    <li>
                      ✅ Ensured semantic button variants (default, outline,
                      destructive)
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
                  <div className="docs-metric-value">5-15s</div>
                  <div className="docs-metric-label">Execution Time</div>
                  <div className="docs-metric-description">
                    Component files only
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">~30-50%</div>
                  <div className="docs-metric-label">
                    List Re-render Reduction
                  </div>
                  <div className="docs-metric-description">
                    From proper key props
                  </div>
                </div>

                <div className="docs-performance-metric">
                  <div className="docs-metric-value">Minimal</div>
                  <div className="docs-metric-label">Bundle Impact</div>
                  <div className="docs-metric-description">
                    Only prop additions
                  </div>
                </div>
              </div>

              <div className="docs-performance-details">
                <h3>📊 Detailed Performance Analysis</h3>

                <div className="docs-performance-section">
                  <h4>🚀 React Performance Improvements</h4>
                  <ul>
                    <li>
                      <strong>Key prop optimization:</strong> Prevents
                      unnecessary re-renders of list items
                    </li>
                    <li>
                      <strong>Stable reconciliation:</strong> React can
                      efficiently diff virtual DOM trees
                    </li>
                    <li>
                      <strong>Component memoization:</strong> Enables React.memo
                      and useMemo optimizations
                    </li>
                    <li>
                      <strong>Reduced DOM manipulation:</strong> Fewer DOM
                      updates due to better reconciliation
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>♿ Accessibility Performance</h4>
                  <ul>
                    <li>
                      <strong>Screen reader efficiency:</strong> Proper ARIA
                      labels reduce parsing time
                    </li>
                    <li>
                      <strong>Semantic navigation:</strong> Better document
                      structure for assistive technology
                    </li>
                    <li>
                      <strong>Focus management:</strong> Improved keyboard
                      navigation performance
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>🔍 Development Performance</h4>
                  <ul>
                    <li>
                      <strong>Faster type checking:</strong> Proper imports
                      reduce TypeScript errors
                    </li>
                    <li>
                      <strong>Better IntelliSense:</strong> Consistent props
                      improve IDE autocomplete
                    </li>
                    <li>
                      <strong>Reduced warnings:</strong> Fewer React console
                      warnings in development
                    </li>
                  </ul>
                </div>

                <div className="docs-performance-section">
                  <h4>⚡ Layer 3 Execution Speed</h4>
                  <ul>
                    <li>
                      <strong>AST caching:</strong> Parsed trees are cached for
                      efficiency
                    </li>
                    <li>
                      <strong>Targeted analysis:</strong> Only analyzes
                      React/JSX files
                    </li>
                    <li>
                      <strong>Incremental processing:</strong> Processes
                      components one at a time
                    </li>
                    <li>
                      <strong>Memory optimization:</strong> Efficient AST
                      traversal algorithms
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
                <h3>🎯 Run Layer 3 Only</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>npm run fix-layer-3</code>
                  </pre>
                  <p>Executes only the component fixes layer</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🔍 Preview Layer 3 Changes</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-3-components.js --dry-run</code>
                  </pre>
                  <p>Shows what component improvements would be made</p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📝 Verbose Output</h3>
                <div className="docs-cli-command">
                  <pre>
                    <code>node fix-layer-3-components.js --verbose</code>
                  </pre>
                  <p>
                    Provides detailed information about each component
                    transformation
                  </p>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>🎛️ Advanced Options</h3>
                <div className="docs-cli-options">
                  <div className="docs-cli-option">
                    <code>--skip-keys</code>
                    <p>Skip missing key prop fixes</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-accessibility</code>
                    <p>Skip accessibility improvements</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-imports</code>
                    <p>Skip missing import additions</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--skip-variants</code>
                    <p>Skip component variant standardization</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--ast-only</code>
                    <p>Use only AST transformations (no regex fallback)</p>
                  </div>
                  <div className="docs-cli-option">
                    <code>--components-pattern</code>
                    <p>Specify custom pattern for component files</p>
                  </div>
                </div>
              </div>

              <div className="docs-cli-section">
                <h3>📊 Example Output</h3>
                <div className="docs-cli-output">
                  <pre>
                    <code>{`⚛️ NeuroLint Pro - Layer 3: Component Fixes

📁 Scanning for React component files...
✅ Found 34 React component files
✅ Found 12 TypeScript interface files

🔍 Analyzing React components...
⚠️  18 missing key props detected
⚠️  12 accessibility issues found
⚠️  8 missing imports detected
⚠️  15 inconsistent component variants
⚠️  6 missing alt attributes

🛠️  Applying component fixes...
✅ Added key props to 18 mapped elements
✅ Added 12 accessibility attributes
✅ Added 8 missing React imports
✅ Standardized 15 component variants
✅ Added alt attributes to 6 images
✅ Fixed 3 TypeScript import issues

📊 Summary:
   • 18 key props added (improved list performance)
   • 12 accessibility improvements (WCAG compliance)
   • 8 imports fixed (reduced runtime errors)
   • 15 component variants standardized
   • 6 images made accessible
   • 0 errors encountered
   
✨ Layer 3 completed successfully!
   React performance improvements: ~40% fewer re-renders
   Accessibility score improvement: +15 points`}</code>
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
            href="/docs/layer-reference/layer-2-patterns"
            className="docs-nav-link prev"
          >
            ← Layer 2: Pattern Fixes
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/layer-reference/layer-4-hydration"
            className="docs-nav-link next"
          >
            Layer 4: Hydration & SSR Fixes →
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
          color: #61dafb;
          border-color: rgba(97, 218, 251, 0.3);
          background: rgba(97, 218, 251, 0.1);
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

        .docs-ast-advantages {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-ast-advantage {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-ast-advantage h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .docs-ast-advantage p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
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
          background: #61dafb;
          color: #000;
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

        .docs-key-strategy {
          margin: 32px 0;
        }

        .docs-strategy-item {
          margin: 24px 0;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-strategy-item h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
        }

        .docs-strategy-item p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-strategy-examples {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .docs-strategy-example {
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 12px;
        }

        .docs-strategy-example strong {
          color: var(--status-info);
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
          color: #61dafb;
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
          color: #61dafb;
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
