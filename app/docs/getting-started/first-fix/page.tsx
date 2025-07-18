"use client";

import React from "react";
import Link from "next/link";

export default function FirstFixPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#getting-started">Getting Started</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            Running Your First Fix
          </span>
        </div>

        <h1 className="docs-page-title">Running Your First Fix</h1>
        <p className="docs-page-subtitle">
          Complete walkthrough from problem detection to successful fix
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">8 min read</span>
          <span className="docs-meta-item difficulty-beginner">Beginner</span>
          <span className="docs-meta-item">Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        <div className="docs-highlight-box info">
          <h3>What You'll Learn</h3>
          <p>
            By the end of this guide, you'll have successfully run NeuroLint Pro
            on a real React component and understand the complete analysis and
            fixing process.
          </p>
        </div>

        <div className="docs-section">
          <h2>Prerequisites</h2>

          <div className="docs-checklist">
            <div className="docs-checklist-item">
              <input type="checkbox" disabled checked />
              <span>NeuroLint Pro CLI installed</span>
            </div>
            <div className="docs-checklist-item">
              <input type="checkbox" disabled />
              <span>A React/Next.js project to analyze</span>
            </div>
            <div className="docs-checklist-item">
              <input type="checkbox" disabled />
              <span>Basic familiarity with command line</span>
            </div>
          </div>

          <p>
            If you haven't installed NeuroLint Pro yet, check out our{" "}
            <Link href="/docs/getting-started/installation">
              Installation Guide
            </Link>
            .
          </p>
        </div>

        <div className="docs-section">
          <h2>Step 1: Navigate to Your Project</h2>

          <p>
            First, open your terminal and navigate to your React or Next.js
            project:
          </p>

          <div className="docs-code-block">
            <pre>
              <code>{`cd /path/to/your/react-project
ls -la  # Verify you see package.json and src/ folder`}</code>
            </pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>Step 2: Run Analysis (Dry Run)</h2>

          <p>
            Always start with a dry run to see what NeuroLint Pro would change
            without actually modifying your files:
          </p>

          <div className="docs-code-block">
            <pre>
              <code>{`# Analyze your entire src directory
neurolint analyze src --dry-run

# Or analyze a specific file
neurolint analyze src/components/MyComponent.tsx --dry-run`}</code>
            </pre>
          </div>

          <div className="docs-output-example">
            <h4>Expected Output:</h4>
            <div className="docs-terminal-output">
              <pre>{`🔍 NeuroLint Pro Analysis Report
📁 Scanning: src/
⚡ Engine: Standard (6 layers)
🎯 Mode: Dry Run

📊 ANALYSIS RESULTS:
┌─────────────────────────────────────────────────────────┐
│ File: src/components/ProductCard.tsx                   │
├─────────────────────────────────────────────────────────┤
│ Issues Found: 4                                         │
│ Recommended Layers: [1, 2, 3]                         │
│ Estimated Fix Time: 2.3s                              │
└─────────────────────────────────────────────────────────┘

🔧 LAYER 1 - Configuration:
  ✓ Would update tsconfig.json target to ES2020

🧹 LAYER 2 - Patterns:  
  ✓ Would fix 2 HTML entity corruptions
  ✓ Would clean up import statements

⚛️ LAYER 3 - Components:
  ✓ Would add missing key prop to list items

💡 Run with --apply to implement these fixes`}</pre>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Step 3: Review the Proposed Changes</h2>

          <p>
            The dry run shows you exactly what would be changed. Let's
            understand each section:
          </p>

          <div className="docs-explanation-grid">
            <div className="docs-explanation-item">
              <h4>Issues Found</h4>
              <p>Total number of problems detected across all layers</p>
            </div>

            <div className="docs-explanation-item">
              <h4>Recommended Layers</h4>
              <p>Which of the 6 layers are needed for this specific file</p>
            </div>

            <div className="docs-explanation-item">
              <h4>Estimated Fix Time</h4>
              <p>How long the transformations will take to execute</p>
            </div>

            <div className="docs-explanation-item">
              <h4>Layer Details</h4>
              <p>Specific changes each layer would make to your code</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Step 4: Apply the Fixes</h2>

          <p>
            If you're satisfied with the proposed changes, apply them with the{" "}
            <code>--apply</code> flag:
          </p>

          <div className="docs-code-block">
            <pre>
              <code>{`# Apply fixes to the same file
neurolint fix src/components/ProductCard.tsx --apply

# Or fix all files in src directory
neurolint fix src --apply`}</code>
            </pre>
          </div>

          <div className="docs-output-example">
            <h4>Expected Output:</h4>
            <div className="docs-terminal-output">
              <pre>{`🔧 NeuroLint Pro Fix Mode
📁 Target: src/components/ProductCard.tsx
⚡ Engine: Standard (6 layers)
🛡️ Safety: Backup created

🔄 EXECUTING FIXES:
┌─────────────────────────────────────────────────────────┐
│ Layer 1 - Configuration                               │
│ ✅ Updated tsconfig.json target: es5 → ES2020         │
│ ⏱️  Completed in 0.1s                                 │
└─────────────────────────────────────────���───────────────┘

┌─────────────────────────────────────────────────────────┐
│ Layer 2 - Patterns                                    │
│ ✅ Fixed HTML entities: &quot; → "                      │
│ ✅ Cleaned import statements                           │
│ ⏱️  Completed in 0.3s                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Layer 3 - Components                                  │
│ ✅ Added key props to 3 list items                    │
│ ⏱️  Completed in 0.2s                                 │
└─────────────────────────────────────────────────────────┘

✅ SUCCESS: All fixes applied successfully!
📊 Total execution time: 0.6s
🔄 Backup saved to: .neurolint/backups/2024-12-...`}</pre>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Step 5: Verify the Changes</h2>

          <p>Let's see what actually changed in your code:</p>

          <div className="docs-before-after">
            <div className="docs-code-comparison">
              <div className="docs-code-before">
                <h4>Before (Original)</h4>
                <pre>
                  <code>{`import React from 'react';

export default function ProductCard({ products }) {
  return (
    <div>
      <h2>&quot;Popular Products&quot;</h2>
      <ul>
        {products.map(product => (
          <li>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`}</code>
                </pre>
              </div>

              <div className="docs-code-after">
                <h4>After (Fixed)</h4>
                <pre>
                  <code>{`import React from 'react';

export default function ProductCard({ products }) {
  return (
    <div>
      <h2>"Popular Products"</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="docs-changes-summary">
            <h4>Changes Made:</h4>
            <ul>
              <li>
                HTML entities <code>&amp;quot;</code> → <code>"</code>
              </li>
              <li>
                Added <code>key={`{product.id}`}</code> to list items
              </li>
              <li>Updated tsconfig.json (not shown)</li>
            </ul>
          </div>
        </div>

        <div className="docs-section">
          <h2>Step 6: Test Your Application</h2>

          <p>
            After applying fixes, always test your application to ensure
            everything works correctly:
          </p>

          <div className="docs-code-block">
            <pre>
              <code>{`# Start your development server
npm run dev
# or
yarn dev

# Run your tests
npm test
# or  
yarn test`}</code>
            </pre>
          </div>

          <div className="docs-safety-tip">
            <h4>Safety Tip</h4>
            <p>
              NeuroLint Pro creates automatic backups, but it's always good
              practice to commit your changes to git before and after running
              fixes.
            </p>
          </div>
        </div>

        <div className="docs-section">
          <h2>What's Next?</h2>

          <div className="docs-next-actions">
            <div className="docs-next-action">
              <h4>Learn the Layer System</h4>
              <p>
                Understand what each of the 6 layers does and when to use them
              </p>
              <Link
                href="/docs/getting-started/layer-overview"
                className="docs-action-link"
              >
                Layer Overview
              </Link>
            </div>

            <div className="docs-next-action">
              <h4>Master the CLI</h4>
              <p>
                Explore advanced command-line options and automation features
              </p>
              <Link
                href="/docs/usage-guide/full-orchestration"
                className="docs-action-link"
              >
                CLI Guide
              </Link>
            </div>

            <div className="docs-next-action">
              <h4>Dive Deeper</h4>
              <p>Explore specific layer transformations in detail</p>
              <Link
                href="/docs/layer-reference/layer-1-config"
                className="docs-action-link"
              >
                Layer Reference
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/getting-started/installation"
            className="docs-nav-link prev"
          >
            ← Installation
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link
            href="/docs/getting-started/layer-overview"
            className="docs-nav-link next"
          >
            Layer Overview →
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
          color: #2196f3;
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

        .difficulty-beginner {
          color: #4caf50;
          border-color: rgba(76, 175, 80, 0.3);
          background: rgba(76, 175, 80, 0.1);
        }

        .docs-page-content {
          max-width: 800px;
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

        .docs-section ul {
          margin: 16px 0;
          padding-left: 24px;
        }

        .docs-section li {
          margin-bottom: 8px;
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

        .docs-highlight-box h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: white;
        }

        .docs-highlight-box p {
          margin: 0;
        }

        .docs-checklist {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }

        .docs-checklist-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-checklist-item:last-child {
          margin-bottom: 0;
        }

        .docs-checklist-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #2196f3;
        }

        .docs-code-block {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          margin: 16px 0;
          overflow: hidden;
        }

        .docs-code-block pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
        }

        .docs-code-block code {
          font-family: "Monaco", "Menlo", monospace;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-output-example {
          margin: 24px 0;
        }

        .docs-output-example h4 {
          margin: 0 0 8px 0;
          color: #ff9800;
        }

        .docs-terminal-output {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          margin: 8px 0;
          overflow: hidden;
        }

        .docs-terminal-output pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 12px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-explanation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-explanation-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }

        .docs-explanation-item h4 {
          margin: 0 0 8px 0;
          color: #2196f3;
          font-size: 14px;
        }

        .docs-explanation-item p {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-before-after {
          margin: 32px 0;
        }

        .docs-code-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 16px 0;
        }

        .docs-code-before,
        .docs-code-after {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .docs-code-before h4 {
          margin: 0;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border-bottom: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          font-size: 14px;
        }

        .docs-code-after h4 {
          margin: 0;
          padding: 12px 16px;
          background: rgba(76, 175, 80, 0.1);
          border-bottom: 1px solid rgba(76, 175, 80, 0.2);
          color: #4caf50;
          font-size: 14px;
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
          font-size: 12px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }

        .docs-changes-summary {
          background: rgba(76, 175, 80, 0.05);
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }

        .docs-changes-summary h4 {
          margin: 0 0 8px 0;
          color: #4caf50;
        }

        .docs-changes-summary ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-changes-summary li {
          margin-bottom: 4px;
        }

        .docs-changes-summary code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 12px;
        }

        .docs-safety-tip {
          background: rgba(255, 152, 0, 0.05);
          border: 1px solid rgba(255, 152, 0, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin: 24px 0;
        }

        .docs-safety-tip h4 {
          margin: 0 0 8px 0;
          color: #ff9800;
        }

        .docs-safety-tip p {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-next-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-next-action {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          text-align: center;
        }

        .docs-next-action h4 {
          margin: 0 0 8px 0;
          color: white;
        }

        .docs-next-action p {
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .docs-action-link {
          display: inline-block;
          padding: 10px 20px;
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 8px;
          color: #2196f3;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .docs-action-link:hover {
          background: rgba(33, 150, 243, 0.15);
          border-color: rgba(33, 150, 243, 0.5);
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

        @media (max-width: 768px) {
          .docs-page-header {
            padding: 20px;
          }

          .docs-page-title {
            font-size: 36px;
          }

          .docs-page-content {
            padding: 40px 20px;
          }

          .docs-explanation-grid {
            grid-template-columns: 1fr;
          }

          .docs-code-comparison {
            grid-template-columns: 1fr;
          }

          .docs-next-actions {
            grid-template-columns: 1fr;
          }

          .docs-page-nav {
            padding: 20px;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
