"use client";

import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const texts = [
    "Fix React Errors Instantly",
    "Eliminate HTML Entities",
    "Add Missing Key Props",
    "Secure SSR Hydration",
    "Professional Code Quality",
  ];

  useEffect(() => {
    const typewriterEffect = () => {
      const currentFullText = texts[currentIndex];
      if (currentText.length < currentFullText.length) {
        setCurrentText(currentFullText.slice(0, currentText.length + 1));
      } else {
        setTimeout(() => {
          setCurrentText("");
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
      }
    };

    const timer = setTimeout(typewriterEffect, 100);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, texts]);

  const openPaymentModal = (plan) => {
    alert(`Opening payment modal for ${plan} plan`);
  };

  const loadSampleCode = (sample) => {
    alert(`Loading sample code: ${sample}`);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files) {
      alert(`Uploaded ${files.length} files`);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            NeuroLint Pro
          </a>
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <a href="#pricing">Pricing</a>
            <button
              className="btn"
              onClick={() => openPaymentModal("single")}
              aria-label="Purchase single fix for $49"
            >
              Fix Code Now
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-subtitle">Automated Code Fixing Service</div>
          <h1 className="typewriter" aria-live="polite">
            {currentText}
          </h1>
          <p className="hero-desc">
            Automated multi-layer code fixing for React and Next.js. Resolves
            common issues—HTML entities, missing keys, SSR safety—using a
            validated 6-layer pipeline with automatic rollback.
          </p>
          <div className="hero-actions">
            <button
              className="btn"
              onClick={() => openPaymentModal("single")}
              aria-label="Purchase single fix for $49"
            >
              Fix Code Now - $49
            </button>
            <a href="#demo" className="btn" aria-label="Try free demo">
              Try Free Demo
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2 className="section-title">Why NeuroLint Pro?</h2>
          <p className="section-subtitle">
            Built on battle-tested patterns from IMPLEMENTATION_PATTERNS.md -
            Never corrupts your code
          </p>

          <div className="feature-card">
            <div className="feature-title">Safe Transformations</div>
            <div className="feature-desc">
              Automatic rollback on validation failure. Your code is never
              corrupted - guaranteed.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Smart Detection</div>
            <div className="feature-desc">
              Automatically detects HTML entities, missing key props, SSR
              issues, and accessibility problems.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">6-Layer System</div>
            <div className="feature-desc">
              Config → Patterns → Components → Hydration → Next.js → Testing.
              Each layer builds on the previous safely.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Error Recovery</div>
            <div className="feature-desc">
              Intelligent error categorization with specific recovery
              suggestions for each issue type.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Detailed Reports</div>
            <div className="feature-desc">
              Get comprehensive analysis of issues found, fixes applied, and
              improvement recommendations.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Enterprise Ready</div>
            <div className="feature-desc">
              Processes codebases up to 10,000+ files. Used by React teams at
              scale.
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="demo-section">
          <div className="demo-container">
            <h2 className="section-title">Try NeuroLint Pro Live</h2>
            <p className="section-subtitle">
              Upload your React/Next.js files and see real fixes applied using
              our 6-layer system. Watch as your code transforms before your
              eyes.
            </p>

            <div className="demo-upload-section">
              <div
                className="upload-area"
                onClick={() => document.getElementById("fileInput")?.click()}
                role="button"
                aria-label="Upload files for demo analysis"
              >
                <h3>Upload Your Files</h3>
                <p>Drop React/Next.js files here or click to browse</p>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                  Supports .jsx, .tsx, .js, .ts files
                </p>
                <input
                  type="file"
                  id="fileInput"
                  className="file-input"
                  multiple
                  accept=".jsx,.tsx,.js,.ts"
                  onChange={handleFileUpload}
                  aria-label="Select files for analysis"
                />
              </div>

              <div className="sample-code-section">
                <h3>Try Sample Code</h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: "1.5rem",
                  }}
                >
                  See real fixes on common React issues
                </p>
                <div className="sample-buttons">
                  <button
                    className="sample-btn"
                    onClick={() => loadSampleCode("missing-keys")}
                  >
                    Missing Keys
                  </button>
                  <button
                    className="sample-btn"
                    onClick={() => loadSampleCode("html-entities")}
                  >
                    HTML Entities
                  </button>
                  <button
                    className="sample-btn"
                    onClick={() => loadSampleCode("ssr-issues")}
                  >
                    SSR Issues
                  </button>
                  <button
                    className="sample-btn"
                    onClick={() => loadSampleCode("accessibility")}
                  >
                    Accessibility
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing">
          <div className="pricing-container">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Pay per use or get unlimited access. No hidden fees.
            </p>

            <div className="pricing-grid">
              <div className="pricing-card">
                <h3>Single Fix</h3>
                <div className="price">
                  $49<span className="price-per">per codebase</span>
                </div>
                <ul>
                  <li>Up to 50 files</li>
                  <li>All 6 layers included</li>
                  <li>Detailed analysis report</li>
                  <li>24-hour delivery</li>
                  <li>PayPal/Card payment</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => openPaymentModal("single")}
                  aria-label="Purchase single fix plan"
                >
                  Fix Now
                </button>
              </div>

              <div className="pricing-card popular">
                <div className="popular-badge">Most Popular</div>
                <h3>Professional</h3>
                <div className="price">
                  $149<span className="price-per">per month</span>
                </div>
                <ul>
                  <li>Unlimited fixes</li>
                  <li>Up to 500 files per fix</li>
                  <li>Priority processing</li>
                  <li>API access</li>
                  <li>Team collaboration</li>
                  <li>Cancel anytime</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => openPaymentModal("professional")}
                  aria-label="Subscribe to professional plan"
                >
                  Get Started
                </button>
              </div>

              <div className="pricing-card">
                <h3>Enterprise</h3>
                <div className="price">
                  $499<span className="price-per">per month</span>
                </div>
                <ul>
                  <li>Unlimited everything</li>
                  <li>Custom layer development</li>
                  <li>Dedicated support</li>
                  <li>SLA guarantee</li>
                  <li>On-premise deployment</li>
                  <li>Training included</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => openPaymentModal("enterprise")}
                  aria-label="Contact sales for enterprise plan"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p>
            &copy; 2024 NeuroLint Pro. Professional React/Next.js debugging
            service.
          </p>
          <p>
            Built on proven 6-layer patterns from IMPLEMENTATION_PATTERNS.md
          </p>
        </div>
      </footer>
    </div>
  );
}
