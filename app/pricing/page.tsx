"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import Link from "next/link";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: "one-time" | "month" | "year";
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  enterprise?: boolean;
  ctaText: string;
  badge?: string;
}

export default function PricingPage() {
  const { user, session } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [loading, setLoading] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free Tier",
      price: 0,
      period: "month",
      description: "Perfect for exploring NeuroLint Pro capabilities",
      features: [
        "5 analyses per month",
        "Basic error detection",
        "Web dashboard access",
        "Sample code testing",
        "Community support",
        "Basic insights",
      ],
      limitations: [
        "200KB file size limit",
        "Dry-run mode only",
        "Standard processing speed",
      ],
      ctaText: "Start Free",
      badge: "Always Free",
    },
    {
      id: "developer",
      name: "Developer",
      price: billingPeriod === "monthly" ? 29 : 24,
      originalPrice: billingPeriod === "yearly" ? 29 : undefined,
      period: "month",
      description: "For individual developers working on React projects",
      features: [
        "50 analyses per month",
        "All 6 fixing layers",
        "1MB file size limit",
        "Apply fixes mode",
        "Priority processing",
        "Basic API access (100 req/hour)",
        "Email support",
        "Analytics dashboard",
        "Bulk file processing",
        "Project management",
      ],
      ctaText: "Start Free Trial",
    },
    {
      id: "professional",
      name: "Professional",
      price: billingPeriod === "monthly" ? 99 : 79,
      originalPrice: billingPeriod === "yearly" ? 99 : undefined,
      period: "month",
      description: "For professionals and small teams",
      popular: true,
      features: [
        "500 analyses per month",
        "All premium features",
        "10MB file size limit",
        "Advanced API access (1000 req/hour)",
        "Webhook notifications",
        "CI/CD integrations",
        "Team collaboration (5 members)",
        "Priority support",
        "Custom reporting",
        "Advanced analytics",
        "Git repository integration",
        "Slack/Teams notifications",
      ],
      ctaText: "Start Free Trial",
      badge: "Most Popular",
    },
    {
      id: "team",
      name: "Team",
      price: billingPeriod === "monthly" ? 199 : 159,
      originalPrice: billingPeriod === "yearly" ? 199 : undefined,
      period: "month",
      description: "For growing teams and organizations",
      features: [
        "2000 analyses per month",
        "Everything in Professional",
        "50MB file size limit",
        "Unlimited team members",
        "Advanced webhooks",
        "Custom integrations",
        "SSO authentication",
        "Advanced role management",
        "Dedicated support channel",
        "Custom training session",
        "SLA guarantee",
        "Advanced audit logs",
      ],
      ctaText: "Contact Sales",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 499,
      period: "month",
      description: "For large organizations with custom needs",
      enterprise: true,
      features: [
        "Unlimited analyses",
        "Everything in Team",
        "Unlimited file sizes",
        "On-premise deployment",
        "Custom layer development",
        "White-label solution",
        "Dedicated infrastructure",
        "24/7 phone support",
        "Custom SLA",
        "Professional services",
        "Advanced security features",
        "Compliance certifications",
      ],
      ctaText: "Contact Sales",
      badge: "Custom Solutions",
    },
  ];

  const addOns = [
    {
      name: "Additional Analyses",
      description: "Extra analyses beyond your plan limit",
      price: "$0.10 per analysis",
      icon: "+",
    },
    {
      name: "Priority Processing",
      description: "Jump to the front of the queue",
      price: "$5/month per user",
      icon: "→",
    },
    {
      name: "Custom Integration",
      description: "Bespoke integrations for your workflow",
      price: "Starting at $500",
      icon: "→",
    },
    {
      name: "Professional Training",
      description: "Expert training for your team",
      price: "$200/hour",
      icon: "↗",
    },
  ];

  const handlePlanSelection = async (planId: string) => {
    if (planId === "free") {
      if (!user) {
        window.location.href = "/signup";
      } else {
        window.location.href = "/dashboard";
      }
    } else if (planId === "enterprise" || planId === "team") {
      // Contact sales
      window.location.href =
        "mailto:sales@neurolint.pro?subject=Interest in " +
        plans.find((p) => p.id === planId)?.name +
        " Plan";
    } else {
      // Check if user is authenticated
      if (!user) {
        // Store intended plan and redirect to signup
        localStorage.setItem(
          "intended_plan",
          JSON.stringify({ planId, billingPeriod }),
        );
        window.location.href = "/signup";
        return;
      }

      // Start payment process
      window.location.href = `/checkout?plan=${planId}&billing=${billingPeriod}`;
    }
  };

  const getCurrentPlanBadge = (planId: string) => {
    if (user?.plan === planId) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
          Current Plan
        </span>
      );
    }
    return null;
  };

  const calculateYearlyDiscount = (
    monthlyPrice: number,
    yearlyPrice: number,
  ) => {
    const yearlyTotal = yearlyPrice * 12;
    const monthlyTotal = monthlyPrice * 12;
    const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
    return Math.round(discount);
  };

  return (
    <div className="pricing-page">
      {/* Header */}
      <div className="pricing-header">
        <div className="header-nav">
          <a href="/" className="nav-link">
            ← Back to Home
          </a>
          <a href="/dashboard" className="nav-link">
            Dashboard
          </a>
        </div>

        <div className="header-content">
          <h1>Choose Your Plan</h1>
          <p className="header-description">
            Scale from free exploration to enterprise automation. All plans
            include our complete 6-layer fixing system.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span className={billingPeriod === "monthly" ? "active" : ""}>
              Monthly
            </span>
            <button
              className="toggle-switch"
              onClick={() =>
                setBillingPeriod(
                  billingPeriod === "monthly" ? "yearly" : "monthly",
                )
              }
              aria-label="Toggle billing period"
            >
              <div
                className={`toggle-slider ${billingPeriod === "yearly" ? "yearly" : ""}`}
              />
            </button>
            <span className={billingPeriod === "yearly" ? "active" : ""}>
              Yearly <span className="discount-badge">Save 20%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="pricing-container">
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""} ${plan.enterprise ? "enterprise" : ""}`}
            >
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}

              <div className="plan-header">
                <h3>
                  {plan.name}
                  {getCurrentPlanBadge(plan.id)}
                </h3>
                <div className="plan-price">
                  {plan.price === 0 ? (
                    <span className="price-free">Free</span>
                  ) : (
                    <>
                      <span className="price-currency">$</span>
                      <span className="price-amount">{plan.price}</span>
                      <span className="price-period">/{plan.period}</span>
                      {plan.originalPrice && billingPeriod === "yearly" && (
                        <span className="price-original">
                          ${plan.originalPrice}
                        </span>
                      )}
                    </>
                  )}
                  {billingPeriod === "yearly" && plan.originalPrice && (
                    <div className="yearly-savings">
                      Save{" "}
                      {calculateYearlyDiscount(plan.originalPrice, plan.price)}%
                    </div>
                  )}
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="plan-limitations">
                    <h5>Limitations:</h5>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="limitation-item">
                          <span className="limitation-icon">•</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                className={`plan-cta ${plan.popular ? "popular" : ""} ${plan.enterprise ? "enterprise" : ""} ${
                  user?.plan === plan.id ? "current-plan" : ""
                }`}
                onClick={() => handlePlanSelection(plan.id)}
                disabled={
                  loading === plan.id ||
                  (user?.plan === plan.id && plan.id !== "free")
                }
              >
                {loading === plan.id ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </div>
                ) : user?.plan === plan.id && plan.id !== "free" ? (
                  "Current Plan"
                ) : !user && plan.id !== "free" ? (
                  "Sign Up to Start"
                ) : (
                  plan.ctaText
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="addons-section">
        <h2>Add-ons & Services</h2>
        <p>Enhance your plan with additional services</p>

        <div className="addons-grid">
          {addOns.map((addon, index) => (
            <div key={index} className="addon-card">
              <div className="addon-icon">{addon.icon}</div>
              <h4>{addon.name}</h4>
              <p>{addon.description}</p>
              <div className="addon-price">{addon.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="comparison-section">
        <h2>Feature Comparison</h2>
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="feature-column">Features</div>
            <div className="plan-column">Free</div>
            <div className="plan-column">Developer</div>
            <div className="plan-column">Professional</div>
            <div className="plan-column">Team</div>
            <div className="plan-column">Enterprise</div>
          </div>

          {[
            {
              feature: "Monthly Analyses",
              values: ["5", "50", "500", "2,000", "Unlimited"],
            },
            {
              feature: "File Size Limit",
              values: ["200KB", "1MB", "10MB", "50MB", "Unlimited"],
            },
            {
              feature: "6-Layer Fixing System",
              values: ["✓", "✓", "✓", "✓", "✓"],
            },
            { feature: "Apply Fixes Mode", values: ["×", "✓", "✓", "✓", "✓"] },
            {
              feature: "API Access",
              values: ["×", "Basic", "Advanced", "Premium", "Unlimited"],
            },
            {
              feature: "Team Collaboration",
              values: ["×", "×", "5 members", "Unlimited", "Unlimited"],
            },
            {
              feature: "CI/CD Integrations",
              values: ["×", "×", "✓", "✓", "✓"],
            },
            {
              feature: "Webhooks",
              values: ["×", "×", "✓", "Advanced", "Custom"],
            },
            {
              feature: "Priority Support",
              values: ["×", "Email", "Email", "Dedicated", "24/7 Phone"],
            },
            {
              feature: "SLA Guarantee",
              values: ["×", "×", "×", "✓", "Custom"],
            },
            {
              feature: "On-premise Deployment",
              values: ["×", "×", "×", "×", "✓"],
            },
          ].map((row, index) => (
            <div key={index} className="comparison-row">
              <div className="feature-cell">{row.feature}</div>
              {row.values.map((value, i) => (
                <div
                  key={i}
                  className={`value-cell ${value === "✓" ? "check" : value === "×" ? "cross" : ""}`}
                >
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Can I switch plans anytime?</h4>
            <p>
              Yes, you can upgrade or downgrade your plan at any time. Changes
              take effect immediately, and we'll prorate the charges.
            </p>
          </div>
          <div className="faq-item">
            <h4>What happens if I exceed my analysis limit?</h4>
            <p>
              You can purchase additional analyses at $0.10 each, or upgrade to
              a higher plan. We'll notify you before you reach your limit.
            </p>
          </div>
          <div className="faq-item">
            <h4>Is there a free trial?</h4>
            <p>
              Yes! All paid plans include a 14-day free trial. No credit card
              required for the free tier.
            </p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>
              We accept all major credit cards, PayPal, and bank transfers for
              enterprise accounts.
            </p>
          </div>
          <div className="faq-item">
            <h4>Can I cancel anytime?</h4>
            <p>
              Absolutely. Cancel anytime with no fees. Your plan remains active
              until the end of your billing period.
            </p>
          </div>
          <div className="faq-item">
            <h4>Do you offer refunds?</h4>
            <p>
              Yes, we offer a 30-day money-back guarantee for all paid plans if
              you're not satisfied.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="trust-section">
        <h2>Trusted by Developers Worldwide</h2>
        <div className="trust-stats">
          <div className="stat">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Files Fixed</div>
          </div>
          <div className="stat">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat">
            <div className="stat-number">500+</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-page {
          background: #000000;
          min-height: 100vh;
          color: white;
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        }

        .pricing-header {
          padding: 2rem 1rem 4rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto 3rem;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .header-content h1 {
          font-size: 3rem;
          font-weight: 900;
          margin: 0 0 1rem 0;
          color: #ffffff;
        }

        .header-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }

        .billing-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .billing-toggle span {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .billing-toggle span.active {
          color: #ffffff;
        }

        .toggle-switch {
          position: relative;
          width: 60px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          background: #ffffff;
          border-radius: 12px;
          transition: transform 0.2s ease;
        }

        .toggle-slider.yearly {
          transform: translateX(30px);
        }

        .discount-badge {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pricing-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem 4rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(33, 150, 243, 0.3);
        }

        .pricing-card.popular {
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
        }

        .pricing-card.enterprise {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .plan-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .enterprise .plan-badge {
          background: rgba(255, 255, 255, 0.15);
        }

        .plan-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .plan-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #ffffff;
        }

        .plan-price {
          margin-bottom: 1rem;
        }

        .price-free {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
        }

        .price-currency {
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          vertical-align: top;
        }

        .price-amount {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
        }

        .price-period {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .price-original {
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.2rem;
          margin-left: 0.5rem;
        }

        .yearly-savings {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .plan-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          margin: 0;
        }

        .plan-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
        }

        .feature-item:last-child {
          border-bottom: none;
        }

        .feature-icon {
          color: rgba(255, 255, 255, 0.8);
          font-weight: bold;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .plan-limitations {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .plan-limitations h5 {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .limitation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .limitation-icon {
          color: rgba(255, 255, 255, 0.5);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .plan-cta {
          width: 100%;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: #ffffff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 2rem;
        }

        .plan-cta:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .plan-cta.popular {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .plan-cta.popular:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .plan-cta.enterprise {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .plan-cta.enterprise:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .addons-section,
        .comparison-section,
        .faq-section,
        .trust-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1rem;
          text-align: center;
        }

        .addons-section h2,
        .comparison-section h2,
        .faq-section h2,
        .trust-section h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #ffffff;
        }

        .addons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .addon-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }

        .addon-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .addon-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .addon-card h4 {
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .addon-card p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
        }

        .addon-price {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          font-size: 1rem;
        }

        .comparison-table {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          overflow: hidden;
          margin-top: 2rem;
        }

        .comparison-header {
          display: grid;
          grid-template-columns: 2fr repeat(5, 1fr);
          background: rgba(255, 255, 255, 0.05);
          font-weight: 600;
          color: #ffffff;
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 2fr repeat(5, 1fr);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .comparison-row:last-child {
          border-bottom: none;
        }

        .feature-column,
        .plan-column,
        .feature-cell,
        .value-cell {
          padding: 1rem;
          text-align: left;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .plan-column,
        .value-cell {
          text-align: center;
        }

        .feature-cell {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .value-cell {
          color: rgba(255, 255, 255, 0.8);
        }

        .value-cell.check {
          color: rgba(255, 255, 255, 0.9);
          font-weight: bold;
        }

        .value-cell.cross {
          color: rgba(255, 255, 255, 0.4);
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
          text-align: left;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .faq-item h4 {
          color: #ffffff;
          margin: 0 0 0.75rem 0;
          font-size: 1.1rem;
        }

        .faq-item p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.6;
        }

        .trust-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .stat {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem 1rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .header-content h1 {
            font-size: 2rem;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .comparison-header,
          .comparison-row {
            grid-template-columns: 1fr;
          }

          .plan-column,
          .value-cell {
            display: none;
          }

          .feature-column::after {
            content: " (see desktop for full comparison)";
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
