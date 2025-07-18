"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../../lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../dashboard/dashboard.css";
import "../admin.css";
import AdminSetup from "../components/AdminSetup";
import ErrorBoundary from "../../dashboard/components/ErrorBoundary";

export default function AdminSetupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading admin setup...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin setup.</p>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <h2>Admin Setup</h2>
            <span className="badge">NeuroLint Pro</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/admin" className="nav-item">
            <span className="nav-icon">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </span>
            <div className="nav-content">
              <span className="nav-label">Back to Admin</span>
              <span className="nav-description">Return to main dashboard</span>
            </div>
          </Link>

          <div className="nav-item active">
            <span className="nav-icon">
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
            </span>
            <div className="nav-content">
              <span className="nav-label">Database Setup</span>
              <span className="nav-description">Initialize admin system</span>
            </div>
          </div>
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
            <AdminSetup />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
