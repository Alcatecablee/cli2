"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// Types for collaboration features
interface CursorPosition {
  line: number;
  column: number;
}

interface Selection {
  start: CursorPosition;
  end: CursorPosition;
}

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: CursorPosition;
  selection?: Selection;
  isActive: boolean;
  isHost?: boolean;
}

interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  line: number;
  column: number;
  timestamp: string;
  resolved: boolean;
}

interface Operation {
  type: "insert" | "delete" | "replace";
  position: number;
  content?: string;
  length?: number;
  oldLength?: number;
  baseRevision: number;
  clientId?: string;
}

interface CollaborativeEditorProps {
  sessionId?: string;
  initialCode?: string;
  filename?: string;
  language?: string;
  readonly?: boolean;
  onCodeChange?: (code: string) => void;
  onSave?: (code: string) => void;
  userData: {
    id: string;
    name: string;
    avatar?: string;
    color?: string;
  };
}

/**
 * Collaborative Code Editor Component
 * Following NeuroLint Pro design system
 * Now using real API calls instead of WebSocket for demo purposes
 */
export default function CollaborativeEditor({
  sessionId,
  initialCode = "",
  filename = "untitled.tsx",
  language = "typescript",
  readonly = false,
  onCodeChange,
  onSave,
  userData,
}: CollaborativeEditorProps) {
  // Core state
  const [code, setCode] = useState(initialCode);
  const [isConnected, setIsConnected] = useState(true); // Always connected in API mode
  const [collaborators, setCollaborators] = useState<Map<string, Collaborator>>(
    new Map(),
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null,
  );

  // Editor state
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    line: 0,
    column: 0,
  });
  const [selection, setSelection] = useState<Selection | null>(null);
  const [revisionNumber, setRevisionNumber] = useState(0);
  const [isHost, setIsHost] = useState(true); // Default to host in demo mode

  // UI state
  const [showComments, setShowComments] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentPosition, setCommentPosition] = useState<CursorPosition | null>(
    null,
  );
  const [newCommentText, setNewCommentText] = useState("");

  // Analysis state
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Assign a color to the user if not provided
  const userColor = useMemo(() => {
    return (
      userData.color ||
      [
        "#2196f3",
        "#4caf50",
        "#ff9800",
        "#e91e63",
        "#9c27b0",
        "#00bcd4",
        "#ff5722",
        "#795548",
      ][userData.id.charCodeAt(0) % 8]
    );
  }, [userData.color, userData.id]);

  /**
   * Handle text change in editor
   */
  const handleCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = event.target.value;
      setCode(newCode);
      setRevisionNumber((prev) => prev + 1);
      onCodeChange?.(newCode);
    },
    [onCodeChange],
  );

  /**
   * Handle cursor position change
   */
  const handleCursorChange = useCallback(() => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const { selectionStart, selectionEnd } = textarea;

    // Calculate line and column
    const lines = code.slice(0, selectionStart).split("\n");
    const newCursor = {
      line: lines.length - 1,
      column: lines[lines.length - 1].length,
    };

    setCursorPosition(newCursor);

    // Handle selection
    if (selectionStart !== selectionEnd) {
      const endLines = code.slice(0, selectionEnd).split("\n");
      const newSelection = {
        start: newCursor,
        end: {
          line: endLines.length - 1,
          column: endLines[endLines.length - 1].length,
        },
      };
      setSelection(newSelection);
    } else {
      setSelection(null);
    }
  }, [code]);

  /**
   * Add comment at current cursor position
   */
  const handleAddComment = useCallback(() => {
    if (!newCommentText.trim() || !commentPosition) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      authorId: userData.id,
      author: userData.name,
      content: newCommentText,
      line: commentPosition.line,
      column: commentPosition.column,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    setComments((prev) => [...prev, newComment]);
    setNewCommentText("");
    setIsAddingComment(false);
    setCommentPosition(null);
  }, [newCommentText, commentPosition, userData.id, userData.name]);

  /**
   * Start adding comment
   */
  const startAddingComment = useCallback(() => {
    setCommentPosition(cursorPosition);
    setIsAddingComment(true);
  }, [cursorPosition]);

  /**
   * Save code
   */
  const handleSave = useCallback(() => {
    onSave?.(code);

    // Show save confirmation
    const saveIndicator = document.createElement("div");
    saveIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(76, 175, 80, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.875rem;
      z-index: 10000;
      transition: opacity 0.3s ease;
    `;
    saveIndicator.textContent = "Code saved!";
    document.body.appendChild(saveIndicator);

    setTimeout(() => {
      saveIndicator.style.opacity = "0";
      setTimeout(() => document.body.removeChild(saveIndicator), 300);
    }, 2000);
  }, [code, onSave]);

  /**
   * Run NeuroLint Pro analysis using real API
   */
  const runNeuroLint = useCallback(
    async (dryRun = true, layers?: number[]) => {
      if (!code.trim()) {
        alert("Please enter some code to analyze");
        return;
      }

      setIsAnalyzing(true);
      setAnalysisResult(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            filename,
            layers: layers || "auto",
            applyFixes: !dryRun,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Analysis failed");
        }

        setAnalysisResult(result);

        // Show analysis completion notification
        const notification = document.createElement("div");
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(33, 150, 243, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 10000;
        transition: opacity 0.3s ease;
      `;
        notification.textContent = `Analysis complete: ${result.analysis?.detectedIssues?.length || 0} issues found`;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = "0";
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);

        // If not dry run and we have transformed code, update the editor
        if (!dryRun && result.transformed && result.transformed !== code) {
          setCode(result.transformed);
          onCodeChange?.(result.transformed);
        }
      } catch (error) {
        console.error("NeuroLint analysis failed:", error);
        alert(
          `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsAnalyzing(false);
      }
    },
    [code, filename, onCodeChange],
  );

  /**
   * Resolve comment
   */
  const resolveComment = useCallback((commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, resolved: true } : comment,
      ),
    );
  }, []);

  // Initialize with demo collaborators
  useEffect(() => {
    if (sessionId) {
      // Add some demo collaborators for demonstration
      const demoCollaborators = new Map<string, Collaborator>();

      demoCollaborators.set("demo-user-1", {
        id: "demo-user-1",
        name: "Sarah Chen",
        color: "#4caf50",
        isActive: true,
        cursor: { line: 5, column: 12 },
      });

      demoCollaborators.set("demo-user-2", {
        id: "demo-user-2",
        name: "Alex Rodriguez",
        color: "#ff9800",
        isActive: true,
        cursor: { line: 15, column: 8 },
      });

      setCollaborators(demoCollaborators);
    }
  }, [sessionId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "s":
            event.preventDefault();
            handleSave();
            break;
          case "/":
            event.preventDefault();
            startAddingComment();
            break;
          case "Enter":
            if (event.shiftKey) {
              event.preventDefault();
              runNeuroLint(true);
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, startAddingComment, runNeuroLint]);

  return (
    <div
      style={{
        background: "#000000",
        color: "#ffffff",
        minHeight: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            {filename}
          </h1>

          {/* Connection Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              background: "rgba(76, 175, 80, 0.12)",
              border: "1px solid rgba(76, 175, 80, 0.3)",
              fontSize: "0.75rem",
              color: "#4caf50",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#4caf50",
              }}
            />
            Connected
          </div>

          {/* Collaborator Count */}
          {collaborators.size > 0 && (
            <div
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "4px",
                background: "rgba(33, 150, 243, 0.12)",
                border: "1px solid rgba(33, 150, 243, 0.3)",
                fontSize: "0.75rem",
                color: "#2196f3",
              }}
            >
              {collaborators.size + 1} collaborators
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={startAddingComment}
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "6px",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Comment
          </button>

          <button
            onClick={() => runNeuroLint(true)}
            disabled={isAnalyzing}
            style={{
              padding: "0.5rem 1rem",
              background:
                "linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.15) 50%, rgba(255, 255, 255, 0.1) 100%)",
              border: "1px solid rgba(33, 150, 243, 0.4)",
              borderRadius: "6px",
              color: "#ffffff",
              fontSize: "0.875rem",
              cursor: isAnalyzing ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 12px rgba(33, 150, 243, 0.2)",
              opacity: isAnalyzing ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isAnalyzing) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 16px rgba(33, 150, 243, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isAnalyzing) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 12px rgba(33, 150, 243, 0.2)";
              }
            }}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "6px",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        {/* Collaborators Sidebar */}
        {showCollaborators && (
          <div
            style={{
              width: "250px",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.02)",
              padding: "1rem",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.9)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Collaborators
            </h3>

            {/* Current User */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: userColor,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#ffffff",
                  }}
                >
                  {userData.name} (You)
                </div>
                {isHost && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Host
                  </div>
                )}
              </div>
            </div>

            {/* Other Collaborators */}
            {Array.from(collaborators.values()).map((collaborator) => (
              <div
                key={collaborator.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  background: collaborator.isActive
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(255, 255, 255, 0.01)",
                  marginBottom: "0.5rem",
                  opacity: collaborator.isActive ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: collaborator.color,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#ffffff",
                    }}
                  >
                    {collaborator.name}
                  </div>
                  {collaborator.cursor && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255, 255, 255, 0.5)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      Line {collaborator.cursor.line + 1}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Editor Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              ref={editorRef}
              value={code}
              onChange={handleCodeChange}
              onSelect={handleCursorChange}
              onKeyUp={handleCursorChange}
              onMouseUp={handleCursorChange}
              readOnly={readonly}
              placeholder="Start typing your React/TypeScript code... (Ctrl+Shift+Enter to analyze)"
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                padding: "1.5rem",
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "JetBrains Mono, Consolas, monospace",
                color: "#ffffff",
                caretColor: userColor,
              }}
            />

            {/* Live Cursors */}
            {Array.from(collaborators.values()).map(
              (collaborator) =>
                collaborator.cursor &&
                collaborator.isActive && (
                  <div
                    key={`cursor-${collaborator.id}`}
                    style={{
                      position: "absolute",
                      left: `${1.5 + collaborator.cursor.column * 8.4}rem`,
                      top: `${1.5 + collaborator.cursor.line * 1.6 * 14}px`,
                      width: "2px",
                      height: "14px",
                      background: collaborator.color,
                      borderRadius: "1px",
                      pointerEvents: "none",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-18px",
                        left: "-2px",
                        padding: "2px 4px",
                        background: collaborator.color,
                        color: "#ffffff",
                        fontSize: "10px",
                        borderRadius: "2px",
                        whiteSpace: "nowrap",
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {collaborator.name}
                    </div>
                  </div>
                ),
            )}
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.02)",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: "0.5rem",
                }}
              >
                Analysis Results:{" "}
                {analysisResult.analysis?.detectedIssues?.length || 0} issues
                found
              </div>
              {analysisResult.analysis?.detectedIssues?.map(
                (issue: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: "0.5rem",
                      marginBottom: "0.5rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    <div style={{ color: "#ff9800", fontWeight: 500 }}>
                      {issue.type} ({issue.severity})
                    </div>
                    <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {issue.description}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {/* Comment Input */}
          {isAddingComment && (
            <div
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: "0.5rem",
                }}
              >
                Add comment at line {(commentPosition?.line ?? 0) + 1}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Enter your comment..."
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment();
                    } else if (e.key === "Escape") {
                      setIsAddingComment(false);
                      setNewCommentText("");
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={handleAddComment}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "rgba(33, 150, 243, 0.12)",
                    border: "1px solid rgba(33, 150, 243, 0.4)",
                    borderRadius: "4px",
                    color: "#2196f3",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingComment(false);
                    setNewCommentText("");
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comments Sidebar */}
        {showComments && (comments.length > 0 || isAddingComment) && (
          <div
            style={{
              width: "300px",
              borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.02)",
              padding: "1rem",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.9)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Comments ({comments.length})
            </h3>

            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  background: comment.resolved
                    ? "rgba(255, 255, 255, 0.02)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${comment.resolved ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)"}`,
                  opacity: comment.resolved ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "#ffffff",
                    }}
                  >
                    {comment.author}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    Line {comment.line + 1}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.9)",
                    lineHeight: 1.4,
                    marginBottom: "0.5rem",
                  }}
                >
                  {comment.content}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {new Date(comment.timestamp).toLocaleTimeString()}
                  </div>
                  {!comment.resolved && (
                    <button
                      onClick={() => resolveComment(comment.id)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        background: "rgba(76, 175, 80, 0.12)",
                        border: "1px solid rgba(76, 175, 80, 0.4)",
                        borderRadius: "3px",
                        color: "#4caf50",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                      }}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
