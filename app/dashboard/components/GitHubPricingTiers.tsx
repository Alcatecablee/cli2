"use client";

import React from "react";
import { useAuth } from "../../../lib/auth-context";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  repositoryLimit: string;
  fileLimit: string;
  scanCredits: string;
  support: string;
  highlighted?: boolean;
}

interface GitHubPricingTiersProps {
  onUpgrade: (tierId: string) => void;
  onClose: () => void;
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for trying out GitHub integration",
    features: [
      "Connect 1 GitHub repository",
      "10 files per scan",
      "Basic issue detection",
      "Community support",
      "Export scan results",
    ],
    repositoryLimit: "1 repository",
    fileLimit: "10 files per scan",
    scanCredits: "10 credits/month",
    support: "Community",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "For developers with multiple repositories",
    features: [
      "Connect up to 50 repositories",
      "Unlimited files per scan",
      "Advanced issue detection",
      "Layer-specific analysis",
      "Priority support",
      "Scheduled scans",
      "Team collaboration",
      "Advanced export options",
    ],
    repositoryLimit: "50 repositories",
    fileLimit: "Unlimited files",
    scanCredits: "1,000 credits/month",
    support: "Email & Chat",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For teams and organizations",
    features: [
      "Unlimited repositories",
      "Unlimited files per scan",
      "Custom analysis rules",
      "Advanced integrations",
      "Dedicated support",
      "SSO integration",
      "Advanced security",
      "Custom reporting",
      "API access",
      "White-label options",
    ],
    repositoryLimit: "Unlimited",
    fileLimit: "Unlimited files",
    scanCredits: "Unlimited credits",
    support: "Dedicated Account Manager",
  },
];

