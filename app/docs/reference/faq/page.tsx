"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "technical" | "billing" | "troubleshooting";
}

const faqItems: FAQItem[] = [
  {
    id: "what-is-neurolint",
    question: "What exactly is NeuroLint Pro?",
    answer:
      "NeuroLint Pro is a rule-based code transformation engine specifically designed for React and Next.js applications. It automatically fixes common issues, modernizes outdated patterns, and improves code quality through a sophisticated 6-layer system using deterministic rules rather than AI.",
    category: "general",
  },
  {
    id: "ai-vs-rules",
    question: "Why use rules instead of AI for code transformation?",
    answer:
      "Rules provide 100% predictable and consistent results. Unlike AI, which can be unpredictable and may hallucinate, our rule-based approach ensures the same input always produces the same output. This reliability is crucial for production codebases where consistency and trust are paramount.",
    category: "general",
  },
  {
    id: "safe-to-use",
    question: "Is it safe to run on my production code?",
    answer:
      "Yes, NeuroLint Pro is designed with safety as the top priority. It includes dry-run mode, automatic backups, incremental validation, and rollback capabilities. Each transformation is thoroughly tested and validated before being applied to your code.",
    category: "general",
  },
  {
    id: "supported-frameworks",
    question: "What frameworks and versions are supported?",
    answer:
      "NeuroLint Pro supports React 16.8+, Next.js 12+, TypeScript 4.0+, and JavaScript ES6+. It works with both JavaScript and TypeScript codebases and is optimized for modern React patterns including hooks and functional components.",
    category: "technical",
  },
  {
    id: "layer-system",
    question: "How does the 6-layer system work?",
    answer:
      "The layers execute sequentially: (1) Configuration fixes, (2) Pattern cleanup, (3) Component improvements, (4) Hydration safety, (5) Next.js optimizations, and (6) Testing enhancements. Each layer builds upon the previous one's work, ensuring comprehensive code improvement.",
    category: "technical",
  },
  {
    id: "custom-rules",
    question: "Can I add my own custom transformation rules?",
    answer:
      "Yes, NeuroLint Pro supports custom rules and configurations. You can disable specific transformations, modify existing rules, or add your own patterns through the configuration file. Advanced users can also create custom layer extensions.",
    category: "technical",
  },
  {
    id: "large-codebases",
    question: "How does it handle large codebases?",
    answer:
      "NeuroLint Pro is optimized for performance and can handle codebases of any size. It includes parallel processing, memory management, and incremental processing capabilities. For very large projects, you can process files in batches or target specific directories.",
    category: "technical",
  },
  {
    id: "pricing-model",
    question: "What's the pricing structure?",
    answer:
      "We offer a free tier for individual developers and small projects, with paid plans for teams and enterprises. Pricing is based on usage and features needed. Check our pricing page for current rates and plan comparisons.",
    category: "billing",
  },
  {
    id: "trial-period",
    question: "Is there a free trial?",
    answer:
      "Yes, all paid plans include a 14-day free trial with full access to all features. No credit card required to start the trial. You can also use our free tier indefinitely for smaller projects.",
    category: "billing",
  },
  {
    id: "enterprise-features",
    question: "What enterprise features are available?",
    answer:
      "Enterprise plans include advanced collaboration tools, custom rule development, priority support, on-premise deployment options, advanced analytics, team management, and integration with enterprise development workflows.",
    category: "billing",
  },
  {
    id: "installation-issues",
    question: "I'm having trouble installing NeuroLint Pro",
    answer:
      "Common installation issues are usually related to Node.js version compatibility or permission errors. Ensure you have Node.js 16+ installed and try using 'sudo' for global installations on macOS/Linux. Check our installation guide for detailed troubleshooting steps.",
    category: "troubleshooting",
  },
  {
    id: "transformation-failed",
    question: "What if a transformation fails or breaks my code?",
    answer:
      "NeuroLint Pro includes automatic rollback capabilities. If a transformation fails validation, it's automatically reverted. You can also manually restore from the automatic backups created before any changes. Always use dry-run mode first to preview changes.",
    category: "troubleshooting",
  },
  {
    id: "performance-slow",
    question: "Why is NeuroLint Pro running slowly on my project?",
    answer:
      "Performance can be affected by project size, file complexity, or system resources. Try excluding unnecessary directories (like node_modules), running specific layers instead of all 6, or processing files in smaller batches. Check our performance optimization guide for more tips.",
    category: "troubleshooting",
  },
  {
    id: "ci-cd-integration",
    question: "How do I integrate NeuroLint Pro with my CI/CD pipeline?",
    answer:
      "NeuroLint Pro CLI is designed for CI/CD integration. You can run it in dry-run mode for code quality checks or apply fixes automatically. We provide GitHub Actions, GitLab CI, and Jenkins integration examples in our documentation.",
    category: "technical",
  },
  {
    id: "data-privacy",
    question: "What data does NeuroLint Pro collect?",
    answer:
      "NeuroLint Pro processes your code locally and only sends anonymous usage statistics and error reports (which can be disabled). Your code never leaves your environment unless you explicitly use our cloud features. We're committed to protecting your intellectual property.",
    category: "general",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "technical", label: "Technical" },
    { id: "billing", label: "Billing" },
    { id: "troubleshooting", label: "Troubleshooting" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div className="docs-breadcrumb">
          <Link href="/docs">Docs</Link>
          <span className="docs-breadcrumb-separator">→</span>
          <Link href="/docs#reference">Reference</Link>
          <span className="docs-breadcrumb-separator">���</span>
          <span className="docs-breadcrumb-current">
            Frequently Asked Questions
          </span>
        </div>

        <h1 className="docs-page-title">Frequently Asked Questions</h1>
        <p className="docs-page-subtitle">
          Answers to the most common questions about NeuroLint Pro
        </p>

        <div className="docs-page-meta">
          <span className="docs-meta-item">8 min read</span>
          <span className="docs-meta-item difficulty-beginner">Beginner</span>
          <span className="docs-meta-item">Last updated: Dec 2024</span>
        </div>
      </div>

      <div className="docs-page-content">
        <div className="docs-highlight-box info">
          <h3>Can't find your answer?</h3>
          <p>
            Check our comprehensive documentation or reach out to our support
            team. We're here to help you get the most out of NeuroLint Pro.
          </p>
        </div>

        <div className="docs-section">
          <h2>Browse by Category</h2>

          <div className="docs-category-filter">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`docs-category-btn ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
                <span className="docs-category-count">
                  {category.id === "all"
                    ? faqItems.length
                    : faqItems.filter((item) => item.category === category.id)
                        .length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="docs-section">
          <div className="docs-faq-list">
            {filteredItems.map((item) => (
              <div key={item.id} className="docs-faq-item">
                <button
                  className="docs-faq-question"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={openItems.has(item.id)}
                >
                  <span className="docs-faq-question-text">
                    {item.question}
                  </span>
                  <span
                    className={`docs-faq-toggle ${openItems.has(item.id) ? "open" : ""}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </span>
                </button>
                {openItems.has(item.id) && (
                  <div className="docs-faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="docs-section">
          <h2>Still Need Help?</h2>

          <div className="docs-help-options">
            <div className="docs-help-option">
              <h4>Documentation</h4>
              <p>Browse our comprehensive guides and tutorials</p>
              <Link href="/docs" className="docs-help-link">
                Browse Docs
              </Link>
            </div>

            <div className="docs-help-option">
              <h4>Community Support</h4>
              <p>Get help from other developers and our team</p>
              <a
                href="https://github.com/neurolint/neurolint-pro/discussions"
                className="docs-help-link"
              >
                Join Discussion
              </a>
            </div>

            <div className="docs-help-option">
              <h4>Enterprise Support</h4>
              <p>Priority support for enterprise customers</p>
              <a
                href="mailto:enterprise@neurolint.app"
                className="docs-help-link"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="docs-page-nav">
        <div className="docs-page-nav-item">
          <Link
            href="/docs/troubleshooting/understanding-logs"
            className="docs-nav-link prev"
          >
            ← Understanding Logs
          </Link>
        </div>
        <div className="docs-page-nav-item">
          <Link href="/docs/reference/changelog" className="docs-nav-link next">
            Changelog →
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

        .docs-category-filter {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin: 32px 0;
        }

        .docs-category-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .docs-category-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .docs-category-btn.active {
          background: rgba(33, 150, 243, 0.15);
          border-color: rgba(33, 150, 243, 0.4);
          color: #2196f3;
        }

        .docs-category-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .docs-category-btn.active .docs-category-count {
          background: rgba(33, 150, 243, 0.3);
          color: white;
        }

        .docs-faq-list {
          margin: 32px 0;
        }

        .docs-faq-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .docs-faq-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .docs-faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .docs-faq-question:hover {
          color: #2196f3;
        }

        .docs-faq-question-text {
          flex: 1;
          margin-right: 16px;
        }

        .docs-faq-toggle {
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.2s ease;
          transform: rotate(0deg);
        }

        .docs-faq-toggle.open {
          transform: rotate(180deg);
          color: #2196f3;
        }

        .docs-faq-answer {
          padding: 0 24px 24px;
          animation: fadeIn 0.2s ease;
        }

        .docs-faq-answer p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .docs-help-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }

        .docs-help-option {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          text-align: center;
        }

        .docs-help-option h4 {
          margin: 0 0 8px 0;
          color: white;
        }

        .docs-help-option p {
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .docs-help-link {
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

        .docs-help-link:hover {
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

          .docs-category-filter {
            flex-direction: column;
          }

          .docs-faq-question {
            padding: 16px 20px;
            font-size: 15px;
          }

          .docs-faq-answer {
            padding: 0 20px 20px;
          }

          .docs-help-options {
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
