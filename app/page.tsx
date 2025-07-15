"use client";

import React, { useState, useEffect, useCallback } from "react";
import { isNetworkError, handleExternalServiceError } from "../lib/fetch-utils";

// Demo state interface for sophisticated analysis results - matches NeuroLint Pro output
interface DemoResult {
  success?: boolean;
  dryRun?: boolean;
  analysis?: {
    recommendedLayers: number[];
    detectedIssues: Array<{
      type: string;
      severity: string;
      description: string;
      fixedByLayer: number;
      pattern: string;
      count?: number;
    }>;
    reasoning?: string[];
    confidence: number;
    estimatedImpact: {
      level: string;
      description: string;
      estimatedFixTime: string;
    };
  };
  transformed?: string;
  originalCode?: string;
  layers?: Array<{
    layerId: number;
    success: boolean;
    improvements?: string[];
    executionTime: number;
    changeCount?: number;
    revertReason?: string;
  }>;
  states?: string[];
  totalExecutionTime?: number;
  successfulLayers?: number;
  error?: string;
}

interface OnboardingData {
  projectType: string;
  experienceLevel: string;
  hasCode: boolean;
  completedOnboarding: boolean;
}

interface DemoState {
  isLoading: boolean;
  currentSample: string | null;
  result: DemoResult | null;
  showResults: boolean;
  selectedLayers: number[];
  applyFixes: boolean;
}

// Helper function to clear demo state
const clearDemoState = () => ({
  isLoading: false,
  currentSample: null,
  result: null,
  showResults: false,
  selectedLayers: [],
  applyFixes: false,
});

// Helper function to save onboarding data with auth-aware persistence
const saveOnboardingData = async (data: OnboardingData) => {
  // Always save to localStorage for immediate persistence
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("neurolint-onboarding", JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save onboarding data to localStorage:", error);
    }
  }

  // TODO: For authenticated users, also save to database via API
  // This would integrate with the existing session management system
  // Example implementation:
  // if (user && session) {
  //   try {
  //     await fetch('/api/user/onboarding', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${session.access_token}`
  //       },
  //       body: JSON.stringify(data)
  //     });
  //   } catch (error) {
  //     console.warn('Failed to save onboarding data to database:', error);
  //   }
  // }
};

