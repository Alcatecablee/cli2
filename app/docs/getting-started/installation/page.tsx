"use client";

import React from "react";
import Link from "next/link";

export default function InstallationPage() {
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#getting-started">Getting Started</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <span className="docs-breadcrumb-current">
            Installation & Requirements
          </span>
        </div>

        <h1 className="docs-page-title">Installation & Requirements</h1>
        <p className="docs-page-subtitle">
          System requirements and step-by-step installation guide for NeuroLint Pro
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">3 min read</span>
          <span className="docs-meta-item difficulty-beginner">
            Beginner
          </span>
          <span className="docs-meta-item">Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        <div className="docs-highlight-box info">
          <h3>Quick Start</h3>
          <p>
            Get NeuroLint Pro running in under 2 minutes with our CLI tool, web dashboard, or VSCode extension.
          </p>
        </div>

        <div className="docs-section">
          <h2>System Requirements</h2>
          
          <div className="docs-requirements-grid">
            <div className="docs-requirement-item">
              <h4>Operating System</h4>
              <ul>
                <li>macOS 10.15+ (Catalina or later)</li>
                <li>Windows 10/11</li>
                <li>Linux (Ubuntu 18.04+, CentOS 7+)</li>
              </ul>
            </div>

            <div className="docs-requirement-item">
              <h4>Node.js</h4>
              <ul>
                <li>Node.js 16.x or higher</li>
                <li>npm 7+ or yarn 1.22+</li>
                <li>TypeScript 4.0+ (recommended)</li>
              </ul>
            </div>

            <div className="docs-requirement-item">
              <h4>Project Types</h4>
              <ul>
                <li>React 16.8+ applications</li>
                <li>Next.js 12+ projects</li>
                <li>TypeScript or JavaScript</li>
                <li>JSX/TSX files</li>
              </ul>
            </div>

            <div className="docs-requirement-item">
              <h4>Storage</h4>
              <ul>
                <li>50MB for CLI installation</li>
                <li>Additional space for backups</li>
                <li>Temporary space during processing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Installation Options</h2>
          
          <div className="docs-install-options">
            <div className="docs-install-option primary">
              <h3>Option 1: CLI Tool (Recommended)</h3>
              <p>Install the command-line interface for maximum control and automation capabilities.</p>
              
              <div className="docs-code-block">
                <pre><code># Install globally via npm
npm install -g @neurolint/cli

# Or install via yarn
yarn global add @neurolint/cli

# Verify installation
neurolint --version</code></pre>
              </div>
              
              <div className="docs-install-benefits">
                <strong>Benefits:</strong> Full feature access, CI/CD integration, batch processing
              </div>
            </div>

            <div className="docs-install-option">
              <h3>Option 2: Web Dashboard</h3>
              <p>Use our online dashboard for quick analysis and smaller projects.</p>
              
              <div className="docs-code-block">
                <pre><code># No installation required
# Visit: https://neurolint.app/dashboard
# Sign up and start analyzing immediately</code></pre>
              </div>
              
              <div className="docs-install-benefits">
                <strong>Benefits:</strong> No setup, browser-based, real-time collaboration
              </div>
            </div>

            <div className="docs-install-option">
              <h3>Option 3: VSCode Extension</h3>
              <p>Integrate directly into your development environment.</p>
              
              <div className="docs-code-block">
                <pre><code># Install from VSCode Marketplace
# Search for "NeuroLint Pro" in Extensions
# Or install via command palette:
ext install neurolint.neurolint-pro</code></pre>
              </div>
              
              <div className="docs-install-benefits">
                <strong>Benefits:</strong> IDE integration, real-time feedback, inline suggestions
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Verification & First Run</h2>
          
          <div className="docs-verification-steps">
            <div className="docs-step">
              <div className="docs-step-number">1</div>
              <div className="docs-step-content">
                <h4>Verify Installation</h4>
                <div className="docs-code-block">
                  <pre><code>neurolint --version
# Should output: @neurolint/cli v1.x.x</code></pre>
                </div>
              </div>
            </div>

            <div className="docs-step">
              <div className="docs-step-number">2</div>
              <div className="docs-step-content">
                <h4>Check Available Commands</h4>
                <div className="docs-code-block">
                  <pre><code>neurolint --help
# Shows all available commands and options</code></pre>
                </div>
              </div>
            </div>

            <div className="docs-step">
              <div className="docs-step-number">3</div>
              <div className="docs-step-content">
                <h4>Run Health Check</h4>
                <div className="docs-code-block">
                  <pre><code>neurolint health
# Verifies system compatibility and requirements</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>Configuration</h2>
          
          <p>Create a configuration file in your project root for customized behavior:</p>
          
          <div className="docs-code-block">
            <h4>neurolint.config.js</h4>
            <pre><code>module.exports = {
  // Target files and directories
  include: ["src/**/*.{js,jsx,ts,tsx}"],
  exclude: ["node_modules/**", "dist/**"],
  
  // Layer preferences
  layers: {
    enabled: [1, 2, 3, 4, 5, 6], // All layers
    skipOnError: false
  },
  
  // Safety settings
  safety: {
    createBackups: true,
    dryRunFirst: true,
    validateAfter: true
  },
  
  // Output preferences
  output: {
    verbose: false,
    logLevel: "info"
  }
};</code></pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>Troubleshooting Installation</h2>
          
          <div className="docs-troubleshooting">
            <div className="docs-trouble-item">
              <h4>Permission Errors (macOS/Linux)</h4>
              <div className="docs-code-block">
                <pre><code># Use sudo for global installation
sudo npm install -g @neurolint/cli

# Or use npx to run without installing
npx @neurolint/cli analyze ./src</code></pre>
              </div>
            </div>

            <div className="docs-trouble-item">
              <h4>Node.js Version Issues</h4>
              <div className="docs-code-block">
                <pre><code># Check your Node.js version
node --version

# Update Node.js via nvm (recommended)
nvm install 18
nvm use 18</code></pre>
              </div>
            </div>

            <div className="docs-trouble-item">
              <h4>Network/Proxy Issues</h4>
              <div className="docs-code-block">
                <pre><code># Configure npm proxy if needed
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or install offline package
npm install ./neurolint-cli-1.0.0.tgz</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link href="/docs/introduction/vs-traditional-tools" className="docs-nav-link prev">
            ← NeuroLint vs Traditional Tools
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link href="/docs/getting-started/first-fix" className="docs-nav-link next">
            Running Your First Fix →
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

        .docs-requirements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }

        .docs-requirement-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-requirement-item h4 {
          margin: 0 0 12px 0;
          color: #2196f3;
        }

        .docs-requirement-item ul {
          margin: 0;
          padding-left: 20px;
        }

        .docs-install-options {
          display: flex;
          flex-direction: column;
          gap: 32px;
          margin: 32px 0;
        }

        .docs-install-option {
          padding: 32px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .docs-install-option.primary {
          border-color: rgba(33, 150, 243, 0.3);
          background: rgba(33, 150, 243, 0.05);
        }

        .docs-install-option h3 {
          margin: 0 0 12px 0;
          color: white;
        }

        .docs-install-option p {
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .docs-install-benefits {
          margin-top: 16px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .docs-install-benefits strong {
          color: #2196f3;
        }

        .docs-code-block {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          margin: 16px 0;
          overflow: hidden;
        }

        .docs-code-block h4 {
          margin: 0;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          color: #2196f3;
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

        .docs-verification-steps {
          margin: 32px 0;
        }

        .docs-step {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          align-items: flex-start;
        }

        .docs-step-number {
          width: 40px;
          height: 40px;
          background: #2196f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .docs-step-content {
          flex: 1;
        }

        .docs-step-content h4 {
          margin: 0 0 12px 0;
        }

        .docs-troubleshooting {
          margin: 32px 0;
        }

        .docs-trouble-item {
          margin-bottom: 32px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .docs-trouble-item h4 {
          margin: 0 0 16px 0;
          color: #ff9800;
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

          .docs-requirements-grid {
            grid-template-columns: 1fr;
          }

          .docs-step {
            flex-direction: column;
            gap: 12px;
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