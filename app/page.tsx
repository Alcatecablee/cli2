"use client";

import React, { useState, useEffect } from "react";

interface OnboardingData {
  projectType: string;
  experienceLevel: string;
  hasCode: boolean;
  completedOnboarding: boolean;
}

const getDefaultOnboardingState = (): OnboardingData => ({
  projectType: "",
  experienceLevel: "",
  hasCode: false,
  completedOnboarding: false,
});

export default function HomePage() {
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(
    getDefaultOnboardingState(),
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Layer 4 hydration fix - ensure proper SSR safety
  useEffect(() => {
    setIsHydrated(true);

    // Load onboarding data only on client
    if (typeof window !== "undefined") {
      try {
        const savedOnboarding = localStorage.getItem("neurolint-onboarding");
        if (savedOnboarding) {
          const parsed = JSON.parse(savedOnboarding);
          if (parsed && typeof parsed.completedOnboarding === "boolean") {
            setOnboardingData(parsed);
          }
        }
      } catch (error) {
        console.warn("Failed to load onboarding data:", error);
      }
    }
  }, []);

  // Save onboarding data on changes
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "neurolint-onboarding",
          JSON.stringify(onboardingData),
        );
      } catch (error) {
        console.warn("Failed to save onboarding data:", error);
      }
    }
  }, [onboardingData, isHydrated]);

  const onboardingSteps = [
    {
      id: 0,
      title: "",
      subtitle:
        "Ready to experience the most sophisticated React/Next.js fixing system ever built?",
      description:
        "Experience our 6-layer automated fixing system with real code analysis and enterprise-grade transformations.",
      type: "welcome" as const,
    },
    {
      id: 1,
      title: "What's your project type?",
      subtitle: "This helps us show you the most relevant fixes",
      description:
        "Different frameworks have different common issues. We'll prioritize the fixes that matter most for your stack.",
      type: "select" as const,
      options: [
        {
          value: "react",
          label: "React Components",
          description: "Classic React components and hooks",
        },
        {
          value: "nextjs",
          label: "Next.js Application",
          description: "SSR, hydration, and App Router patterns",
        },
        {
          value: "typescript",
          label: "TypeScript Project",
          description: "Type safety and modern patterns",
        },
        {
          value: "mixed",
          label: "Mixed/Other",
          description: "Multiple frameworks or custom setup",
        },
      ],
    },
    {
      id: 2,
      title: "What's your experience level?",
      subtitle: "We'll adjust our explanations and recommendations",
      description:
        "This helps us provide the right level of detail in our analysis and suggestions.",
      type: "select" as const,
      options: [
        {
          value: "beginner",
          label: "Beginner",
          description: "New to React/Next.js, learning the basics",
        },
        {
          value: "intermediate",
          label: "Intermediate",
          description:
            "Comfortable with components, working on larger projects",
        },
        {
          value: "advanced",
          label: "Advanced",
          description: "Expert level, optimizing for performance and scale",
        },
      ],
    },
    {
      id: 3,
      title: "Ready to see NeuroLint Pro in action?",
      subtitle: "Upload your code or try our curated samples",
      description:
        "Experience our 6-layer automated fixing system with real code analysis and enterprise-grade transformations.",
      type: "transition" as const,
    },
  ];

  const handleOnboardingNext = (value?: string) => {
    console.log("handleOnboardingNext called with value:", value);
    const currentStep = onboardingSteps[onboardingStep];

    if (currentStep.type === "select" && value) {
      if (currentStep.id === 1) {
        setOnboardingData((prev) => ({ ...prev, projectType: value }));
      } else if (currentStep.id === 2) {
        setOnboardingData((prev) => ({ ...prev, experienceLevel: value }));
      }
    }

    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep((prev) => prev + 1);
    } else {
      setOnboardingData((prev) => ({ ...prev, completedOnboarding: true }));
    }
  };

  const skipOnboarding = () => {
    console.log("skipOnboarding called");
    setOnboardingData((prev) => ({ ...prev, completedOnboarding: true }));
  };

  // Layer 4 hydration safe rendering - render content immediately to prevent blank screen
  // Use isHydrated for localStorage operations but always show content

  if (!onboardingData.completedOnboarding) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            padding: "3rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.15)",
            textAlign: "center",
          }}
        >
          {/* Progress Bar */}
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                height: "4px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "2px",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#2196f3",
                  borderRadius: "2px",
                  width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Step {onboardingStep + 1} of {onboardingSteps.length}
            </div>
          </div>

          {/* Content */}
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "900",
              marginBottom: "1rem",
              color: "#ffffff",
            }}
          >
            {onboardingSteps[onboardingStep].title}
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            {onboardingSteps[onboardingStep].subtitle}
          </p>

          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem",
            }}
          >
            {onboardingSteps[onboardingStep].description}
          </p>

          {/* Welcome Screen */}
          {onboardingSteps[onboardingStep].type === "welcome" && (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "rgba(76,175,80,0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    COMPLETE
                  </div>
                  <div style={{ fontSize: "0.9rem" }}>
                    Fixes 50+ Issue Types
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "rgba(33,150,243,0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    INSTANT
                  </div>
                  <div style={{ fontSize: "0.9rem" }}>Results in Seconds</div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "rgba(255,152,0,0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    PROTECTED
                  </div>
                  <div style={{ fontSize: "0.9rem" }}>Never Corrupts Code</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Get Started button clicked");
                    handleOnboardingNext();
                  }}
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: "rgba(33,150,243,0.2)",
                    border: "1px solid rgba(33,150,243,0.4)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "600",
                    minWidth: "120px",
                  }}
                >
                  Get Started
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Skip to Demo button clicked");
                    skipOnboarding();
                  }}
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "rgba(255,255,255,0.9)",
                    cursor: "pointer",
                    minWidth: "120px",
                  }}
                >
                  Skip to Demo
                </button>
              </div>
            </div>
          )}

          {/* Selection Screen */}
          {onboardingSteps[onboardingStep].type === "select" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {onboardingSteps[onboardingStep].options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOnboardingNext(option.value)}
                  style={{
                    padding: "1rem",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)";
                  }}
                >
                  <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    {option.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Transition Screen */}
          {onboardingSteps[onboardingStep].type === "transition" && (
            <div>
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "rgba(33,150,243,0.1)",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Your Setup:</strong>{" "}
                  {onboardingData.projectType || "Not specified"} •{" "}
                  {onboardingData.experienceLevel || "Not specified"}
                </div>
                <div>
                  <strong>Recommended Samples:</strong> Curated based on your
                  selection
                </div>
              </div>

              <button
                onClick={() => handleOnboardingNext()}
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: "rgba(33,150,243,0.2)",
                  border: "1px solid rgba(33,150,243,0.4)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                  minWidth: "200px",
                }}
              >
                Start Demo Experience
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Demo Experience (simplified for this fix)
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        padding: "2rem",
        textAlign: "center",
      }}
    ></div>
  );
}
