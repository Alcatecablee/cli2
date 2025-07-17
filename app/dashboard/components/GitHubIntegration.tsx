"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import GitHubRepositoryScanner from "./GitHubRepositoryScanner";
import GitHubPricingTiers from "./GitHubPricingTiers";

interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  size: number;
  defaultBranch: string;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  likelyHasReactFiles: boolean;
}

interface GitHubIntegration {
  githubUserId: number;
  githubUsername: string;
  githubEmail: string;
  avatar: string;
  name: string;
  publicRepos: number;
  privateRepos: number;
  connectedAt: string;
}

interface ScanResult {
  repositoryId: number;
  repositoryName: string;
  branch: string;
  totalFiles: number;
  files: any[];
  estimatedScanTime: number;
  scanCost: { credits: number; cost: number };
}

interface GitHubIntegrationState {
  isConnected: boolean;
  isConnecting: boolean;
  integration: GitHubIntegration | null;
  repositories: GitHubRepository[];
  selectedRepo: GitHubRepository | null;
  scanResult: ScanResult | null;
  loading: boolean;
  error: string | null;
  showPricingModal: boolean;
  showScanner: boolean;
  scannerFiles: any[];
  accessToken: string | null;
}

export default function GitHubIntegration() {
  const { user, session } = useAuth();
  const [state, setState] = useState<GitHubIntegrationState>({
    isConnected: false,
    isConnecting: false,
    integration: null,
    repositories: [],
    selectedRepo: null,
    scanResult: null,
    loading: false,
    error: null,
    showPricingModal: false,
    showScanner: false,
    scannerFiles: [],
    accessToken: null,
  });

  const handleConnectGitHub = async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const response = await fetch("/api/integrations/github/auth", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const data = await response.json();

      if (data.authUrl) {
        // Open GitHub OAuth in popup
        const popup = window.open(
          data.authUrl,
          "github-auth",
          "width=600,height=700,scrollbars=yes,resizable=yes",
        );

        // Listen for popup completion
        const pollTimer = setInterval(() => {
          try {
            if (popup?.closed) {
              clearInterval(pollTimer);
              setState((prev) => ({ ...prev, isConnecting: false }));
              // Check if connection was successful
              checkGitHubConnection();
            }
          } catch (error) {
            // Cross-origin error when popup redirects - this is expected
          }
        }, 1000);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to initiate GitHub connection",
      }));
    }
  };

  const checkGitHubConnection = async () => {
    // In a real app, you'd check the database for stored GitHub integration
    // For demo, we'll simulate a successful connection
    setState((prev) => ({
      ...prev,
      isConnected: true,
      integration: {
        githubUserId: 123456,
        githubUsername: "demo-user",
        githubEmail: user?.email || "",
        avatar: "https://github.com/github.png",
        name: user?.firstName + " " + user?.lastName || "Demo User",
        publicRepos: 25,
        privateRepos: 12,
        connectedAt: new Date().toISOString(),
      },
    }));
  };

  const fetchRepositories = async () => {
    if (!state.accessToken) {
      setState((prev) => ({
        ...prev,
        error: "GitHub access token not available",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/integrations/github/repositories", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "X-GitHub-Token": state.accessToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setState((prev) => ({
          ...prev,
          repositories: data.repositories,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: data.error || "Failed to fetch repositories",
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to fetch repositories",
        loading: false,
      }));
    }
  };

  const analyzeRepository = async (repo: GitHubRepository) => {
    if (!state.accessToken) {
      setState((prev) => ({
        ...prev,
        error: "GitHub access token not available",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      selectedRepo: repo,
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch(
        "/api/integrations/github/repositories/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
            "X-GitHub-Token": state.accessToken,
          },
          body: JSON.stringify({
            repositoryId: repo.id,
            repositoryName: repo.fullName,
            branch: repo.defaultBranch,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setState((prev) => ({
          ...prev,
          scanResult: data,
          loading: false,
        }));

        // Check if user needs to upgrade for this scan
        if (data.scanCost.credits > 10 && user?.plan === "free") {
          setState((prev) => ({ ...prev, showPricingModal: true }));
        } else {
          // Show scanner for this repository
          setState((prev) => ({
            ...prev,
            showScanner: true,
            scannerFiles: data.files,
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          error: data.error || "Failed to analyze repository",
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to analyze repository",
        loading: false,
      }));
    }
  };

  const getRepositoryIcon = (language: string | null, isPrivate: boolean) => {
    if (isPrivate) return "🔒";
    switch (language?.toLowerCase()) {
      case "typescript":
        return "🔷";
      case "javascript":
        return "🟨";
      case "jsx":
        return "⚛️";
      case "tsx":
        return "⚛️";
      default:
        return "📁";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getPlanLimitMessage = () => {
    const limits = {
      free: "10 files per scan",
      pro: "Unlimited files, 50 repositories",
      enterprise: "Unlimited everything",
    };
    return limits[user?.plan as keyof typeof limits] || limits.free;
  };

  const handleScanComplete = (results: any[]) => {
    setState((prev) => ({ ...prev, showScanner: false }));
    // Here you could save results to history, show summary, etc.
    console.log("Scan completed with results:", results);
  };

  const handleUpgrade = (tierId: string) => {
    setState((prev) => ({ ...prev, showPricingModal: false }));
    // Here you would integrate with your payment system
    console.log("Upgrading to tier:", tierId);
    // For demo, simulate an upgrade
    if (tierId !== "free") {
      alert(
        `Upgrade to ${tierId} plan initiated! You'll be redirected to checkout.`,
      );
    }
  };

  // Demo data for when not connected
  const demoRepositories: GitHubRepository[] = [
    {
      id: 1,
      name: "react-dashboard",
      fullName: "demo-user/react-dashboard",
      private: false,
      description: "Modern React dashboard with TypeScript",
      htmlUrl: "https://github.com/demo-user/react-dashboard",
      language: "TypeScript",
      size: 2048,
      defaultBranch: "main",
      updatedAt: "2024-01-15T10:30:00Z",
      owner: { login: "demo-user", avatarUrl: "https://github.com/github.png" },
      likelyHasReactFiles: true,
    },
    {
      id: 2,
      name: "nextjs-ecommerce",
      fullName: "demo-user/nextjs-ecommerce",
      private: true,
      description: "E-commerce platform built with Next.js",
      htmlUrl: "https://github.com/demo-user/nextjs-ecommerce",
      language: "JavaScript",
      size: 5120,
      defaultBranch: "main",
      updatedAt: "2024-01-10T14:20:00Z",
      owner: { login: "demo-user", avatarUrl: "https://github.com/github.png" },
      likelyHasReactFiles: true,
    },
  ];

  return (
    <div className="github-integration">
      <div className="integration-header">
        <h3>GitHub Repository Scanner</h3>
        <p className="integration-description">
          Connect your GitHub account to scan and fix React/Next.js
          repositories. Perfect for maintaining code quality across all your
          projects.
        </p>
      </div>

      {!state.isConnected ? (
        <div className="connection-section">
          <div className="connection-card">
            <div className="connection-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <h4>Connect GitHub Account</h4>
            <p>
              Scan your repositories for React/Next.js issues and get automated
              fixes. Works with both public and private repositories.
            </p>
            <div className="plan-info">
              <span className="plan-badge">
                {user?.plan?.toUpperCase() || "FREE"} PLAN
              </span>
              <span className="plan-limit">{getPlanLimitMessage()}</span>
            </div>
            <button
              className="connect-btn"
              onClick={handleConnectGitHub}
              disabled={state.isConnecting}
            >
              {state.isConnecting ? "Connecting..." : "Connect GitHub"}
            </button>
          </div>

          <div className="demo-section">
            <h4>Preview: Your Repositories</h4>
            <p>Here's what you'll see after connecting:</p>
            <div className="repositories-grid">
              {demoRepositories.map((repo) => (
                <div key={repo.id} className="repository-card demo">
                  <div className="repo-header">
                    <span className="repo-icon">
                      {getRepositoryIcon(repo.language, repo.private)}
                    </span>
                    <div className="repo-info">
                      <h5>{repo.name}</h5>
                      <p>{repo.description}</p>
                    </div>
                    <div className="repo-meta">
                      <span className="language">{repo.language}</span>
                      <span className="size">
                        {formatFileSize(repo.size * 1024)}
                      </span>
                    </div>
                  </div>
                  <button className="scan-btn demo" disabled>
                    Analyze Repository
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="connected-section">
          <div className="connection-status">
            <div className="user-info">
              <img
                src={state.integration?.avatar}
                alt="GitHub Avatar"
                className="avatar"
              />
              <div className="user-details">
                <h4>@{state.integration?.githubUsername}</h4>
                <p>{state.integration?.name}</p>
                <div className="repo-stats">
                  <span>{state.integration?.publicRepos} public</span>
                  <span>{state.integration?.privateRepos} private</span>
                </div>
              </div>
            </div>
            <button
              className="refresh-btn"
              onClick={fetchRepositories}
              disabled={state.loading}
            >
              {state.loading ? "Loading..." : "Refresh Repositories"}
            </button>
          </div>

          {state.repositories.length > 0 && (
            <div className="repositories-section">
              <h4>Your Repositories</h4>
              <div className="repositories-grid">
                {state.repositories
                  .filter((repo) => repo.likelyHasReactFiles)
                  .map((repo) => (
                    <div key={repo.id} className="repository-card">
                      <div className="repo-header">
                        <span className="repo-icon">
                          {getRepositoryIcon(repo.language, repo.private)}
                        </span>
                        <div className="repo-info">
                          <h5>{repo.name}</h5>
                          <p>{repo.description || "No description"}</p>
                        </div>
                        <div className="repo-meta">
                          <span className="language">{repo.language}</span>
                          <span className="size">
                            {formatFileSize(repo.size * 1024)}
                          </span>
                        </div>
                      </div>
                      <button
                        className="scan-btn"
                        onClick={() => analyzeRepository(repo)}
                        disabled={state.loading}
                      >
                        {state.loading && state.selectedRepo?.id === repo.id
                          ? "Analyzing..."
                          : "Analyze Repository"}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {state.scanResult && (
            <div className="scan-results">
              <h4>Scan Results: {state.scanResult.repositoryName}</h4>
              <div className="results-summary">
                <div className="result-stat">
                  <span className="stat-value">
                    {state.scanResult.totalFiles}
                  </span>
                  <span className="stat-label">React/TS Files</span>
                </div>
                <div className="result-stat">
                  <span className="stat-value">
                    {state.scanResult.estimatedScanTime}s
                  </span>
                  <span className="stat-label">Est. Scan Time</span>
                </div>
                <div className="result-stat">
                  <span className="stat-value">
                    {state.scanResult.scanCost.credits}
                  </span>
                  <span className="stat-label">Credits Required</span>
                </div>
                <div className="result-stat">
                  <span className="stat-value">
                    ${state.scanResult.scanCost.cost.toFixed(2)}
                  </span>
                  <span className="stat-label">Scan Cost</span>
                </div>
              </div>
              <button className="start-scan-btn">
                Start Full Repository Scan
              </button>
            </div>
          )}
        </div>
      )}

      {/* GitHub Repository Scanner Modal */}
      {state.showScanner && state.selectedRepo && (
        <GitHubRepositoryScanner
          repositoryName={state.selectedRepo.fullName}
          files={state.scannerFiles}
          onScanComplete={handleScanComplete}
          onClose={() => setState((prev) => ({ ...prev, showScanner: false }))}
        />
      )}

      {/* Enhanced Pricing Tiers Modal */}
      {state.showPricingModal && (
        <GitHubPricingTiers
          onUpgrade={handleUpgrade}
          onClose={() =>
            setState((prev) => ({ ...prev, showPricingModal: false }))
          }
        />
      )}

      {state.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {state.error}
        </div>
      )}

      <style jsx>{`
        .github-integration {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .integration-header h3 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.25rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .integration-header h3::before {
          content: "⚡";
          font-size: 1.2em;
        }

        .integration-description {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 24px 0;
          font-size: 0.9rem;
        }

        .connection-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .connection-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          gap: 16px;
        }

        .connection-icon {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .connection-card h4 {
          color: #ffffff;
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .connection-card p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          max-width: 400px;
        }

        .plan-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }

        .plan-badge {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2),
            rgba(76, 175, 80, 0.2)
          );
          color: #ffffff;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .plan-limit {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
        }

        .connect-btn {
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
          margin-top: 8px;
        }

        .connect-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
        }

        .connect-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .demo-section h4 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .demo-section p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 16px 0;
          font-size: 0.9rem;
        }

        .repositories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .repository-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .repository-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .repository-card.demo {
          opacity: 0.7;
          position: relative;
        }

        .repository-card.demo::after {
          content: "DEMO";
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .repo-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          align-items: flex-start;
        }

        .repo-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .repo-info {
          flex: 1;
          min-width: 0;
        }

        .repo-info h5 {
          color: #ffffff;
          margin: 0 0 4px 0;
          font-size: 0.95rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .repo-info p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          font-size: 0.8rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .repo-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .language,
        .size {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .scan-btn {
          width: 100%;
          background: rgba(33, 150, 243, 0.2);
          border: 1px solid rgba(33, 150, 243, 0.4);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .scan-btn:hover:not(:disabled) {
          background: rgba(33, 150, 243, 0.3);
          transform: translateY(-1px);
        }

        .scan-btn:disabled,
        .scan-btn.demo {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .connected-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .connection-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 8px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(76, 175, 80, 0.5);
        }

        .user-details h4 {
          color: #ffffff;
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .user-details p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 0.85rem;
        }

        .repo-stats {
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }

        .repo-stats span {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
        }

        .refresh-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }

        .repositories-section h4 {
          color: #ffffff;
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .scan-results {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 8px;
          padding: 20px;
        }

        .scan-results h4 {
          color: #ffffff;
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .results-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .result-stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .start-scan-btn {
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
          width: 100%;
        }

        .start-scan-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
        }

        .error-icon {
          color: #f87171;
          font-size: 1.2rem;
        }

        .error-message {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .repositories-grid {
            grid-template-columns: 1fr;
          }

          .upgrade-options {
            grid-template-columns: 1fr;
          }

          .results-summary {
            grid-template-columns: repeat(2, 1fr);
          }

          .connection-status {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
