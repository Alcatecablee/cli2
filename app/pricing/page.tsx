"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import Link from "next/link";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: "month";
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
      id: "professional",
      name: "Professional",
      price: billingPeriod === "monthly" ? 99 : 79,
      originalPrice: billingPeriod === "yearly" ? 99 : undefined,
      period: "month",
      description:
        "Perfect for professional developers and small teams working on React/Next.js projects",
      popular: true,
      features: [
        "500 analyses per month",
        "All 6 fixing layers included",
        "10MB file size limit",
        "Apply fixes mode enabled",
        "Advanced API access (1000 req/hour)",
        "Webhook notifications",
        "CI/CD integrations",
        "Team collaboration (5 members)",
        "Priority email support",
        "Custom reporting dashboard",
        "Advanced analytics",
        "Git repository integration",
      ],
      ctaText: "Start Free Trial",
      badge: "Most Popular",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 499,
      period: "month",
      description:
        "Comprehensive solution for large organizations with custom requirements and dedicated support",
      enterprise: true,
      features: [
        "Unlimited analyses",
        "Everything in Professional",
        "Unlimited file sizes",
        "On-premise deployment option",
        "Custom layer development",
        "White-label solution",
        "Dedicated infrastructure",
        "24/7 phone support",
        "Custom SLA agreements",
        "Professional services",
        "Advanced security features",
        "Compliance certifications",
        "Dedicated account manager",
        "Custom training sessions",
      ],
      ctaText: "Contact Sales",
      badge: "Custom Solutions",
    },
  ];

  const handlePlanSelection = async (planId: string) => {
    if (planId === "enterprise") {
      // Contact sales
      window.location.href = `mailto:sales@neurolint.pro?subject=Interest in ${plans.find((p) => p.id === planId)?.name} Plan`;
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
      return <span className="current-plan-badge">Current Plan</span>;
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
      {/* Navigation */}
      <nav className="pricing-nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4b35a64a4a2c446c91402681adcf734e%2F485afb87468542eeba91d45b141bab95?format=webp&width=800"
              alt="NeuroLint Pro"
              className="logo-img"
            />
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="hero-container">
          <h1 className="hero-title">Choose Your Plan</h1>
          <p className="hero-subtitle">
            Professional React/Next.js code fixing with our complete 6-layer
            system. Scale from individual projects to enterprise deployment.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span
              className={`billing-option ${billingPeriod === "monthly" ? "active" : ""}`}
            >
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
            <span
              className={`billing-option ${billingPeriod === "yearly" ? "active" : ""}`}
            >
              Yearly <span className="savings-badge">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.popular ? "popular" : ""} ${plan.enterprise ? "enterprise" : ""}`}
              >
                {plan.badge && <div className="plan-badge">{plan.badge}</div>}

                <div className="plan-header">
                  <h3 className="plan-name">
                    {plan.name}
                    {getCurrentPlanBadge(plan.id)}
                  </h3>

                  <div className="plan-pricing">
                    <div className="price-display">
                      <span className="price-currency">$</span>
                      <span className="price-amount">{plan.price}</span>
                      <span className="price-period">/{plan.period}</span>
                      {plan.originalPrice && billingPeriod === "yearly" && (
                        <span className="price-original">
                          ${plan.originalPrice}
                        </span>
                      )}
                    </div>
                    {billingPeriod === "yearly" && plan.originalPrice && (
                      <div className="yearly-savings">
                        Save{" "}
                        {calculateYearlyDiscount(
                          plan.originalPrice,
                          plan.price,
                        )}
                        % annually
                      </div>
                    )}
                  </div>

                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="plan-features">
                  <ul className="features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-check">✓</span>
                        <span className="feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`plan-cta btn ${plan.popular ? "primary" : "secondary"} ${
                    user?.plan === plan.id ? "current" : ""
                  }`}
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={loading === plan.id || user?.plan === plan.id}
                >
                  {loading === plan.id ? (
                    <div className="btn-loading">
                      <div className="loading-spinner"></div>
                      Processing...
                    </div>
                  ) : user?.plan === plan.id ? (
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
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="trust-container">
          <h2 className="trust-title">Trusted by Developers Worldwide</h2>
          <div className="trust-stats">
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Files Fixed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Teams</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4 className="faq-question">Can I switch plans anytime?</h4>
              <p className="faq-answer">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate the charges
                accordingly.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Is there a free trial?</h4>
              <p className="faq-answer">
                Yes! All paid plans include a 14-day free trial. No credit card
                required to start exploring our professional features.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">
                What happens if I exceed my analysis limit?
              </h4>
              <p className="faq-answer">
                You can purchase additional analyses at $0.10 each, or upgrade
                to a higher plan. We'll notify you before you reach your limit.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Do you offer refunds?</h4>
              <p className="faq-answer">
                Yes, we offer a 30-day money-back guarantee for all paid plans
                if you're not completely satisfied with our service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
