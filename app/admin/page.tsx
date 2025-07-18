"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../dashboard/dashboard.css";
import "../dashboard/integrations.css";
import "./admin.css";
import ErrorBoundary from "../dashboard/components/ErrorBoundary";
import UserManagement from "./components/UserManagement";
import EnvironmentConfig from "./components/EnvironmentConfig";
import SystemMonitoring from "./components/SystemMonitoring";
import AnalyticsOverview from "./components/AnalyticsOverview";
import ApiManagement from "./components/ApiManagement";
import DatabaseManagement from "./components/DatabaseManagement";
import AdminSetup from "./components/AdminSetup";

interface AdminDashboardState {
  activeSection: string;
  isLoading: boolean;
  error: string | null;
  sidebarCollapsed: boolean;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [adminState, setAdminState] = useState<AdminDashboardState>({
    activeSection: "analytics",
    isLoading: false,
    error: null,
    sidebarCollapsed: false,
  });

  // Check admin permissions
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user && !isAdmin(user)) {
      router.push("/dashboard");
      return;
    }
  }, [user, loading, router]);

  const isAdmin = (user: any) => {
    return (
      user?.email === "admin@neurolint.com" ||
      user?.role === "admin" ||
      user?.email === "info@neurolint.com"
    );
  };

  const sidebarSections = [
    {
      id: "analytics",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="3 3 3 21 21 21" />
          <path d="M7 12h4l3-8 4 8h3" />
        </svg>
      ),
      label: "Analytics",
      description: "System metrics & usage",
    },
    {
      id: "users",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: "Users",
      description: "User management & permissions",
    },
    {
      id: "environment",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
        </svg>
      ),
      label: "Environment",
      description: "Config & credentials",
    },
    {
      id: "system",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      label: "System",
      description: "Monitoring & health",
    },
    {
      id: "api",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      label: "API Management",
      description: "Keys & rate limits",
    },
    {
      id: "database",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 3 4 6 9 6s9-3 9-6V5" />
          <path d="M3 12c0 3 4 6 9 6s9-3 9-6" />
        </svg>
      ),
      label: "Database",
      description: "Schema & data management",
    },
    {
      id: "setup",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      label: "Setup",
      description: "Initialize admin system",
    },
  ];

  const handleSectionChange = (sectionId: string) => {
    setAdminState((prev) => ({
      ...prev,
      activeSection: sectionId,
    }));
  };

  const toggleSidebar = () => {
    setAdminState((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div
        className={`dashboard-sidebar ${adminState.sidebarCollapsed ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="logo-container">
            <h2>Admin</h2>
            <span className="badge">NeuroLint Pro</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarSections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${adminState.activeSection === section.id ? "active" : ""}`}
              onClick={() => handleSectionChange(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <div className="nav-content">
                <span className="nav-label">{section.label}</span>
                <span className="nav-description">{section.description}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="user-details">
              <span className="user-name">Admin</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <Link href="/dashboard" className="back-link">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="main-content">
          <ErrorBoundary>
            {adminState.activeSection === "analytics" && <AnalyticsOverview />}
            {adminState.activeSection === "users" && <UserManagement />}
            {adminState.activeSection === "environment" && (
              <EnvironmentConfig />
            )}
            {adminState.activeSection === "system" && <SystemMonitoring />}
            {adminState.activeSection === "api" && <ApiManagement />}
            {adminState.activeSection === "database" && <DatabaseManagement />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
