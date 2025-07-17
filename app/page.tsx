"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
        <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>
          NeuroLint Pro
        </h1>

        <p style={{ fontSize: "1.2rem", marginBottom: "3rem" }}>
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
              background: "#333333",
              border: "1px solid #666666",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "1rem",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              window.location.href = "/api/demo";
            }}
            style={{
              padding: "1rem 2rem",
              background: "#333333",
              border: "1px solid #666666",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "1rem",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            Try Demo
          </button>
        </div>
      </div>
    </div>
  );
}
