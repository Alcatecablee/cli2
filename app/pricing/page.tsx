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
        "Bulk file processing",
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
        "Git repository integration",
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

  return (
    <div className="onboarding-section">
      <div className="onboarding-container">
        <div className="onboarding-content">
          <div
            className="onboarding-card"
            style={{ maxWidth: "1200px", width: "100%" }}
          >
            {/* Logo and Navigation */}
            <div className="onboarding-logo">
              <Link href="/">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fbcdfdb608d38407b88c1584fe3705961%2F1b38a4a385ed4a0bb404148fae0ce80e?format=webp&width=800"
                  alt="NeuroLint Pro"
                  style={{
                    height: "48px",
                    width: "48px",
                    marginBottom: "1.5rem",
                  }}
                />
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <div></div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link
                  href="/"
                  style={{
                    color: "rgba(33, 150, 243, 0.9)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  style={{
                    color: "rgba(33, 150, 243, 0.9)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Hero Section */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h1 className="onboarding-title">Choose Your Plan</h1>
              <p className="onboarding-subtitle">
                Professional React/Next.js code fixing with our complete 6-layer
                system. Scale from individual projects to enterprise deployment.
              </p>

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
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem",
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

                  <div style={{ marginBottom: "2rem" }}>
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#ffffff",
                        margin: "0 0 0.5rem 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {plan.name}
                      {getCurrentPlanBadge(plan.id)}
                    </h3>

                    <div style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "0.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            color: "#ffffff",
                          }}
                        >
                          ${plan.price}
                        </span>
                        <span
                          style={{
                            fontSize: "1rem",
                            color: "rgba(255, 255, 255, 0.7)",
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
                            fontSize: "0.875rem",
                            color: "rgba(33, 150, 243, 0.9)",
                            marginTop: "0.5rem",
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
                        margin: "0 0 1.5rem 0",
                        lineHeight: "1.5",
                      }}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div style={{ marginBottom: "2rem" }}>
                    <ul
                      style={{ listStyle: "none", padding: "0", margin: "0" }}
                    >
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "0.75rem",
                            color: "rgba(255, 255, 255, 0.9)",
                            fontSize: "0.875rem",
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(33, 150, 243, 0.9)",
                              fontWeight: "600",
                              fontSize: "1rem",
                            }}
                          >
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations && (
                      <div style={{ marginTop: "1.5rem" }}>
                        <h5
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "rgba(255, 255, 255, 0.7)",
                            margin: "0 0 0.75rem 0",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Limitations:
                        </h5>
                        <ul
                          style={{
                            listStyle: "none",
                            padding: "0",
                            margin: "0",
                          }}
                        >
                          {plan.limitations.map((limitation, index) => (
                            <li
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                marginBottom: "0.5rem",
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "0.8rem",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgba(255, 255, 255, 0.4)",
                                  fontSize: "0.875rem",
                                }}
                              >
                                •
                              </span>
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
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

            {/* Trust Section */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "3rem",
                padding: "2rem",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ffffff",
                  margin: "0 0 2rem 0",
                }}
              >
                Trusted by Developers Worldwide
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "rgba(33, 150, 243, 0.9)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    50,000+
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Files Fixed
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "rgba(33, 150, 243, 0.9)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    99.9%
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Uptime
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "rgba(33, 150, 243, 0.9)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    500+
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Teams
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "rgba(33, 150, 243, 0.9)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    24/7
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Support
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons & Services Section */}
            <div style={{ marginBottom: "3rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ffffff",
                  margin: "0 0 1rem 0",
                  textAlign: "center",
                }}
              >
                Add-ons & Services
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: "0 0 2rem 0",
                  textAlign: "center",
                }}
              >
                Enhance your plan with additional services
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Additional Analyses
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      margin: "0 0 1rem 0",
                      fontSize: "0.875rem",
                    }}
                  >
                    Extra analyses beyond your plan limit
                  </p>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "rgba(33, 150, 243, 0.9)",
                    }}
                  >
                    $0.10 per analysis
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Priority Processing
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      margin: "0 0 1rem 0",
                      fontSize: "0.875rem",
                    }}
                  >
                    Jump to the front of the queue
                  </p>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "rgba(33, 150, 243, 0.9)",
                    }}
                  >
                    $5/month per user
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "1rem",
                    }}
                  >
                    🔗
                  </div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Custom Integration
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      margin: "0 0 1rem 0",
                      fontSize: "0.875rem",
                    }}
                  >
                    Bespoke integrations for your workflow
                  </p>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "rgba(33, 150, 243, 0.9)",
                    }}
                  >
                    Starting at $500
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: "0.5rem",
                    }}
                  >
                    ↗
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "1rem",
                    }}
                  >
                    🎓
                  </div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Professional Training
                  </h4>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      margin: "0 0 1rem 0",
                      fontSize: "0.875rem",
                    }}
                  >
                    Expert training for your team
                  </p>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "rgba(33, 150, 243, 0.9)",
                    }}
                  >
                    $200/hour
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison Table */}
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
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  padding: "2rem",
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.875rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "1rem 0.5rem",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: "600",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Features
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "1rem 0.5rem",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: "600",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Free
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "1rem 0.5rem",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: "600",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Developer
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "1rem 0.5rem",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: "600",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Professional
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "1rem 0.5rem",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: "600",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Team
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "1rem 0.5rem",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: "600",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Monthly Analyses",
                        "5",
                        "50",
                        "500",
                        "2,000",
                        "Unlimited",
                      ],
                      [
                        "File Size Limit",
                        "200KB",
                        "1MB",
                        "10MB",
                        "50MB",
                        "Unlimited",
                      ],
                      ["6-Layer Fixing System", "✓", "✓", "✓", "✓", "✓"],
                      ["Apply Fixes Mode", "×", "✓", "✓", "✓", "✓"],
                      [
                        "API Access",
                        "×",
                        "Basic",
                        "Advanced",
                        "Premium",
                        "Unlimited",
                      ],
                      [
                        "Team Collaboration",
                        "×",
                        "×",
                        "5 members",
                        "Unlimited",
                        "Unlimited",
                      ],
                      ["CI/CD Integrations", "×", "×", "✓", "✓", "✓"],
                      ["Webhooks", "×", "×", "✓", "Advanced", "Custom"],
                      [
                        "Priority Support",
                        "×",
                        "Email",
                        "Email",
                        "Dedicated",
                        "24/7 Phone",
                      ],
                      ["SLA Guarantee", "×", "×", "×", "✓", "Custom"],
                      ["On-premise Deployment", "×", "×", "×", "×", "✓"],
                    ].map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            style={{
                              padding: "0.75rem 0.5rem",
                              color:
                                cellIndex === 0
                                  ? "rgba(255, 255, 255, 0.9)"
                                  : "rgba(255, 255, 255, 0.7)",
                              textAlign: cellIndex === 0 ? "left" : "center",
                              borderBottom:
                                index < 10
                                  ? "1px solid rgba(255, 255, 255, 0.08)"
                                  : "none",
                              fontWeight: cellIndex === 0 ? "500" : "400",
                            }}
                          >
                            {cell === "✓" ? (
                              <span style={{ color: "rgba(76, 175, 80, 0.9)" }}>
                                ✓
                              </span>
                            ) : cell === "×" ? (
                              <span
                                style={{ color: "rgba(255, 255, 255, 0.3)" }}
                              >
                                ×
                              </span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    Rate limiting is enforced based on your plan. You'll receive
                    notifications before reaching your limit. Additional
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
