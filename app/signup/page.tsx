"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { user, signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError(
        "Password must contain uppercase, lowercase, and numeric characters",
      );
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
      );

      if (user) {
        // Check for intended plan from pricing page
        const intendedPlan = localStorage.getItem("intended_plan");
        if (intendedPlan) {
          localStorage.removeItem("intended_plan");
          const { planId, billingPeriod } = JSON.parse(intendedPlan);
          router.push(`/checkout?plan=${planId}&billing=${billingPeriod}`);
        } else {
          router.push("/dashboard");
        }
      } else {
        // Show success message for email confirmation
        setSuccess(
          (result as any)?.message ||
            "Account created! Please check your email to confirm your account.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Clear error when user starts typing
    if (error) {
      setError("");
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Don't render if user is already logged in
  if (user) {
    return (
      <div className="onboarding-section">
        <div className="onboarding-container">
          <div className="onboarding-content">
            <div className="onboarding-card">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "2px solid rgba(33, 150, 243, 0.4)",
                  borderTop: "2px solid #ffffff",
                  borderRadius: "50%",
                  margin: "0 auto 1.5rem",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <p className="onboarding-subtitle">Redirecting to dashboard...</p>
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

  return (
    <div className="onboarding-section">
      <div className="onboarding-container">
        <div className="onboarding-content">
          <div className="onboarding-card">
            <div className="onboarding-logo">
              <Link
                href="/"
                className="brand-logo"
                style={{ marginBottom: "1.5rem" }}
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F4b35a64a4a2c446c91402681adcf734e%2F485afb87468542eeba91d45b141bab95?format=webp&width=800"
                  alt="NeuroLint Pro"
                />
              </Link>
            </div>
            <h1 className="onboarding-title">Create your account</h1>
            <p className="onboarding-subtitle">
              Start fixing your React code with AI
            </p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "8px",
                    color: "#fca5a5",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    borderRadius: "8px",
                    color: "#86efac",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  {success}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#ffffff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "1rem",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                    placeholder="John"
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(33, 150, 243, 0.4)";
                      e.target.style.boxShadow =
                        "0 0 12px rgba(33, 150, 243, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#ffffff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "1rem",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                    placeholder="Doe"
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(33, 150, 243, 0.4)";
                      e.target.style.boxShadow =
                        "0 0 12px rgba(33, 150, 243, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  placeholder="john@example.com"
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(33, 150, 243, 0.4)";
                    e.target.style.boxShadow =
                      "0 0 12px rgba(33, 150, 243, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  placeholder="At least 8 characters"
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(33, 150, 243, 0.4)";
                    e.target.style.boxShadow =
                      "0 0 12px rgba(33, 150, 243, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                  }}
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  placeholder="Confirm your password"
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(33, 150, 243, 0.4)";
                    e.target.style.boxShadow =
                      "0 0 12px rgba(33, 150, 243, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "2rem",
                  fontSize: "0.875rem",
                }}
              >
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    accentColor: "rgba(33, 150, 243, 0.9)",
                    marginTop: "2px",
                  }}
                />
                <label
                  htmlFor="acceptTerms"
                  style={{
                    marginLeft: "0.5rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: "1.5",
                  }}
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    style={{
                      color: "rgba(33, 150, 243, 0.9)",
                      textDecoration: "none",
                    }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    style={{
                      color: "rgba(33, 150, 243, 0.9)",
                      textDecoration: "none",
                    }}
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="onboarding-btn primary"
                style={{
                  width: "100%",
                  marginBottom: "1.5rem",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        borderTop: "2px solid #ffffff",
                        borderRadius: "50%",
                        marginRight: "0.75rem",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>

              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: "rgba(33, 150, 243, 0.9)",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      background: "rgba(255, 255, 255, 0.15)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      padding: "0 1rem",
                      background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.9) 100%)",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  className="onboarding-btn secondary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <svg
                    style={{ height: "20px", width: "20px" }}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="onboarding-btn secondary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <svg
                    style={{ height: "20px", width: "20px" }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
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
