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
        "GitHub integration (5 repositories)",
        "Project management",
      ],
      ctaText:
        user && !user.trialUsed
          ? "Start 14-Day Free Trial"
          : "Start Free Trial",
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
        "GitHub integration (25 repositories)",
        "Slack/Teams notifications",
      ],
      ctaText:
        user && !user.trialUsed
          ? "Start 14-Day Free Trial"
          : "Start Free Trial",
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
        "GitHub integration (100 repositories)",
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
        "GitHub integration (unlimited repositories)",
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

  const handlePlanSelection = async (planId: string) => {
    setLoading(planId);

    try {
      if (planId === "free") {
        if (!user) {
          window.location.href = "/signup";
        } else {
          window.location.href = "/dashboard";
        }
        return;
      }

      if (planId === "enterprise" || planId === "team") {
        // Contact sales
        window.location.href = `mailto:sales@neurolint.pro?subject=Interest in ${plans.find((p) => p.id === planId)?.name} Plan`;
        return;
      }

      // For paid plans (developer, professional)
      if (!user) {
        // Store intended plan and redirect to signup
        localStorage.setItem(
          "intended_plan",
          JSON.stringify({ planId, billingPeriod }),
        );
        window.location.href = "/signup";
        return;
      }

      // If user is authenticated, check if they can start a trial
      if (
        user &&
        !user.trialUsed &&
        (planId === "developer" || planId === "professional")
      ) {
        // Eligible for free trial - go to checkout for trial signup
        window.location.href = `/checkout?plan=${planId}&billing=${billingPeriod}`;
      } else {
        // Not eligible for trial or already used - redirect to payment/upgrade
        alert(
          "Trial not available. Please contact support for upgrade options.",
        );
      }
    } finally {
      setLoading(null);
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

  const openDashboard = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="onboarding-section">
      <div className="onboarding-container">
        <div className="onboarding-content">
          <div
            className="onboarding-card"
            style={{ maxWidth: "1200px", width: "100%" }}
          >
            {/* Header Navigation */}
            <div
              className="hero-nav"
              style={{ position: "relative", marginBottom: "2rem" }}
            >
              <div className="nav-left">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F4b35a64a4a2c446c91402681adcf734e%2F485afb87468542eeba91d45b141bab95?format=webp&width=800"
                  alt="NeuroLint Pro"
                  className="nav-logo"
                />
              </div>
              <div className="nav-center">
                <a
                  href="https://neurolint.dev"
                  className="nav-link"
                  aria-label="Go to NeuroLint homepage"
                >
                  Home
                </a>
                <a
                  href="/pricing"
                  className="nav-link"
                  aria-label="View pricing plans"
                  style={{ color: "rgba(33, 150, 243, 0.9)" }}
                >
                  Pricing
                </a>
                <a
                  href="/api-docs"
                  className="nav-link"
                  aria-label="View API documentation"
                >
                  API Docs
                </a>
              </div>
              <div className="nav-right">
                <button
                  className="nav-link dashboard-btn"
                  onClick={openDashboard}
                  aria-label="Access NeuroLint Pro dashboard"
                >
                  Dashboard
                </button>
              </div>
            </div>

            {/* Hero Section */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h1 className="onboarding-title">Choose Your Plan</h1>

              {/* Billing Toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  margin: "2rem 0",
                }}
              >
                <span
                  style={{
                    color:
                      billingPeriod === "monthly"
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.6)",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                >
                  Monthly
                </span>
                <button
                  onClick={() =>
                    setBillingPeriod(
                      billingPeriod === "monthly" ? "yearly" : "monthly",
                    )
                  }
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "30px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  aria-label="Toggle billing period"
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: billingPeriod === "yearly" ? "32px" : "2px",
                      width: "24px",
                      height: "24px",
                      background: "#ffffff",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </button>
                <span
                  style={{
                    color:
                      billingPeriod === "yearly"
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.6)",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Yearly{" "}
                  <span
                    style={{
                      background: "rgba(33, 150, 243, 0.2)",
                      color: "rgba(33, 150, 243, 0.9)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    Save 20%
                  </span>
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
                marginBottom: "3rem",
                alignItems: "start",
              }}
            >
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: plan.popular
                      ? "linear-gradient(135deg, rgba(33, 150, 243, 0.12) 0%, rgba(33, 150, 243, 0.06) 50%, rgba(255, 255, 255, 0.02) 100%)"
                      : plan.enterprise
                        ? "linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)",
                    border: plan.popular
                      ? "1px solid rgba(33, 150, 243, 0.3)"
                      : plan.enterprise
                        ? "1px solid rgba(255, 215, 0, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "20px",
                    padding: "2rem",
                    backdropFilter: "blur(25px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(25px) saturate(1.2)",
                    boxShadow: plan.popular
                      ? "0 12px 40px rgba(33, 150, 243, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                      : "0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Badge and Trial Status */}
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      alignItems: "flex-end",
                    }}
                  >
                    {plan.badge && (
                      <div
                        style={{
                          background: plan.popular
                            ? "rgba(33, 150, 243, 0.2)"
                            : plan.enterprise
                              ? "rgba(255, 215, 0, 0.2)"
                              : "rgba(255, 255, 255, 0.1)",
                          color: plan.popular
                            ? "rgba(33, 150, 243, 0.9)"
                            : plan.enterprise
                              ? "rgba(255, 215, 0, 0.9)"
                              : "#ffffff",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {plan.badge}
                      </div>
                    )}

                    {/* Trial Status Indicator */}
                    {user && user.isOnTrial && user.trialPlan === plan.id && (
                      <div
                        style={{
                          background: "rgba(76, 175, 80, 0.2)",
                          color: "rgba(76, 175, 80, 0.9)",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Trial: {user.trialDaysRemaining} days left
                      </div>
                    )}

                    {/* Trial Available Indicator */}
                    {user &&
                      !user.trialUsed &&
                      (plan.id === "developer" || plan.id === "professional") &&
                      !user.isOnTrial && (
                        <div
                          style={{
                            background: "rgba(33, 150, 243, 0.2)",
                            color: "rgba(33, 150, 243, 0.9)",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          14-Day Free Trial
                        </div>
                      )}
                  </div>

                  {/* Plan Header */}
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "2rem",
                      paddingBottom: "1.5rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          color: "#ffffff",
                          margin: "0",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {plan.name}
                      </h3>
                      {getCurrentPlanBadge(plan.id)}
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "2.75rem",
                            fontWeight: "700",
                            color: "#ffffff",
                            lineHeight: "1",
                          }}
                        >
                          ${plan.price}
                        </span>
                        <span
                          style={{
                            fontSize: "1rem",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "500",
                          }}
                        >
                          /{plan.period}
                        </span>
                        {plan.originalPrice && billingPeriod === "yearly" && (
                          <span
                            style={{
                              fontSize: "1rem",
                              color: "rgba(255, 255, 255, 0.5)",
                              textDecoration: "line-through",
                              marginLeft: "0.5rem",
                            }}
                          >
                            ${plan.originalPrice}
                          </span>
                        )}
                      </div>
                      {billingPeriod === "yearly" && plan.originalPrice && (
                        <div
                          style={{
                            background: "rgba(33, 150, 243, 0.15)",
                            color: "rgba(33, 150, 243, 0.9)",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            marginTop: "0.75rem",
                            display: "inline-block",
                          }}
                        >
                          Save{" "}
                          {calculateYearlyDiscount(
                            plan.originalPrice,
                            plan.price,
                          )}
                          % annually
                        </div>
                      )}
                    </div>

                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "0",
                        lineHeight: "1.5",
                        fontSize: "0.9rem",
                        fontStyle: "italic",
                      }}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div style={{ marginBottom: "2rem" }}>
                    {/* Key Features Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <div
                          key={index}
                          style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "8px",
                            padding: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              background: "rgba(33, 150, 243, 0.2)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                color: "rgba(33, 150, 243, 0.9)",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              ✓
                            </span>
                          </div>
                          <span
                            style={{
                              color: "rgba(255, 255, 255, 0.9)",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              lineHeight: "1.3",
                            }}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Additional Features */}
                    {plan.features.length > 6 && (
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <h6
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            margin: "0 0 0.75rem 0",
                          }}
                        >
                          Additional Features
                        </h6>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {plan.features.slice(6).map((feature, index) => (
                            <span
                              key={index}
                              style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                color: "rgba(255, 255, 255, 0.8)",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Limitations */}
                    {plan.limitations && (
                      <div
                        style={{
                          background: "rgba(255, 193, 7, 0.05)",
                          border: "1px solid rgba(255, 193, 7, 0.15)",
                          borderRadius: "8px",
                          padding: "0.75rem",
                        }}
                      >
                        <h6
                          style={{
                            color: "rgba(255, 193, 7, 0.9)",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            margin: "0 0 0.5rem 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              width: "16px",
                              height: "16px",
                              background: "rgba(255, 193, 7, 0.2)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.6rem",
                            }}
                          >
                            !
                          </span>
                          Plan Limitations
                        </h6>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                          }}
                        >
                          {plan.limitations.map((limitation, index) => (
                            <span
                              key={index}
                              style={{
                                color: "rgba(255, 255, 255, 0.7)",
                                fontSize: "0.75rem",
                                fontWeight: "400",
                                lineHeight: "1.4",
                              }}
                            >
                              {limitation}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className={`onboarding-btn ${plan.popular ? "primary" : "secondary"}`}
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={loading === plan.id || user?.plan === plan.id}
                    style={{
                      width: "100%",
                      opacity:
                        loading === plan.id || user?.plan === plan.id ? 0.7 : 1,
                      cursor:
                        loading === plan.id || user?.plan === plan.id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {loading === plan.id ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            borderTop: "2px solid #ffffff",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                        {user &&
                        !user.trialUsed &&
                        (plan.id === "developer" || plan.id === "professional")
                          ? "Starting Trial..."
                          : "Processing..."}
                      </div>
                    ) : user && user.isOnTrial && user.trialPlan === plan.id ? (
                      `Active Trial (${user.trialDaysRemaining} days left)`
                    ) : user?.plan === plan.id ? (
                      "Current Plan"
                    ) : !user && plan.id !== "free" ? (
                      "Sign Up to Start"
                    ) : user &&
                      !user.trialUsed &&
                      (plan.id === "developer" ||
                        plan.id === "professional") ? (
                      "Start 14-Day Free Trial"
                    ) : (
                      plan.ctaText
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Feature Comparison */}
            <div style={{ marginBottom: "3rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ffffff",
                  margin: "0 0 2rem 0",
                  textAlign: "center",
                }}
              >
                Feature Comparison
              </h2>

              {/* Mobile-First Feature Comparison */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {/* Free Plan */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 1rem 0",
                      textAlign: "center",
                    }}
                  >
                    Free
                  </h3>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Monthly Analyses:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        5
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        File Size Limit:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        200KB
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        6-Layer System:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Apply Fixes:
                      </span>
                      <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>
                        ×
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        API Access:
                      </span>
                      <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>
                        ×
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Team Features:
                      </span>
                      <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>
                        ×
                      </span>
                    </div>
                  </div>
                </div>

                {/* Developer Plan */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 1rem 0",
                      textAlign: "center",
                    }}
                  >
                    Developer
                  </h3>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Monthly Analyses:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        50
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        File Size Limit:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        1MB
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        6-Layer System:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Apply Fixes:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        API Access:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Basic
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Team Features:
                      </span>
                      <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>
                        ×
                      </span>
                    </div>
                  </div>
                </div>

                {/* Professional Plan */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(33, 150, 243, 0.12) 0%, rgba(33, 150, 243, 0.06) 50%, rgba(255, 255, 255, 0.02) 100%)",
                    border: "1px solid rgba(33, 150, 243, 0.3)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(33, 150, 243, 0.2)",
                      color: "rgba(33, 150, 243, 0.9)",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    POPULAR
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 1rem 0",
                      textAlign: "center",
                    }}
                  >
                    Professional
                  </h3>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Monthly Analyses:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        500
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        File Size Limit:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        10MB
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        6-Layer System:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Apply Fixes:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        API Access:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Advanced
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Team Features:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        5 members
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Plan */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 1rem 0",
                      textAlign: "center",
                    }}
                  >
                    Team
                  </h3>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Monthly Analyses:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        2,000
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        File Size Limit:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        50MB
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        6-Layer System:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Apply Fixes:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        API Access:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Premium
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Team Features:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Unlimited
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)",
                    border: "1px solid rgba(255, 215, 0, 0.3)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 1rem 0",
                      textAlign: "center",
                    }}
                  >
                    Enterprise
                  </h3>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Monthly Analyses:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Unlimited
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        File Size Limit:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Unlimited
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        6-Layer System:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Apply Fixes:
                      </span>
                      <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>✓</span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        API Access:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Unlimited
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Team Features:
                      </span>
                      <span style={{ color: "#ffffff", fontWeight: "500" }}>
                        Unlimited
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ffffff",
                  margin: "0 0 2rem 0",
                  textAlign: "center",
                }}
              >
                Frequently Asked Questions
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    Can I switch plans anytime?
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      margin: "0",
                      lineHeight: "1.5",
                      fontSize: "0.875rem",
                    }}
                  >
                    Yes, you can upgrade your plan at any time through your
                    dashboard. Plan changes take effect immediately.{" "}
                    <em>
                      Note: Automatic downgrades and prorating are not yet
                      implemented.
                    </em>
                  </p>
                </div>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    Is there a free trial?
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      margin: "0",
                      lineHeight: "1.5",
                      fontSize: "0.875rem",
                    }}
                  >
                    <strong style={{ color: "rgba(33, 150, 243, 0.9)" }}>
                      Yes!
                    </strong>{" "}
                    All Developer and Professional plans include a{" "}
                    <strong>14-day free trial</strong>. No credit card required
                    to start exploring our professional features. Full access to
                    all plan features during the trial period.
                  </p>
                </div>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    What happens if I exceed my analysis limit?
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      margin: "0",
                      lineHeight: "1.5",
                      fontSize: "0.875rem",
                    }}
                  >
                    Rate limiting is enforced based on your plan. You&apos;ll
                    receive notifications before reaching your limit. Additional
                    analysis purchases at $0.10 each are planned but not yet
                    implemented.
                  </p>
                </div>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    What payment methods do you accept?
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      margin: "0",
                      lineHeight: "1.5",
                      fontSize: "0.875rem",
                    }}
                  >
                    Currently we support PayPal integration. Additional payment
                    methods including credit cards and bank transfers are
                    planned for future releases.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    Can I cancel anytime?
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      margin: "0",
                      lineHeight: "1.5",
                      fontSize: "0.875rem",
                    }}
                  >
                    Yes, you can cancel your subscription at any time through
                    your dashboard. Cancellation functionality is implemented
                    and your access continues until the end of your billing
                    period.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                    }}
                  >
                    Do you offer refunds?
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      margin: "0",
                      lineHeight: "1.5",
                      fontSize: "0.875rem",
                    }}
                  >
                    Refunds are handled on a case-by-case basis. Please contact
                    our support team for assistance. Automated refund processing
                    is planned for future implementation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
