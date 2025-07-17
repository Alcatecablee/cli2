"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Always render the main content - bypass loading state
  if (false) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "2px solid rgba(33, 150, 243, 0.4)",
            borderTop: "2px solid #ffffff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
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
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "2rem",
            background: "linear-gradient(135deg, #2196f3, #4caf50)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          NeuroLint Pro
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "3rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Advanced React/Next.js Code Analysis & Fixing
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              padding: "1rem 2rem",
              background:
                "linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(30, 136, 229, 0.8) 100%)",
              border: "1px solid rgba(33, 150, 243, 0.4)",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "150px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(33, 150, 243, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              // Simple demo redirect - you can modify this to your demo page
              window.location.href = "/api/demo";
            }}
            style={{
              padding: "1rem 2rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "150px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Try Demo
          </button>
        </div>

        <div
          style={{
            marginTop: "3rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            maxWidth: "500px",
            margin: "3rem auto 0",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "rgba(76, 175, 80, 0.1)",
              border: "1px solid rgba(76, 175, 80, 0.2)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚡</div>
            <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>INSTANT</div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
              Results in Seconds
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "rgba(33, 150, 243, 0.1)",
              border: "1px solid rgba(33, 150, 243, 0.2)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🔧</div>
            <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              COMPLETE
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
              50+ Issue Types
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "rgba(255, 152, 0, 0.1)",
              border: "1px solid rgba(255, 152, 0, 0.2)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🛡️</div>
            <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              PROTECTED
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
              Never Corrupts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
