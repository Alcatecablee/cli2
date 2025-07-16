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
  const [isConnected, setIsConnected] = useState(false);
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
  const [isHost, setIsHost] = useState(false);

  // UI state
  const [showComments, setShowComments] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentPosition, setCommentPosition] = useState<CursorPosition | null>(
    null,
  );
  const [newCommentText, setNewCommentText] = useState("");

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const operationsQueue = useRef<Operation[]>([]);

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
   * WebSocket connection management
   */
  const connectToSession = useCallback(() => {
    if (!sessionId) return;

    const ws = new WebSocket(`ws://localhost:8080`);
    websocketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);

      // Join or create session
      ws.send(
        JSON.stringify({
          type: sessionId ? "join-session" : "create-session",
          data: {
            sessionId,
            userData: {
              ...userData,
              color: userColor,
            },
            document: {
              content: code,
              filename,
              language,
            },
          },
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error("[COLLABORATION] Failed to parse message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(() => {
        if (sessionId) {
          connectToSession();
        }
      }, 3000); // Reconnect after 3 seconds
    };

    ws.onerror = (error) => {
      console.error("[COLLABORATION] WebSocket error:", error);
      setIsConnected(false);
    };
  }, [sessionId, userData, userColor, code, filename, language]);

  /**
   * Handle WebSocket messages
   */
  const handleWebSocketMessage = useCallback(
    (message: any) => {
      const { type, data } = message;

      switch (type) {
        case "session-state":
          setCode(data.document.content);
          setRevisionNumber(data.revision);
          setIsHost(data.isHost);

          // Update collaborators
          const collaboratorsMap = new Map();
          data.clients.forEach((client: any) => {
            if (client.id !== userData.id) {
              collaboratorsMap.set(client.id, client);
            }
          });
          setCollaborators(collaboratorsMap);

          // Update comments
          setComments(data.comments || []);
          break;

        case "operation":
          applyRemoteOperation(data.operation);
          setRevisionNumber(data.revision);
          break;

        case "cursor-update":
          updateCollaboratorCursor(data.clientId, data.cursor);
          break;

        case "selection-update":
          updateCollaboratorSelection(data.clientId, data.selection);
          break;

        case "client-joined":
          addCollaborator(data.client);
          break;

        case "client-left":
          removeCollaborator(data.clientId);
          if (data.newHost === userData.id) {
            setIsHost(true);
          }
          break;

        case "comment-added":
          setComments((prev) => [...prev, data]);
          break;

        case "neurolint-result":
          // Handle NeuroLint Pro results
          console.log("[COLLABORATION] NeuroLint result:", data.result);
          break;

        case "error":
          console.error("[COLLABORATION] Server error:", data.error);
          break;
      }
    },
    [userData.id],
  );

  /**
   * Apply remote operation to local document
   */
  const applyRemoteOperation = useCallback((operation: Operation) => {
    setCode((currentCode) => {
      switch (operation.type) {
        case "insert":
          return (
            currentCode.slice(0, operation.position) +
            operation.content +
            currentCode.slice(operation.position)
          );

        case "delete":
          return (
            currentCode.slice(0, operation.position) +
            currentCode.slice(operation.position + (operation.length || 0))
          );

        case "replace":
          return (
            currentCode.slice(0, operation.position) +
            operation.content +
            currentCode.slice(operation.position + (operation.oldLength || 0))
          );

        default:
          return currentCode;
      }
    });
  }, []);

  /**
   * Send operation to server
   */
  const sendOperation = useCallback(
    (operation: Operation) => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(
          JSON.stringify({
            type: "operation",
            data: {
              ...operation,
              baseRevision: revisionNumber,
            },
          }),
        );
      }
    },
    [revisionNumber],
  );

  /**
   * Handle text change in editor
   */
  const handleCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = event.target.value;
      const oldCode = code;

      if (newCode === oldCode) return;

      // Calculate operation
      let operation: Operation | null = null;

      if (newCode.length > oldCode.length) {
        // Insertion
        const position = findDifferencePosition(oldCode, newCode);
        const insertedText = newCode.slice(
          position,
          position + (newCode.length - oldCode.length),
        );

        operation = {
          type: "insert",
          position,
          content: insertedText,
          baseRevision: revisionNumber,
        };
      } else if (newCode.length < oldCode.length) {
        // Deletion
        const position = findDifferencePosition(newCode, oldCode);
        const deletedLength = oldCode.length - newCode.length;

        operation = {
          type: "delete",
          position,
          length: deletedLength,
          baseRevision: revisionNumber,
        };
      } else {
        // Replacement
        const position = findDifferencePosition(oldCode, newCode);
        const endPosition = findDifferencePosition(
          oldCode.split("").reverse().join(""),
          newCode.split("").reverse().join(""),
        );

        operation = {
          type: "replace",
          position,
          content: newCode.slice(position, newCode.length - endPosition),
          oldLength: oldCode.length - endPosition - position,
          baseRevision: revisionNumber,
        };
      }

      setCode(newCode);

      if (operation) {
        sendOperation(operation);
      }

      onCodeChange?.(newCode);
    },
    [code, revisionNumber, sendOperation, onCodeChange],
  );

  /**
   * Find position where two strings differ
   */
  const findDifferencePosition = (str1: string, str2: string): number => {
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
      if (str1[i] !== str2[i]) {
        return i;
      }
    }
    return Math.min(str1.length, str2.length);
  };

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

    // Send cursor update
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({
          type: "cursor-update",
          data: { cursor: newCursor },
        }),
      );
    }

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

      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(
          JSON.stringify({
            type: "selection-update",
            data: { selection: newSelection },
          }),
        );
      }
    } else {
      setSelection(null);

      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(
          JSON.stringify({
            type: "selection-update",
            data: { selection: null },
          }),
        );
      }
    }
  }, [code]);

  /**
   * Update collaborator cursor
   */
  const updateCollaboratorCursor = useCallback(
    (clientId: string, cursor: CursorPosition) => {
      setCollaborators((prev) => {
        const updated = new Map(prev);
        const collaborator = updated.get(clientId);
        if (collaborator) {
          updated.set(clientId, { ...collaborator, cursor });
        }
        return updated;
      });
    },
    [],
  );

  /**
   * Update collaborator selection
   */
  const updateCollaboratorSelection = useCallback(
    (clientId: string, selection: Selection | null) => {
      setCollaborators((prev) => {
        const updated = new Map(prev);
        const collaborator = updated.get(clientId);
        if (collaborator) {
          updated.set(clientId, { ...collaborator, selection });
        }
        return updated;
      });
    },
    [],
  );

  /**
   * Add collaborator
   */
  const addCollaborator = useCallback(
    (client: Collaborator) => {
      if (client.id !== userData.id) {
        setCollaborators((prev) => new Map(prev.set(client.id, client)));
      }
    },
    [userData.id],
  );

  /**
   * Remove collaborator
   */
  const removeCollaborator = useCallback((clientId: string) => {
    setCollaborators((prev) => {
      const updated = new Map(prev);
      updated.delete(clientId);
      return updated;
    });
  }, []);

  /**
   * Add comment at current cursor position
   */
  const handleAddComment = useCallback(() => {
    if (!newCommentText.trim() || !commentPosition) return;

    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({
          type: "add-comment",
          data: {
            content: newCommentText,
            line: commentPosition.line,
            column: commentPosition.column,
          },
        }),
      );
    }

    setNewCommentText("");
    setIsAddingComment(false);
    setCommentPosition(null);
  }, [newCommentText, commentPosition]);

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
  }, [code, onSave]);

  /**
   * Run NeuroLint Pro analysis
   */
  const runNeuroLint = useCallback((dryRun = true, layers?: number[]) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({
          type: "run-neurolint",
          data: {
            dryRun,
            layers,
          },
        }),
      );
    }
  }, []);

  // Initialize connection
  useEffect(() => {
    if (sessionId) {
      connectToSession();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [sessionId, connectToSession]);

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
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, startAddingComment]);

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
              background: isConnected
                ? "rgba(76, 175, 80, 0.12)"
                : "rgba(229, 62, 62, 0.12)",
              border: `1px solid ${isConnected ? "rgba(76, 175, 80, 0.3)" : "rgba(229, 62, 62, 0.3)"}`,
              fontSize: "0.75rem",
              color: isConnected ? "#4caf50" : "#e53e3e",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isConnected ? "#4caf50" : "#e53e3e",
              }}
            />
            {isConnected ? "Connected" : "Disconnected"}
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            💬 Comment
          </button>

          <button
            onClick={() => runNeuroLint(true)}
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(33, 150, 243, 0.12)",
              border: "1px solid rgba(33, 150, 243, 0.4)",
              borderRadius: "6px",
              color: "#2196f3",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(33, 150, 243, 0.2)";
              e.currentTarget.style.borderColor = "rgba(33, 150, 243, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(33, 150, 243, 0.12)";
              e.currentTarget.style.borderColor = "rgba(33, 150, 243, 0.4)";
            }}
          >
            🔧 Analyze
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(76, 175, 80, 0.12)",
              border: "1px solid rgba(76, 175, 80, 0.4)",
              borderRadius: "6px",
              color: "#4caf50",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(76, 175, 80, 0.2)";
              e.currentTarget.style.borderColor = "rgba(76, 175, 80, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(76, 175, 80, 0.12)";
              e.currentTarget.style.borderColor = "rgba(76, 175, 80, 0.4)";
            }}
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        {/* Collaborators Sidebar */}
        {showCollaborators && collaborators.size > 0 && (
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
                  {collaborator.isHost && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Host
                    </div>
                  )}
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
              placeholder="Start typing your React/TypeScript code..."
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
                      left: `${1.5 + collaborator.cursor.column * 8.4}rem`, // Approximate character width
                      top: `${1.5 + collaborator.cursor.line * 1.6 * 14}px`, // Line height
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

            {/* Live Selections */}
            {Array.from(collaborators.values()).map(
              (collaborator) =>
                collaborator.selection &&
                collaborator.isActive && (
                  <div
                    key={`selection-${collaborator.id}`}
                    style={{
                      position: "absolute",
                      left: `${1.5 + collaborator.selection.start.column * 8.4}rem`,
                      top: `${1.5 + collaborator.selection.start.line * 1.6 * 14}px`,
                      width: `${(collaborator.selection.end.column - collaborator.selection.start.column) * 8.4}px`,
                      height: `${(collaborator.selection.end.line - collaborator.selection.start.line + 1) * 1.6 * 14}px`,
                      background: `${collaborator.color}20`,
                      border: `1px solid ${collaborator.color}40`,
                      borderRadius: "2px",
                      pointerEvents: "none",
                      zIndex: 999,
                    }}
                  />
                ),
            )}
          </div>

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
        {showComments && comments.length > 0 && (
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
                  }}
                >
                  {comment.content}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.5)",
                    marginTop: "0.5rem",
                  }}
                >
                  {new Date(comment.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