// Helper function to load onboarding data with auth-aware persistence
const loadOnboardingData = async (): Promise<OnboardingData> => {
  // TODO: For authenticated users, try to load from database first
  // This would check for user preferences stored server-side
  // if (user && session) {
  //   try {
  //     const response = await fetch('/api/user/onboarding', {
  //       headers: {
  //         'Authorization': `Bearer ${session.access_token}`
  //       }
  //     });
  //     if (response.ok) {
  //       const serverData = await response.json();
  //       if (serverData.onboardingData) {
  //         return serverData.onboardingData;
  //       }
  //     }
  //   } catch (error) {
  //     console.warn('Failed to load onboarding data from database:', error);
  //   }
  // }

  // Fall back to localStorage
  if (typeof window !== "undefined") {
    try {
      const savedOnboarding = localStorage.getItem("neurolint-onboarding");
      if (savedOnboarding) {
        const parsed = JSON.parse(savedOnboarding);
        // Validate the structure before using
        if (
          parsed &&
          typeof parsed === "object" &&
          typeof parsed.completedOnboarding === "boolean"
        ) {
          return {
            projectType: parsed.projectType || "",
            experienceLevel: parsed.experienceLevel || "",
            hasCode: parsed.hasCode || false,
            completedOnboarding: parsed.completedOnboarding,
          };
        }
      }
    } catch (error) {
      console.warn("Failed to load onboarding data from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("neurolint-onboarding");
    }
  }

  // Return default state if no valid saved data
  return {
    projectType: "",
    experienceLevel: "",
    hasCode: false,
    completedOnboarding: false,
  };
};

// Helper function to get default onboarding state (SSR-safe)
const getDefaultOnboardingState = (): OnboardingData => ({
  projectType: "",
  experienceLevel: "",
  hasCode: false,
  completedOnboarding: false,
});

export default function HomePage() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(
    getDefaultOnboardingState(),
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data from localStorage after hydration to prevent SSR mismatch
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await loadOnboardingData();
        setOnboardingData(savedData);
      } catch (error) {
        console.warn("Failed to load saved onboarding data:", error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadSavedData();
  }, []);

  // Save onboarding data whenever it changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveOnboardingData(onboardingData);
    }
  }, [onboardingData, isHydrated]);

  const texts = [
    "Fix React Errors Instantly",
    "Eliminate HTML Entities",
    "Add Missing Key Props",
    "Secure SSR Hydration",
    "Professional Code Quality",
  ];

  const onboardingSteps = [
    {
      id: 0,
      title: "Welcome to NeuroLint Pro",
      subtitle: (
        <>
          Ready to experience the{" "}
          <strong style={{ color: "#ffffff" }}>most sophisticated</strong>{" "}
          React/Next.js fixing system ever built?
        </>
      ),
      description: (
        <>
          Experience our 6-layer automated fixing system with real code analysis
          and enterprise-grade transformations.
        </>
      ),
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

  // Robust copy function with fallbacks
  const copyToClipboard = async (text: string, type: string) => {
    try {
      // First try the modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        console.log(`${type} code copied to clipboard`);
        return;
      }
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback:", err);
    }

    // Fallback method using textarea
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        console.log(`${type} code copied to clipboard (fallback)`);
      } else {
        throw new Error("execCommand failed");
      }
    } catch (fallbackErr) {
      console.error("All copy methods failed:", fallbackErr);
      // Show user a manual copy option
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 10000;
        max-width: 90vw;
        max-height: 80vh;
        overflow: auto;
      `;

      const content = document.createElement("div");
      content.innerHTML = `
        <h3 style="margin-top: 0;">Copy Code Manually</h3>
        <p>Please copy the code below manually:</p>
        <textarea readonly style="
          width: 100%;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 10px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        ">${text}</textarea>
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-top: 10px;
          padding: 8px 16px;
          background: rgba(33, 150, 243, 0.2);
          border: 1px solid rgba(33, 150, 243, 0.4);
          color: #2196f3;
          border-radius: 4px;
          cursor: pointer;
        ">Close</button>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      // Auto-select the text in the textarea
      const textarea = modal.querySelector("textarea") as HTMLTextAreaElement;
      if (textarea) {
        textarea.select();
        textarea.focus();
      }
    }
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getBusinessImpact = (issueType: string, severity: string) => {
    const impacts: Record<string, Record<string, string>> = {
      "missing-key": {
        high: "Poor user experience, React warnings in console, potential performance issues during updates",
        medium:
          "Console warnings, slight performance degradation in list rendering",
        low: "Minor console warnings with minimal impact",
      },
      "html-entities": {
        high: "Broken text display, poor SEO, accessibility issues for screen readers",
        medium: "Text display issues, potential SEO impact",
        low: "Minor text encoding issues",
      },
      "ssr-hydration": {
        critical:
          "App crashes, hydration mismatches, poor Core Web Vitals, SEO penalties",
        high: "Hydration warnings, potential layout shifts, poor user experience",
        medium: "Minor hydration issues, slight performance impact",
      },
      accessibility: {
        high: "Legal compliance risk, excludes users with disabilities, poor lighthouse scores",
        medium: "Reduced accessibility, potential compliance issues",
        low: "Minor accessibility improvements needed",
      },
    };

    return (
      impacts[issueType]?.[severity] ||
      "Improves code standards and maintainability"
    );
  };

  const getSolutionDescription = (issueType: string) => {
    const solutions: Record<string, string> = {
      "missing-key":
        "Add unique key props to list items for optimal React reconciliation and performance",
      "html-entities":
        "Convert HTML entities to proper Unicode characters for correct text display",
      "ssr-hydration":
        "Add client-side guards and useEffect hooks to prevent server/client mismatches",
      accessibility:
        "Add ARIA labels, alt attributes, and semantic HTML for screen reader compatibility",
      "console-usage":
        "Remove or guard console statements for production optimization",
      "error-handling":
        "Add try-catch blocks and error boundaries for robust error handling",
    };

    return (
      solutions[issueType] ||
      "Apply established coding standards and performance optimizations"
    );
  };

  // Sophisticated demo state management
  const [demoState, setDemoState] = useState<DemoState>({
    isLoading: false,
    currentSample: null,
    result: null,
    showResults: false,
    selectedLayers: [],
    applyFixes: false,
  });

  // Sophisticated sample code examples that showcase different layer capabilities
  const sampleCodes = {
    "missing-keys": {
      name: "Missing Keys & HTML Entities",
      description: "Showcases Layer 2 (Patterns) and Layer 3 (Components)",
      code: `const items = [
  { id: 1, name: &quot;React Component&quot; },
  { id: 2, name: &quot;Next.js App&quot; },
  { id: 3, name: &quot;TypeScript Fix&quot; }
];

function ItemList() {
  return (
    <ul>
      {items.map(item =>
        <li>{item.name}</li>
      )}
    </ul>
  );
}

export default ItemList;`,
      expectedLayers: [1, 2, 3],
      expectedIssues: ["HTML entities", "Missing key props"],
    },
    "html-entities": {
      name: "HTML Entity Corruption",
      description:
        "Showcases Layer 2 (Entity Cleanup) sophisticated pattern detection",
      code: `const message = &quot;Welcome to NeuroLint Pro&quot;;
const description = &quot;Detects &amp; fixes 50+ issues&quot;;
const note = &quot;Smart confidence scoring &amp; impact estimation&quot;;

console.log(&quot;Processing HTML entities...&quot;);

function Display() {
  return (
    <div>
      <h1>{message}</h1>
      <p>{description}</p>
      <small>{note}</small>
    </div>
  );
}`,
      expectedLayers: [1, 2],
      expectedIssues: [
        "HTML quote entities",
        "HTML ampersand entities",
        "Console.log usage",
      ],
    },
    "ssr-issues": {
      name: "SSR Hydration Issues",
      description: "Showcases Layer 4 (Hydration) SSR safety guards",
      code: `import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}

export default ThemeToggle;`,
      expectedLayers: [1, 4],
      expectedIssues: [
        "Unguarded localStorage usage",
        "Document access without SSR guards",
      ],
    },
    accessibility: {
      name: "Accessibility & Testing Issues",
      description:
        "Showcases Layer 3 (Components) and Layer 6 (Testing) comprehensive validation",
      code: `import { useState } from 'react';

function ImageGallery({ images }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => document.getElementById('fileInput').click()}>
        Upload Image
      </button>
      <input type="file" id="fileInput" onChange={(e) => handleUpload(e.target.files[0])} />
      <div>
        {images.map(image =>
          <img src={image.url} />
        )}
      </div>
    </div>
  );
}`,
      expectedLayers: [1, 3, 6],
      expectedIssues: [
        "Missing key props",
        "Missing alt attributes",
        "Missing error handling",
        "Missing prop types",
      ],
    },
  };

  // Get personalized sample recommendations based on onboarding data
  const getRecommendedSamples = () => {
    const { projectType, experienceLevel } = onboardingData;

    if (projectType === "nextjs") {
      return ["ssr-issues", "missing-keys", "html-entities", "accessibility"];
    } else if (projectType === "react") {
      return ["missing-keys", "accessibility", "html-entities", "ssr-issues"];
    } else if (projectType === "typescript") {
      return ["accessibility", "ssr-issues", "missing-keys", "html-entities"];
    }
    return ["missing-keys", "html-entities", "ssr-issues", "accessibility"];
  };

  const handleOnboardingNext = (value?: string) => {
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
    setOnboardingData((prev) => ({ ...prev, completedOnboarding: true }));
  };

  // Reset onboarding function (useful for testing or user preference)
  const resetOnboarding = () => {
    setOnboardingData({
      projectType: "",
      experienceLevel: "",
      hasCode: false,
      completedOnboarding: false,
    });
    setOnboardingStep(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("neurolint-onboarding");
    }
  };

  useEffect(() => {
    const typewriterEffect = () => {
      const currentFullText = texts[currentIndex];
      if (currentText.length < currentFullText.length) {
        setCurrentText(currentFullText.slice(0, currentText.length + 1));
      } else {
        setTimeout(() => {
          setCurrentText("");
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
      }
    };

    const timer = setTimeout(typewriterEffect, 100);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, texts]);

  const openDashboard = () => {
    window.location.href = "/dashboard";
  };

  // Sophisticated sample code loading with real engine integration
  const loadSampleCode = useCallback(
    async (sampleKey: string) => {
      console.log("[FRONTEND] loadSampleCode called with:", sampleKey);
      console.log("[FRONTEND] Available samples:", Object.keys(sampleCodes));

      const sample = sampleCodes[sampleKey as keyof typeof sampleCodes];
      if (!sample) {
        console.error(`[FRONTEND] Sample code '${sampleKey}' not found`);
        return;
      }

      console.log("[FRONTEND] Found sample:", sample.name);

      // Prevent multiple simultaneous requests
      if (demoState.isLoading) {
        console.warn(
          "[FRONTEND] Analysis already in progress, skipping request",
        );
        return;
      }

      setDemoState((prev) => ({
        ...prev,
        isLoading: true,
        currentSample: sampleKey,
        showResults: false,
        result: null,
      }));

      try {
        console.log("[FRONTEND] Starting sample analysis for:", sampleKey);
        console.log("[FRONTEND] Sample code length:", sample.code.length);

        // Add timeout and abort controller for better UX
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const requestPayload = {
          code: sample.code,
          filename: `${sample.name.toLowerCase().replace(/\s+/g, "-")}.tsx`,
          layers:
            demoState.selectedLayers.length > 0
              ? demoState.selectedLayers
              : "auto",
          applyFixes: demoState.applyFixes,
        };

        console.log("[FRONTEND] Demo controls state:", {
          applyFixes: demoState.applyFixes,
          selectedLayers: demoState.selectedLayers,
          mode: demoState.applyFixes ? "Apply Fixes" : "Dry-Run",
          layerMode:
            demoState.selectedLayers.length === 0
              ? "Auto-Detect"
              : demoState.selectedLayers.length === 6
                ? "All Layers"
                : `Custom [${demoState.selectedLayers.join(",")}]`,
        });

        console.log("[FRONTEND] Request payload:", {
          codeLength: requestPayload.code.length,
          filename: requestPayload.filename,
          layers: requestPayload.layers,
          applyFixes: requestPayload.applyFixes,
        });

        const response = await fetch("/api/demo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        }).catch((fetchError) => {
          console.error("[FRONTEND] Network error during fetch:", fetchError);
          handleExternalServiceError(fetchError, "Demo API");
          throw new Error(`Network error: ${fetchError.message}`);
        });

        clearTimeout(timeoutId);

        console.log("[FRONTEND] Response received:", {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log("[FRONTEND] API error response:", errorText);
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("[FRONTEND] Sample API result received:", {
          hasResult: !!result,
          success: result?.success,
          dryRun: result?.dryRun,
          hasAnalysis: !!result?.analysis,
          hasError: !!result?.error,
          hasOriginalCode: !!result?.originalCode,
          hasTransformed: !!result?.transformed,
          originalCodeLength: result?.originalCode?.length || 0,
          transformedCodeLength: result?.transformed?.length || 0,
          codesMatch: result?.originalCode === result?.transformed,
          errorMessage: result?.error,
        });

        // Fix: NeuroLint Pro returns different structure for dry-run mode
        const normalizedResult = {
          ...result,
          success: result?.dryRun ? true : result?.success, // Dry-run is always successful
        };

        setDemoState((prev) => ({
          ...prev,
          isLoading: false,
          result: normalizedResult,
          showResults: true,
        }));
      } catch (error) {
        console.error("[FRONTEND] Demo analysis failed:", error);
        console.error("[FRONTEND] Error details:", {
          name: error instanceof Error ? error.name : "Unknown",
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        let errorMessage = "Unknown error occurred";
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage =
              "Analysis timed out. Please try again with a smaller code sample.";
          } else if (
            error.message.includes("Network error") ||
            error.message.includes("fetch") ||
            error.message.includes("Failed to fetch")
          ) {
            errorMessage =
              "Network connection issue. Please check your internet connection and try again.";
          } else if (error.message.includes("TypeError: Failed to fetch")) {
            errorMessage =
              "Unable to connect to the server. Please refresh the page and try again.";
          } else {
            errorMessage = error.message;
          }
        }

        console.log("[FRONTEND] Setting error state:", errorMessage);

        setDemoState((prev) => ({
          ...prev,
          isLoading: false,
          result: {
            success: false,
            error: errorMessage,
          },
          showResults: true,
        }));
      }
    },
    [demoState.isLoading],
  );

  // Sophisticated file upload with real engine integration
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Comprehensive file validation
    if (!file.name.match(/\.(ts|tsx|js|jsx)$/i)) {
      setDemoState((prev) => ({
        ...prev,
        result: {
          success: false,
          error:
            "Please upload a TypeScript or JavaScript React file (.ts, .tsx, .js, .jsx)",
        },
        showResults: true,
      }));
      return;
    }

    // File size validation (100KB limit)
    if (file.size > 100000) {
      setDemoState((prev) => ({
        ...prev,
        result: {
          success: false,
          error: "File too large. Maximum size is 100KB.",
        },
        showResults: true,
      }));
      return;
    }

    // Prevent multiple simultaneous uploads
    if (demoState.isLoading) {
      console.warn("Analysis already in progress, skipping upload");
      return;
    }

    setDemoState((prev) => ({
      ...prev,
      isLoading: true,
      currentSample: "uploaded-file",
      showResults: false,
      result: null,
    }));

    try {
      const code = await file.text();

      console.log("[FRONTEND] Upload controls state:", {
        applyFixes: demoState.applyFixes,
        selectedLayers: demoState.selectedLayers,
        mode: demoState.applyFixes ? "Apply Fixes" : "Dry-Run",
        layerMode:
          demoState.selectedLayers.length === 0
            ? "Auto-Detect"
            : demoState.selectedLayers.length === 6
              ? "All Layers"
              : `Custom [${demoState.selectedLayers.join(",")}]`,
      });

      const response = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          filename: file.name,
          layers:
            demoState.selectedLayers.length > 0
              ? demoState.selectedLayers
              : "auto",
          applyFixes: demoState.applyFixes,
        }),
      }).catch((fetchError) => {
        console.error("[FRONTEND] File upload network error:", fetchError);
        handleExternalServiceError(fetchError, "File Upload API");
        throw new Error(
          `Network error during file upload: ${fetchError.message}`,
        );
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("[FRONTEND] Upload API result received:", {
        hasResult: !!result,
        success: result?.success,
        dryRun: result?.dryRun,
        hasAnalysis: !!result?.analysis,
        hasError: !!result?.error,
        hasOriginalCode: !!result?.originalCode,
        hasTransformed: !!result?.transformed,
        originalCodeLength: result?.originalCode?.length || 0,
        transformedCodeLength: result?.transformed?.length || 0,
        errorMessage: result?.error,
      });

      // Fix: NeuroLint Pro returns different structure for dry-run mode
      const normalizedResult = {
        ...result,
        success: result?.dryRun ? true : result?.success, // Dry-run is always successful
      };

      setDemoState((prev) => ({
        ...prev,
        isLoading: false,
        result: normalizedResult,
        showResults: true,
      }));
    } catch (error) {
      console.error("File upload analysis failed:", error);
      setDemoState((prev) => ({
        ...prev,
        isLoading: false,
        result: {
          success: false,
          error:
            error instanceof Error ? error.message : "File processing failed",
        },
      }));
    }
  };

  return (
    <div>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <main id="main-content" role="main">
        {!onboardingData.completedOnboarding ? (
          /* Onboarding Experience */
          <section
            className="onboarding-section"
            aria-labelledby="onboarding-title"
          >
            <div className="onboarding-container">
              <div className="onboarding-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="progress-text">
                  Step {onboardingStep + 1} of {onboardingSteps.length}
                </div>
              </div>

              <div className="onboarding-content">
                <div className="onboarding-card">
                  {onboardingSteps[onboardingStep].type === "welcome" && (
                    <div className="onboarding-logo">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F775243cef9ec4db4986833c202dce575%2F3a12bc03448a46bab23669df45aa5fd8?format=webp&width=800"
                        alt="NeuroLint Pro Logo"
                        className="modal-logo"
                      />
                    </div>
                  )}
                  <h1 id="onboarding-title" className="onboarding-title">
                    {onboardingSteps[onboardingStep].title}
                  </h1>
                  <p className="onboarding-subtitle">
                    {onboardingSteps[onboardingStep].subtitle}
                  </p>
                  <p className="onboarding-description">
                    {onboardingSteps[onboardingStep].description}
                  </p>

                  {onboardingSteps[onboardingStep].type === "welcome" && (
                    <div className="onboarding-welcome">
                      <div className="feature-highlights">
                        <div className="highlight-item">
                          <div className="highlight-icon">COMPLETE</div>
                          <div className="highlight-text">
                            Fixes 50+ Issue Types
                          </div>
                        </div>
                        <div className="highlight-item">
                          <div className="highlight-icon">INSTANT</div>
                          <div className="highlight-text">
                            Results in Seconds
                          </div>
                        </div>
                        <div className="highlight-item">
                          <div className="highlight-icon">PROTECTED</div>
                          <div className="highlight-text">
                            Never Corrupts Code
                          </div>
                        </div>
                      </div>
                      <button
                        className="onboarding-btn primary"
                        onClick={() => handleOnboardingNext()}
                      >
                        Get Started
                      </button>
                      <button
                        className="onboarding-btn secondary"
                        onClick={skipOnboarding}
                      >
                        Skip to Demo
                      </button>
                    </div>
                  )}

                  {onboardingSteps[onboardingStep].type === "select" && (
                    <div className="onboarding-options">
                      {onboardingSteps[onboardingStep].options?.map(
                        (option) => (
                          <button
                            key={option.value}
                            className="option-card"
                            onClick={() => handleOnboardingNext(option.value)}
                          >
                            <div className="option-label">{option.label}</div>
                            <div className="option-description">
                              {option.description}
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  )}

                  {onboardingSteps[onboardingStep].type === "transition" && (
                    <div className="onboarding-transition">
                      <div className="transition-highlights">
                        <div className="transition-item">
                          <strong>Your Setup:</strong>{" "}
                          {onboardingData.projectType
                            ? onboardingSteps[1].options?.find(
                                (o) => o.value === onboardingData.projectType,
                              )?.label
                            : "Not specified"}{" "}
                          •{" "}
                          {onboardingData.experienceLevel
                            ? onboardingSteps[2].options?.find(
                                (o) =>
                                  o.value === onboardingData.experienceLevel,
                              )?.label
                            : "Not specified"}
                        </div>
                        <div className="transition-item">
                          <strong>Recommended Samples:</strong> Curated based on
                          your selection
                        </div>
                      </div>
                      <button
                        className="onboarding-btn primary"
                        onClick={() => handleOnboardingNext()}
                      >
                        Start Demo Experience
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Demo Experience */
          <>
            {/* Hero Section with Navigation */}
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-nav">
                <a
                  href="https://neurolint.dev"
                  className="nav-link"
                  aria-label="Go to NeuroLint homepage"
                >
                  Home
                </a>
                <a
                  href="/pricing"
                  className="nav-link"
                  aria-label="View pricing plans"
                >
                  Pricing
                </a>
                <button
                  className="nav-link"
                  onClick={openDashboard}
                  aria-label="Access NeuroLint Pro dashboard"
                >
                  Dashboard
                </button>
              </div>
              <h1 id="hero-title" className="hero-title">
                Try NeuroLint Pro Live
              </h1>
              <p className="hero-desc" role="text">
                Upload your <strong>React/Next.js files</strong> and see{" "}
                <strong>real fixes applied</strong> using our{" "}
                <strong>6-layer system</strong>. <strong>Dry-run mode</strong>{" "}
                perfect for demos returns{" "}
                <strong>analysis without changes</strong>, letting you{" "}
                <strong>explore safely</strong>.
              </p>
            </section>

            {/* Demo Section */}
            <section
              id="demo"
              className="demo-section"
              aria-labelledby="demo-title"
            >
              <div className="demo-container">
                {/* Advanced Demo Controls */}
                <div
                  className="demo-controls"
                  role="region"
                  aria-labelledby="controls-title"
                >
                  <h3 id="controls-title">Analysis Configuration</h3>
                  <div className="controls-grid">
                    <fieldset className="control-group">
                      <legend className="control-label">Mode</legend>
                      <div
                        className="control-options"
                        role="radiogroup"
                        aria-labelledby="mode-legend"
                      >
                        <button
                          className={`control-btn ${!demoState.applyFixes ? "active" : ""}`}
                          onClick={() =>
                            setDemoState((prev) => ({
                              ...prev,
                              applyFixes: false,
                            }))
                          }
                          role="radio"
                          aria-checked={!demoState.applyFixes}
                          aria-describedby="dry-run-description"
                        >
                          Dry-Run (Analysis Only)
                        </button>
                        <button
                          className={`control-btn ${demoState.applyFixes ? "active" : ""}`}
                          onClick={() =>
                            setDemoState((prev) => ({
                              ...prev,
                              applyFixes: true,
                            }))
                          }
                          role="radio"
                          aria-checked={demoState.applyFixes}
                          aria-describedby="apply-fixes-description"
                        >
                          Apply Fixes
                        </button>
                      </div>
                      <div id="dry-run-description" className="sr-only">
                        Analyze code without making changes
                      </div>
                      <div id="apply-fixes-description" className="sr-only">
                        Analyze and modify your code files
                      </div>
                    </fieldset>

                    <fieldset className="control-group">
                      <legend className="control-label">Layer Selection</legend>
                      <div
                        className="layer-controls"
                        role="group"
                        aria-labelledby="layer-presets"
                      >
                        <span id="layer-presets" className="sr-only">
                          Layer presets
                        </span>
                        <button
                          className={`control-btn ${demoState.selectedLayers.length === 0 ? "active" : ""}`}
                          onClick={() =>
                            setDemoState((prev) => ({
                              ...prev,
                              selectedLayers: [],
                            }))
                          }
                          aria-pressed={demoState.selectedLayers.length === 0}
                          aria-describedby="auto-detect-description"
                        >
                          Auto-Detect
                        </button>
                        <button
                          className={`control-btn ${demoState.selectedLayers.length === 6 ? "active" : ""}`}
                          onClick={() =>
                            setDemoState((prev) => ({
                              ...prev,
                              selectedLayers: [1, 2, 3, 4, 5, 6],
                            }))
                          }
                          aria-pressed={demoState.selectedLayers.length === 6}
                          aria-describedby="all-layers-description"
                        >
                          All Layers
                        </button>
                      </div>
                      <div id="auto-detect-description" className="sr-only">
                        Let NeuroLint Pro automatically select appropriate
                        layers
                      </div>
                      <div id="all-layers-description" className="sr-only">
                        Run all 6 layers of analysis and fixes
                      </div>
                      <div
                        className="layer-checkboxes"
                        role="group"
                        aria-labelledby="individual-layers"
                      >
                        <span id="individual-layers" className="sr-only">
                          Individual layer selection
                        </span>
                        {[1, 2, 3, 4, 5, 6].map((layerId) => (
                          <label key={layerId} className="layer-checkbox">
                            <input
                              type="checkbox"
                              checked={demoState.selectedLayers.includes(
                                layerId,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDemoState((prev) => ({
                                    ...prev,
                                    selectedLayers: [
                                      ...prev.selectedLayers,
                                      layerId,
                                    ].sort(),
                                  }));
                                } else {
                                  setDemoState((prev) => ({
                                    ...prev,
                                    selectedLayers: prev.selectedLayers.filter(
                                      (id) => id !== layerId,
                                    ),
                                  }));
                                }
                              }}
                              aria-describedby={`layer-${layerId}-description`}
                            />
                            <span className="layer-label">Layer {layerId}</span>
                            <span
                              id={`layer-${layerId}-description`}
                              className="sr-only"
                            >
                              {layerId === 1 && "Configuration fixes"}
                              {layerId === 2 && "Pattern detection and cleanup"}
                              {layerId === 3 && "Component improvements"}
                              {layerId === 4 && "Hydration safety"}
                              {layerId === 5 && "Next.js optimizations"}
                              {layerId === 6 && "Testing enhancements"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Demo Settings Status */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    padding: "0.75rem",
                    background: "rgba(33, 150, 243, 0.08)",
                    border: "1px solid rgba(33, 150, 243, 0.2)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 2px 8px rgba(33, 150, 243, 0.1)",
                  }}
                >
                  <strong>Current Settings:</strong>{" "}
                  <span
                    style={{
                      color: demoState.applyFixes ? "#ff9800" : "#4caf50",
                    }}
                  >
                    {demoState.applyFixes ? "Apply Fixes Mode" : "Dry-Run Mode"}
                  </span>
                  {" • "}
                  <span style={{ color: "#2196f3" }}>
                    {demoState.selectedLayers.length === 0
                      ? "Auto-Detect Layers"
                      : demoState.selectedLayers.length === 6
                        ? "All 6 Layers"
                        : `Custom Layers [${demoState.selectedLayers.join(",")}]`}
                  </span>
                </div>

                <div className="demo-upload-section">
                  <div
                    className="upload-area"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        document.getElementById("fileInput")?.click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload React or Next.js files for analysis"
                    aria-describedby="upload-instructions"
                  >
                    <h3>Upload Your Files</h3>
                    <p id="upload-instructions">
                      Drop React/Next.js files here or click to browse
                    </p>
                    <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                      Supports .jsx, .tsx, .js, .ts files
                    </p>
                    <input
                      type="file"
                      id="fileInput"
                      className="file-input"
                      accept=".jsx,.tsx,.js,.ts"
                      onChange={handleFileUpload}
                      aria-describedby="file-types"
                    />
                    <span id="file-types" className="sr-only">
                      Accepted file types: JavaScript JSX, TypeScript TSX,
                      JavaScript, and TypeScript files
                    </span>
                  </div>

                  <div
                    className="sample-code-section"
                    role="region"
                    aria-labelledby="sample-title"
                  >
                    <h3 id="sample-title">Try Sample Code</h3>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: "1.5rem",
                      }}
                    >
                      See real fixes on common React issues
                    </p>
                    <div
                      className="sample-buttons"
                      role="group"
                      aria-labelledby="sample-title"
                    >
                      {onboardingData.projectType ? (
                        <>
                          <div className="recommended-label">
                            <span>
                              Recommended for{" "}
                              {
                                onboardingSteps[1].options?.find(
                                  (o) => o.value === onboardingData.projectType,
                                )?.label
                              }
                              :
                            </span>
                          </div>
                          {getRecommendedSamples().map((sampleKey) => {
                            const sample =
                              sampleCodes[
                                sampleKey as keyof typeof sampleCodes
                              ];
                            return (
                              <button
                                key={sampleKey}
                                className={`sample-btn ${demoState.isLoading && demoState.currentSample === sampleKey ? "loading" : ""} ${getRecommendedSamples()[0] === sampleKey ? "recommended" : ""}`}
                                onClick={() => loadSampleCode(sampleKey)}
                                disabled={demoState.isLoading}
                              >
                                {demoState.isLoading &&
                                demoState.currentSample === sampleKey
                                  ? "Analyzing..."
                                  : sample.name}
                              </button>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <button
                            className={`sample-btn ${demoState.isLoading && demoState.currentSample === "missing-keys" ? "loading" : ""}`}
                            onClick={() => loadSampleCode("missing-keys")}
                            disabled={demoState.isLoading}
                          >
                            {demoState.isLoading &&
                            demoState.currentSample === "missing-keys"
                              ? "Analyzing..."
                              : "Missing Keys & Entities"}
                          </button>
                          <button
                            className={`sample-btn ${demoState.isLoading && demoState.currentSample === "html-entities" ? "loading" : ""}`}
                            onClick={() => loadSampleCode("html-entities")}
                            disabled={demoState.isLoading}
                          >
                            {demoState.isLoading &&
                            demoState.currentSample === "html-entities"
                              ? "Analyzing..."
                              : "HTML Entity Corruption"}
                          </button>
                          <button
                            className={`sample-btn ${demoState.isLoading && demoState.currentSample === "ssr-issues" ? "loading" : ""}`}
                            onClick={() => loadSampleCode("ssr-issues")}
                            disabled={demoState.isLoading}
                          >
                            {demoState.isLoading &&
                            demoState.currentSample === "ssr-issues"
                              ? "Analyzing..."
                              : "SSR Hydration Issues"}
                          </button>
                          <button
                            className={`sample-btn ${demoState.isLoading && demoState.currentSample === "accessibility" ? "loading" : ""}`}
                            onClick={() => loadSampleCode("accessibility")}
                            disabled={demoState.isLoading}
                          >
                            {demoState.isLoading &&
                            demoState.currentSample === "accessibility"
                              ? "Analyzing..."
                              : "Accessibility & Testing"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Demo Reset Button */}
                {demoState.showResults && (
                  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <button
                      className="control-btn"
                      onClick={() =>
                        setDemoState((prev) => ({
                          ...prev,
                          showResults: false,
                          result: null,
                        }))
                      }
                      aria-label="Clear demo results and start over"
                    >
                      Clear Results
                    </button>
                  </div>
                )}

                {/* Sophisticated Analysis Results Display */}
                {demoState.showResults && demoState.result && (
                  <div className="demo-results">
                    <h3 className="results-title">
                      NeuroLint Pro Analysis Results
                    </h3>

                    {demoState.result.success ? (
                      <>
                        {/* Premium Business Insights */}
                        {demoState.result.analysis && (
                          <div className="business-insights">
                            <h4>Technical Impact Analysis</h4>
                            <div className="insights-grid">
                              <div className="insight-card">
                                <div className="insight-label">
                                  Potential Savings
                                </div>
                                <div className="insight-value">
                                  ~
                                  {Math.round(
                                    (demoState.result.analysis.detectedIssues
                                      ?.length || 0) * 2.5,
                                  )}{" "}
                                  hours dev time
                                </div>
                              </div>
                              <div className="insight-card">
                                <div className="insight-label">
                                  Performance Gain
                                </div>
                                <div className="insight-value">
                                  {demoState.result.analysis.estimatedImpact
                                    .level === "high"
                                    ? "15-25%"
                                    : "5-15%"}{" "}
                                  faster
                                </div>
                              </div>
                              <div className="insight-card">
                                <div className="insight-label">
                                  Risk Reduction
                                </div>
                                <div className="insight-value">
                                  {
                                    demoState.result.analysis.detectedIssues.filter(
                                      (i) =>
                                        i.severity === "high" ||
                                        i.severity === "critical",
                                    ).length
                                  }{" "}
                                  critical issues
                                </div>
                              </div>
                              <div className="insight-card">
                                <div className="insight-label">
                                  Standards Compliance
                                </div>
                                <div className="insight-value">
                                  {Math.round(
                                    demoState.result.analysis.confidence * 100,
                                  )}
                                  % best practices
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Analysis Summary */}
                        {demoState.result.analysis && (
                          <div className="analysis-summary">
                            <div className="analysis-grid">
                              <div className="analysis-card">
                                <div className="analysis-label">
                                  Analysis Score
                                </div>
                                <div className="analysis-value">
                                  {(
                                    demoState.result.analysis.confidence * 100
                                  ).toFixed(1)}
                                  %
                                </div>
                              </div>
                              <div className="analysis-card">
                                <div className="analysis-label">
                                  Impact Level
                                </div>
                                <div className="analysis-value">
                                  {demoState.result.analysis.estimatedImpact.level.toUpperCase()}
                                </div>
                              </div>
                              <div className="analysis-card">
                                <div className="analysis-label">
                                  Issues Found
                                </div>
                                <div className="analysis-value">
                                  {
                                    demoState.result.analysis.detectedIssues
                                      .length
                                  }
                                </div>
                              </div>
                              <div className="analysis-card">
                                <div className="analysis-label">
                                  Recommended Layers
                                </div>
                                <div className="analysis-value">
                                  {demoState.result.analysis.recommendedLayers.join(
                                    ", ",
                                  )}
                                </div>
                              </div>
                              <div className="analysis-card">
                                <div className="analysis-label">
                                  Est. Fix Time
                                </div>
                                <div className="analysis-value">
                                  {
                                    demoState.result.analysis.estimatedImpact
                                      .estimatedFixTime
                                  }
                                </div>
                              </div>
                              <div className="analysis-card">
                                <div className="analysis-label">
                                  Processing Time
                                </div>
                                <div className="analysis-value">
                                  {demoState.result.totalExecutionTime || 0}ms
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detected Issues Breakdown */}
                        {demoState.result.analysis?.detectedIssues &&
                          demoState.result.analysis.detectedIssues.length >
                            0 && (
                            <div className="issues-breakdown">
                              <h4>Detected Issues by Layer</h4>
                              <div className="issues-list">
                                {demoState.result.analysis.detectedIssues.map(
                                  (issue, index) => (
                                    <div
                                      key={index}
                                      className={`issue-item severity-${issue.severity}`}
                                    >
                                      <div className="issue-header">
                                        <span className="issue-type">
                                          Layer {issue.fixedByLayer}
                                        </span>
                                        <span
                                          className={`issue-severity ${issue.severity}`}
                                        >
                                          {issue.severity.toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="issue-description">
                                        {issue.description}
                                      </div>
                                      <div className="issue-details">
                                        <div className="issue-pattern">
                                          <strong>Pattern:</strong>{" "}
                                          {issue.pattern}
                                        </div>
                                        {issue.count && (
                                          <div className="issue-count">
                                            <strong>Occurrences:</strong>{" "}
                                            {issue.count}
                                          </div>
                                        )}
                                        <div className="issue-impact">
                                          <strong>Business Impact:</strong>{" "}
                                          {getBusinessImpact(
                                            issue.type,
                                            issue.severity,
                                          )}
                                        </div>
                                        <div className="issue-solution">
                                          <strong>Solution:</strong>{" "}
                                          {getSolutionDescription(issue.type)}
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Layer Execution Results */}
                        {demoState.result.layers &&
                          demoState.result.layers.length > 0 && (
                            <div className="layer-results">
                              <h4>Layer Execution Summary</h4>
                              <div className="layers-grid">
                                {demoState.result.layers.map((layer) => (
                                  <div
                                    key={layer.layerId}
                                    className={`layer-card ${layer.success ? "success" : "failed"}`}
                                  >
                                    <div className="layer-header">
                                      <span className="layer-name">
                                        Layer {layer.layerId}
                                      </span>
                                      <span
                                        className={`layer-status ${layer.success ? "success" : "failed"}`}
                                      >
                                        {layer.success ? "SUCCESS" : "FAILED"}
                                      </span>
                                    </div>
                                    <div className="layer-time">
                                      {layer.executionTime.toFixed(0)}ms
                                    </div>
                                    {layer.improvements &&
                                      layer.improvements.length > 0 && (
                                        <div className="layer-improvements">
                                          {layer.improvements.map(
                                            (improvement, index) => (
                                              <div
                                                key={index}
                                                className="improvement-item"
                                              >
                                                �� {improvement}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Before/After Code Display */}
                        {demoState.result.originalCode &&
                          demoState.result.transformed && (
                            <div className="code-comparison">
                              <h4>Before & After Comparison</h4>
                              {demoState.result.originalCode ===
                              demoState.result.transformed ? (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "2rem",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    borderRadius: "8px",
                                    color: "rgba(255, 255, 255, 0.7)",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: "1.1rem",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    <strong>No Changes Needed</strong>
                                  </p>
                                  <p style={{ fontSize: "0.9rem" }}>
                                    Your code is already in great shape! No
                                    fixes were required.
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <div
                                    style={{
                                      textAlign: "center",
                                      marginBottom: "1rem",
                                      fontSize: "0.9rem",
                                      color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                  >
                                    {demoState.result.dryRun ? (
                                      <span style={{ color: "#4caf50" }}>
                                        <strong>Preview:</strong> This shows
                                        what would be fixed in Apply Fixes mode
                                      </span>
                                    ) : (
                                      <span style={{ color: "#ff9800" }}>
                                        <strong>Applied:</strong> Your code has
                                        been transformed
                                      </span>
                                    )}
                                  </div>
                                  <div className="code-panels">
                                    <div className="code-panel">
                                      <div className="code-panel-header">
                                        <span>Original Code</span>
                                        <div className="code-actions">
                                          <button
                                            className="code-action-btn"
                                            onClick={() =>
                                              copyToClipboard(
                                                demoState.result
                                                  ?.originalCode || "",
                                                "Original",
                                              )
                                            }
                                            title="Copy original code"
                                            aria-label="Copy original code to clipboard"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                            >
                                              <rect
                                                x="9"
                                                y="9"
                                                width="13"
                                                height="13"
                                                rx="2"
                                                ry="2"
                                              ></rect>
                                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                            </svg>
                                          </button>
                                          <button
                                            className="code-action-btn"
                                            onClick={() =>
                                              downloadCode(
                                                demoState.result
                                                  ?.originalCode || "",
                                                "original-code.tsx",
                                              )
                                            }
                                            title="Download original code"
                                            aria-label="Download original code as file"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                            >
                                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                              <polyline points="7,10 12,15 17,10"></polyline>
                                              <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                              ></line>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                      <pre className="code-block original">
                                        <code>
                                          {demoState.result.originalCode}
                                        </code>
                                      </pre>
                                    </div>
                                    <div className="code-panel">
                                      <div className="code-panel-header">
                                        <span>
                                          {demoState.result.dryRun
                                            ? "Preview Fixed"
                                            : "NeuroLint Pro Fixed"}
                                        </span>
                                        <div className="code-actions">
                                          <button
                                            className="code-action-btn"
                                            onClick={() =>
                                              copyToClipboard(
                                                demoState.result?.transformed ||
                                                  "",
                                                "Fixed",
                                              )
                                            }
                                            title="Copy fixed code"
                                            aria-label="Copy fixed code to clipboard"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                            >
                                              <rect
                                                x="9"
                                                y="9"
                                                width="13"
                                                height="13"
                                                rx="2"
                                                ry="2"
                                              ></rect>
                                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                            </svg>
                                          </button>
                                          <button
                                            className="code-action-btn"
                                            onClick={() =>
                                              downloadCode(
                                                demoState.result?.transformed ||
                                                  "",
                                                "fixed-code.tsx",
                                              )
                                            }
                                            title="Download fixed code"
                                            aria-label="Download fixed code as file"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                            >
                                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                              <polyline points="7,10 12,15 17,10"></polyline>
                                              <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                              ></line>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                      <pre className="code-block transformed">
                                        <code>
                                          {demoState.result.transformed}
                                        </code>
                                      </pre>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                        {/* Fallback when code comparison is not available */}
                        {(!demoState.result?.originalCode ||
                          !demoState.result?.transformed) &&
                          demoState.result?.success && (
                            <div className="code-comparison">
                              <h4>Code Analysis Complete</h4>
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "2rem",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  borderRadius: "8px",
                                  color: "rgba(255, 255, 255, 0.7)",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Analysis Complete</strong>
                                </p>
                                <p style={{ fontSize: "0.9rem" }}>
                                  {demoState.result?.analysis?.detectedIssues
                                    ?.length > 0
                                    ? `Found ${demoState.result?.analysis?.detectedIssues?.length || 0} issues that can be fixed. Switch to "Apply Fixes" mode to see the transformed code.`
                                    : "No issues detected in your code. Great job!"}
                                </p>
                              </div>
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="error-result">
                        <h4>Analysis Failed</h4>
                        <p>
                          {demoState.result.error ||
                            "Unknown error occurred during analysis"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
