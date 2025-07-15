"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface CheckoutPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const billing = searchParams.get("billing") || "monthly";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    fullName: "",
    agreeToTerms: false,
  });

  const plans: Record<string, CheckoutPlan> = {
    developer: {
      id: "developer",
      name: "Developer",
      price: billing === "yearly" ? 24 : 29,
      period: billing === "yearly" ? "month (billed yearly)" : "month",
      features: [
        "50 analyses per month",
        "All 6 fixing layers",
        "1MB file size limit",
        "Apply fixes mode",
        "Priority processing",
        "Basic API access (100 req/hour)",
        "Email support",
      ],
    },
    professional: {
      id: "professional",
      name: "Professional",
      price: billing === "yearly" ? 79 : 99,
      period: billing === "yearly" ? "month (billed yearly)" : "month",
      features: [
        "500 analyses per month",
        "All premium features",
        "10MB file size limit",
        "Advanced API access (1000 req/hour)",
        "Webhook notifications",
        "CI/CD integrations",
        "Team collaboration (5 members)",
        "Priority support",
      ],
    },
  };

  const selectedPlan = planId ? plans[planId] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Create a customer in your payment processor (Stripe, PayPal, etc.)
      // 2. Set up the subscription
      // 3. Handle payment confirmation
      // 4. Create user account in your system
      // 5. Redirect to dashboard with active subscription

      // For demo purposes, redirect to dashboard
      alert(
        `Success! Welcome to NeuroLint Pro ${selectedPlan.name} plan. Redirecting to dashboard...`,
      );
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!selectedPlan) {
    return (
      <div className="checkout-error">
        <h1>Invalid Plan</h1>
        <p>
          The selected plan was not found. Please go back and select a valid
          plan.
        </p>
        <a href="/pricing" className="btn">
          ← Back to Pricing
        </a>

        <style jsx>{`
          .checkout-error {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            text-align: center;
            padding: 2rem;
          }
          .btn {
            background: #2196f3;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 1rem;
            display: inline-block;
          }
        `}</style>
      </div>
    );
  }

  const yearlyDiscount = billing === "yearly" ? 20 : 0;
  const monthlyPrice =
    billing === "yearly"
      ? Math.round(selectedPlan.price / 0.8)
      : selectedPlan.price;
  const yearlyTotal = selectedPlan.price * 12;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <a href="/pricing" className="back-link">
            ← Back to Pricing
          </a>
          <h1>Complete Your Purchase</h1>
          <p>Start your NeuroLint Pro journey today</p>
        </div>

        <div className="checkout-content">
          {/* Plan Summary */}
          <div className="plan-summary">
            <h2>Order Summary</h2>
            <div className="plan-details">
              <div className="plan-info">
                <h3>{selectedPlan.name} Plan</h3>
                <p>Perfect for growing your React development workflow</p>
              </div>

              <div className="plan-pricing">
                <div className="price-breakdown">
                  {billing === "yearly" && (
                    <div className="price-line original">
                      <span>Monthly billing:</span>
                      <span>${monthlyPrice}/month</span>
                    </div>
                  )}
                  <div className="price-line current">
                    <span>
                      {billing === "yearly"
                        ? "Yearly billing:"
                        : "Monthly billing:"}
                    </span>
                    <span className="price-amount">
                      ${selectedPlan.price}/{selectedPlan.period}
                    </span>
                  </div>
                  {billing === "yearly" && (
                    <div className="savings">
                      <span>
                        You save ${Math.round(monthlyPrice * 12 - yearlyTotal)}{" "}
                        per year ({yearlyDiscount}% off)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="plan-features-summary">
                <h4>What's included:</h4>
                <ul>
                  {selectedPlan.features.slice(0, 4).map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                  {selectedPlan.features.length > 4 && (
                    <li>+ {selectedPlan.features.length - 4} more features</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="guarantee">
              <div className="guarantee-icon">🛡️</div>
              <div>
                <strong>30-Day Money-Back Guarantee</strong>
                <p>Not satisfied? Get a full refund within 30 days.</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form">
            <h2>Account Information</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
                <small>This will be your login email for NeuroLint Pro</small>
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company (Optional)</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your Company"
                />
              </div>

              <div className="form-group">
                <div className="trial-info">
                  <h3>🎉 14-Day Free Trial</h3>
                  <p>
                    Start with a completely free 14-day trial. No payment
                    required until your trial ends.
                  </p>
                  <ul>
                    <li>✓ Full access to all {selectedPlan.name} features</li>
                    <li>✓ Cancel anytime during trial with no charges</li>
                    <li>✓ Automatic billing starts after trial ends</li>
                  </ul>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="checkmark"></span>I agree to the{" "}
                  <a href="/terms" target="_blank">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className={`submit-btn ${loading ? "loading" : ""}`}
                disabled={loading || !formData.agreeToTerms}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  `Start Free Trial`
                )}
              </button>

              <div className="payment-info">
                <p>🔒 Secure checkout powered by Stripe</p>
                <p>Payment details will be collected after your free trial</p>
              </div>
            </form>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <span>🔒</span>
            <span>SSL Encrypted</span>
          </div>
          <div className="trust-item">
            <span>💳</span>
            <span>Secure Payments</span>
          </div>
          <div className="trust-item">
            <span>↩️</span>
            <span>30-Day Refund</span>
          </div>
          <div className="trust-item">
            <span>🏆</span>
            <span>Trusted by 500+ Teams</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: white;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .checkout-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .back-link {
          color: #2196f3;
          text-decoration: none;
          margin-bottom: 1rem;
          display: inline-block;
          transition: opacity 0.2s ease;
        }

        .back-link:hover {
          opacity: 0.8;
        }

        .checkout-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .checkout-header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .plan-summary,
        .checkout-form {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .plan-summary h2,
        .checkout-form h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
          color: #ffffff;
        }

        .plan-details {
          margin-bottom: 2rem;
        }

        .plan-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #2196f3;
        }

        .plan-info p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1rem 0;
        }

        .price-breakdown {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .price-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .price-line.original {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: line-through;
          font-size: 0.9rem;
        }

        .price-line.current {
          font-weight: 600;
          color: #ffffff;
        }

        .price-amount {
          color: #2196f3;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .savings {
          color: #4caf50;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .plan-features-summary h4 {
          color: #ffffff;
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
        }

        .plan-features-summary ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .plan-features-summary li {
          color: rgba(255, 255, 255, 0.8);
          padding: 0.25rem 0;
          font-size: 0.9rem;
        }

        .guarantee {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 8px;
          padding: 1rem;
        }

        .guarantee-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .guarantee strong {
          color: #4caf50;
          display: block;
          margin-bottom: 0.25rem;
        }

        .guarantee p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #ffffff;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #ffffff;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #2196f3;
        }

        .form-group small {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          margin-top: 0.25rem;
          display: block;
        }

        .trial-info {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .trial-info h3 {
          color: #2196f3;
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .trial-info p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.75rem 0;
        }

        .trial-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .trial-info li {
          color: rgba(255, 255, 255, 0.8);
          padding: 0.25rem 0;
          font-size: 0.9rem;
        }

        .checkbox-group {
          margin-bottom: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          line-height: 1.5;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          margin: 0;
        }

        .checkbox-label a {
          color: #2196f3;
          text-decoration: none;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #2196f3, #1976d2);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1976d2, #1565c0);
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .payment-info {
          text-align: center;
          margin-top: 1rem;
        }

        .payment-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          margin: 0.25rem 0;
        }

        .trust-indicators {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .checkout-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .checkout-header h1 {
            font-size: 2rem;
          }

          .trust-indicators {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