export default function GitHubPricingTiers({
  onUpgrade,
  onClose,
}: GitHubPricingTiersProps) {
  const { user } = useAuth();

  const getCurrentPlanFeatures = () => {
    const currentTier =
      pricingTiers.find((tier) => tier.id === user?.plan) || pricingTiers[0];
    return currentTier;
  };

  const isCurrentPlan = (tierId: string) => {
    return user?.plan === tierId || (tierId === "free" && !user?.plan);
  };

  const getUpgradeButtonText = (tier: PricingTier) => {
    if (isCurrentPlan(tier.id)) {
      return "Current Plan";
    }
    if (tier.id === "free") {
      return "Downgrade";
    }
    return `Upgrade to ${tier.name}`;
  };

  return (
    <div className="pricing-overlay">
      <div className="pricing-modal">
        <div className="pricing-header">
          <h2>GitHub Integration Pricing</h2>
          <p>Choose the perfect plan for your repository scanning needs</p>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="current-plan-info">
          <h3>Your Current Plan: {getCurrentPlanFeatures().name}</h3>
          <div className="current-limits">
            <span>📁 {getCurrentPlanFeatures().repositoryLimit}</span>
            <span>📄 {getCurrentPlanFeatures().fileLimit}</span>
            <span>⚡ {getCurrentPlanFeatures().scanCredits}</span>
          </div>
        </div>

        <div className="pricing-grid">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`pricing-card ${tier.highlighted ? "highlighted" : ""} ${
                isCurrentPlan(tier.id) ? "current" : ""
              }`}
            >
              {tier.highlighted && (
                <div className="popular-badge">Most Popular</div>
              )}

              <div className="tier-header">
                <h3>{tier.name}</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{tier.price}</span>
                  <span className="period">/{tier.period}</span>
                </div>
                <p className="description">{tier.description}</p>
              </div>

              <div className="tier-limits">
                <div className="limit-item">
                  <span className="limit-icon">📁</span>
                  <span>{tier.repositoryLimit}</span>
                </div>
                <div className="limit-item">
                  <span className="limit-icon">📄</span>
                  <span>{tier.fileLimit}</span>
                </div>
                <div className="limit-item">
                  <span className="limit-icon">⚡</span>
                  <span>{tier.scanCredits}</span>
                </div>
                <div className="limit-item">
                  <span className="limit-icon">🎧</span>
                  <span>{tier.support}</span>
                </div>
              </div>

              <div className="features-list">
                <h4>Features</h4>
                <ul>
                  {tier.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`upgrade-btn ${isCurrentPlan(tier.id) ? "current" : ""}`}
                onClick={() => onUpgrade(tier.id)}
                disabled={isCurrentPlan(tier.id)}
              >
                {getUpgradeButtonText(tier)}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <h3>Why Upgrade?</h3>
          <div className="upgrade-benefits">
            <div className="benefit">
              <span className="benefit-icon">🚀</span>
              <div>
                <h4>Scale Your Code Quality</h4>
                <p>
                  Scan unlimited repositories and ensure consistent quality
                  across all your projects
                </p>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-icon">⏰</span>
              <div>
                <h4>Save Development Time</h4>
                <p>
                  Automated scanning catches issues early, reducing debugging
                  time and technical debt
                </p>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-icon">👥</span>
              <div>
                <h4>Team Collaboration</h4>
                <p>
                  Share scan results with your team and maintain code standards
                  across all developers
                </p>
              </div>
            </div>
          </div>

          <div className="pricing-notes">
            <p>
              <strong>💡 Pro Tip:</strong> Most developers with 20+ repositories
              save 5-10 hours per week using automated scanning vs manual code
              reviews.
            </p>
            <p>
              All plans include a 14-day money-back guarantee. Cancel anytime
              with one click.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          overflow-y: auto;
        }

        .pricing-modal {
          background: rgba(20, 20, 30, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 32px;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }

        .pricing-header h2 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .pricing-header p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 1.1rem;
        }

        .close-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.8);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 1.2rem;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: scale(1.1);
        }

        .current-plan-info {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
          text-align: center;
        }

        .current-plan-info h3 {
          color: #ffffff;
          margin: 0 0 12px 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .current-limits {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .current-limits span {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .pricing-card.highlighted {
          border-color: rgba(33, 150, 243, 0.5);
          background: rgba(33, 150, 243, 0.08);
          transform: scale(1.02);
        }

        .pricing-card.current {
          border-color: rgba(76, 175, 80, 0.5);
          background: rgba(76, 175, 80, 0.08);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.9),
            rgba(76, 175, 80, 0.9)
          );
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tier-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .tier-header h3 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          margin-bottom: 8px;
        }

        .currency {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.2rem;
          font-weight: 500;
        }

        .amount {
          color: #ffffff;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 4px;
        }

        .period {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          font-weight: 500;
        }

        .description {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 0.95rem;
        }

        .tier-limits {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .limit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        .limit-item:last-child {
          margin-bottom: 0;
        }

        .limit-icon {
          font-size: 1.1rem;
          width: 20px;
        }

        .features-list h4 {
          color: #ffffff;
          margin: 0 0 12px 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .features-list ul {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
        }

        .features-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .feature-check {
          color: #4caf50;
          font-weight: 600;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .upgrade-btn {
          width: 100%;
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3),
            rgba(76, 175, 80, 0.3)
          );
          border: 1px solid rgba(33, 150, 243, 0.5);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .upgrade-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
        }

        .upgrade-btn.current {
          background: rgba(76, 175, 80, 0.2);
          border-color: rgba(76, 175, 80, 0.5);
          cursor: not-allowed;
          opacity: 0.8;
        }

        .upgrade-btn:disabled {
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .pricing-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 32px;
        }

        .pricing-footer h3 {
          color: #ffffff;
          text-align: center;
          margin: 0 0 24px 0;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .upgrade-benefits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .benefit {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .benefit-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .benefit h4 {
          color: #ffffff;
          margin: 0 0 4px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .benefit p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .pricing-notes {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .pricing-notes p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 12px 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .pricing-notes p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .pricing-modal {
            padding: 20px;
            margin: 10px;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.highlighted {
            transform: none;
          }

          .current-limits {
            flex-direction: column;
            gap: 8px;
            align-items: center;
          }

          .upgrade-benefits {
            grid-template-columns: 1fr;
          }

          .pricing-header h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
