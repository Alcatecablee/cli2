"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";

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
  accessToken: string | null;
}

export default function GitHubIntegrationFixed() {
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
    // GitHub repository scanning is now free for everyone
    const planLimits = {
      free: { repositories: -1, filesPerScan: -1 }, // unlimited for free users
      developer: { repositories: -1, filesPerScan: -1 },
      professional: { repositories: -1, filesPerScan: -1 },
      team: { repositories: -1, filesPerScan: -1 },
      enterprise: { repositories: -1, filesPerScan: -1 },
    };

    const userPlan = user?.plan || "free";
    const limits =
      planLimits[userPlan as keyof typeof planLimits] || planLimits.free;

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
    if (isPrivate) return "◉";
    switch (language?.toLowerCase()) {
      case "typescript":
        return "TS";
      case "javascript":
        return "JS";
      case "jsx":
        return "JSX";
      case "tsx":
        return "TSX";
      default:
        return "•";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getPlanLimits = () => {
    const userPlan = user?.plan || "free";
    const limits = {
      free: {
        repositories: "Unlimited",
        filesPerScan: "Unlimited",
        note: "Free for everyone",
      },
      developer: {
        repositories: "Unlimited",
        filesPerScan: "Unlimited",
        note: "Free for everyone",
      },
      professional: {
        repositories: "Unlimited",
        filesPerScan: "Unlimited",
        note: "Free for everyone",
      },
      team: {
        repositories: "Unlimited",
        filesPerScan: "Unlimited",
        note: "Free for everyone",
      },
      enterprise: {
        repositories: "Unlimited",
        filesPerScan: "Unlimited",
        note: "Free for everyone",
      },
    };
    return limits[userPlan as keyof typeof limits] || limits.free;
  };

  return (
    <div className="github-integration">
      <div className="integration-header">
        <h3>GitHub Repository Scanner</h3>
        <p className="integration-description">
          Connect your GitHub account to scan and fix React/Next.js
          repositories. Analyze code quality across all your projects.
        </p>
      </div>

      <div className="plan-info-card">
        <div className="plan-limits">
          <div className="limit-item">
            <span className="limit-label">Current Plan:</span>
            <span className="limit-value">
              {user?.plan?.toUpperCase() || "FREE"}
            </span>
          </div>
          <div className="limit-item">
            <span className="limit-label">Repository Limit:</span>
            <span className="limit-value">{getPlanLimits().repositories}</span>
          </div>
          <div className="limit-item">
            <span className="limit-label">Files Per Scan:</span>
            <span className="limit-value">{getPlanLimits().filesPerScan}</span>
          </div>
        </div>
      </div>

      {!state.isConnected ? (
        <div className="connection-section">
          <div className="connection-card">
            <div className="connection-icon">
              <svg
                width="48"
                height="48"
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
            <button
              className="connect-btn"
              onClick={handleConnectGitHub}
              disabled={state.isConnecting}
            >
              {state.isConnecting ? "Connecting..." : "Connect GitHub"}
            </button>
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
              <h4>Analysis: {state.scanResult.repositoryName}</h4>
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
                  <span className="stat-label">Analysis Cost</span>
                </div>
              </div>
              <button className="start-scan-btn">
                Start Repository Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {state.error && (
        <div className="error-message">
          <span className="error-icon">!</span>
          {state.error}
        </div>
      )}

      <style jsx>{`
        .github-integration {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 2px solid #000000;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(25px) saturate(1.2);
          -webkit-backdrop-filter: blur(25px) saturate(1.2);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .integration-header h3 {
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .integration-description {
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 2rem 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .plan-info-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .plan-limits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .limit-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .limit-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .limit-value {
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .upgrade-prompt {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
          text-align: center;
        }

        .upgrade-prompt p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
        }

        .upgrade-link {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2) 0%,
            rgba(33, 150, 243, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 2px solid #000000;
          border-radius: 8px;
          color: #ffffff;
          padding: 0.5rem 1rem;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .upgrade-link:hover {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.22) 50%,
            rgba(255, 255, 255, 0.12) 100%
          );
          transform: translateY(-2px);
        }

        .connection-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .connection-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid #000000;
          border-radius: 12px;
          gap: 1rem;
        }

        .connection-icon {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.5rem;
        }

        .connection-card h4 {
          color: #ffffff;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .connection-card p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          max-width: 400px;
          line-height: 1.5;
        }

        .connect-btn {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.2) 0%,
            rgba(33, 150, 243, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 2px solid #000000;
          border-radius: 8px;
          backdrop-filter: blur(20px) saturate(1.2);
          -webkit-backdrop-filter: blur(20px) saturate(1.2);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }

        .connect-btn:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.22) 50%,
            rgba(255, 255, 255, 0.12) 100%
          );
          transform: translateY(-2px);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .connect-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .demo-section h4 {
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .demo-section p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 1.5rem 0;
          font-size: 0.875rem;
        }

        .repositories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .repository-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .repository-card:hover:not(.demo) {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .repository-card.demo {
          opacity: 0.7;
          position: relative;
        }

        .repository-card.demo::after {
          content: "PREVIEW";
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 193, 7, 0.2);
          color: rgba(255, 193, 7, 0.9);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .repo-header {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          align-items: flex-start;
        }

        .repo-icon {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #000000;
          color: rgba(255, 255, 255, 0.8);
          width: 2rem;
          height: 2rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .repo-info {
          flex: 1;
          min-width: 0;
        }

        .repo-info h5 {
          color: #ffffff;
          margin: 0 0 0.25rem 0;
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
          gap: 0.25rem;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .language,
        .size {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #000000;
          color: rgba(255, 255, 255, 0.8);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .scan-btn {
          width: 100%;
          background: rgba(33, 150, 243, 0.2);
          border: 2px solid #000000;
          color: #ffffff;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .scan-btn:hover:not(:disabled):not(.demo) {
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
          gap: 2rem;
        }

        .connection-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(76, 175, 80, 0.1);
          border: 2px solid #000000;
          border-radius: 12px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #000000;
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
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .repo-stats span {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #000000;
          color: rgba(255, 255, 255, 0.8);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
        }

        .refresh-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #000000;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }

        .repositories-section h4 {
          color: #ffffff;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .scan-results {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .scan-results h4 {
          color: #ffffff;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .results-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .result-stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
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
            rgba(33, 150, 243, 0.2) 0%,
            rgba(33, 150, 243, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 1px solid rgba(33, 150, 243, 0.4);
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .start-scan-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.22) 50%,
            rgba(255, 255, 255, 0.12) 100%
          );
          transform: translateY(-2px);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .error-icon {
          color: rgba(239, 68, 68, 0.9);
          font-weight: 600;
          font-size: 1rem;
        }

        .error-message {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .github-integration {
            padding: 1.5rem;
          }

          .repositories-grid {
            grid-template-columns: 1fr;
          }

          .plan-limits {
            grid-template-columns: 1fr;
          }

          .results-summary {
            grid-template-columns: repeat(2, 1fr);
          }

          .connection-status {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
