"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import CollaborativeEditor from "../../components/CollaborativeEditor";

interface ChatMessage {
  id: string;
  authorId: string;
  author: string;
  content: string;
  timestamp: string;
  type: "message" | "system" | "neurolint";
}

interface SessionInfo {
  id: string;
  name: string;
  filename: string;
  language: string;
  participantCount: number;
  createdAt: string;
  lastActivity: string;
}

export default function CollaboratePage() {
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isJoiningSession, setIsJoiningSession] = useState(false);
  const [joinSessionId, setJoinSessionId] = useState("");

  // User state
  const [userName, setUserName] = useState("");
  const [userSetup, setUserSetup] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Editor state
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("untitled.tsx");

  // WebSocket for chat
  const chatWsRef = useRef<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Generate user data
  const userData = {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: userName || "Anonymous",
    color: "#2196f3",
  };

  /**
   * Create new collaboration session
   */
  const createSession = useCallback(() => {
    if (!userName.trim()) {
      alert("Please enter your name first");
      return;
    }

    const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setIsCreatingSession(false);

    // Copy session link to clipboard
    const sessionLink = `${window.location.origin}/collaborate?session=${newSessionId}`;
    navigator.clipboard.writeText(sessionLink).then(() => {
      alert(
        "Session link copied to clipboard! Share it with your collaborators.",
      );
    });
  }, [userName]);

  /**
   * Join existing session
   */
  const joinSession = useCallback(() => {
    if (!userName.trim()) {
      alert("Please enter your name first");
      return;
    }

    if (!joinSessionId.trim()) {
      alert("Please enter a session ID");
      return;
    }

    setSessionId(joinSessionId);
    setIsJoiningSession(false);
  }, [userName, joinSessionId]);

  /**
   * Leave current session
   */
  const leaveSession = useCallback(() => {
    setSessionId(null);
    setChatMessages([]);
    setCode("");
    if (chatWsRef.current) {
      chatWsRef.current.close();
    }
  }, []);

  /**
   * Send chat message
   */
  const sendChatMessage = useCallback(() => {
    if (!newMessage.trim() || !chatWsRef.current) return;

    chatWsRef.current.send(
      JSON.stringify({
        type: "chat-message",
        data: {
          content: newMessage,
          type: "message",
        },
      }),
    );

    setNewMessage("");
  }, [newMessage]);

  /**
   * Setup chat WebSocket when session starts
   */
  useEffect(() => {
    if (sessionId && userData.name) {
      const ws = new WebSocket("ws://localhost:8080");
      chatWsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "join-session",
            data: {
              sessionId,
              userData,
            },
          }),
        );
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "chat-message") {
            setChatMessages((prev) => [...prev, message.data]);

            if (!showChat && message.data.authorId !== userData.id) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        } catch (error) {
          console.error("[CHAT] Failed to parse message:", error);
        }
      };

      return () => {
        ws.close();
      };
    }
  }, [sessionId, userData, showChat]);

  /**
   * Scroll chat to bottom
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  /**
   * Reset unread count when chat is opened
   */
  useEffect(() => {
    if (showChat) {
      setUnreadCount(0);
    }
  }, [showChat]);

  /**
   * Check for session ID in URL
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionFromUrl = urlParams.get("session");
    if (sessionFromUrl) {
      setJoinSessionId(sessionFromUrl);
      setIsJoiningSession(true);
    }
  }, []);

  if (!userSetup) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            padding: "3rem",
            maxWidth: "500px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              marginBottom: "1rem",
              background: "linear-gradient(45deg, #2196f3, #4caf50)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NeuroLint Pro Collaborate
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Real-time collaborative code editing with live NeuroLint Pro
            analysis
          </p>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "0.875rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "1rem",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(33, 150, 243, 0.4)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userName.trim()) {
                  setUserSetup(true);
                }
              }}
            />
          </div>

          <button
            onClick={() => setUserSetup(true)}
            disabled={!userName.trim()}
            style={{
              width: "100%",
              padding: "1rem 2rem",
              background: userName.trim()
                ? "rgba(33, 150, 243, 0.12)"
                : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${userName.trim() ? "rgba(33, 150, 243, 0.4)" : "rgba(255, 255, 255, 0.15)"}`,
              borderRadius: "8px",
              color: userName.trim() ? "#2196f3" : "rgba(255, 255, 255, 0.5)",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: userName.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "2rem",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 900,
              marginBottom: "1rem",
              background: "linear-gradient(45deg, #2196f3, #4caf50)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NeuroLint Pro Collaborate
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Welcome, <strong>{userName}</strong>! Start a new collaboration
            session or join an existing one.
          </p>
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "3rem 2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          {/* Create Session */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "20px",
              padding: "2rem",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(33, 150, 243, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(33, 150, 243, 0.12)",
                border: "1px solid rgba(33, 150, 243, 0.3)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              ✨
            </div>

            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#ffffff",
              }}
            >
              Create Session
            </h3>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Start a new collaborative coding session. You'll get a shareable
              link to invite others.
            </p>

            {isCreatingSession ? (
              <div>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Session name (optional)"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#ffffff",
                    marginBottom: "1rem",
                  }}
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={createSession}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background:
                        "linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.15) 50%, rgba(255, 255, 255, 0.1) 100%)",
                      border: "1px solid rgba(33, 150, 243, 0.4)",
                      borderRadius: "6px",
                      color: "#ffffff",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 12px rgba(33, 150, 243, 0.2)",
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setIsCreatingSession(false)}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "rgba(255, 255, 255, 0.7)",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingSession(true)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background:
                    "linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.15) 50%, rgba(255, 255, 255, 0.1) 100%)",
                  border: "1px solid rgba(33, 150, 243, 0.4)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 12px rgba(33, 150, 243, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 16px rgba(33, 150, 243, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 12px rgba(33, 150, 243, 0.2)";
                }}
              >
                Start New Session
              </button>
            )}
          </div>

          {/* Join Session */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "20px",
              padding: "2rem",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(76, 175, 80, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(76, 175, 80, 0.12)",
                border: "1px solid rgba(76, 175, 80, 0.3)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              🤝
            </div>

            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#ffffff",
              }}
            >
              Join Session
            </h3>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Join an existing collaboration session using a session ID or
              invite link.
            </p>

            {isJoiningSession ? (
              <div>
                <input
                  type="text"
                  value={joinSessionId}
                  onChange={(e) => setJoinSessionId(e.target.value)}
                  placeholder="Enter session ID"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#ffffff",
                    marginBottom: "1rem",
                  }}
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={joinSession}
                    disabled={!joinSessionId.trim()}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: joinSessionId.trim()
                        ? "rgba(76, 175, 80, 0.12)"
                        : "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${joinSessionId.trim() ? "rgba(76, 175, 80, 0.4)" : "rgba(255, 255, 255, 0.15)"}`,
                      borderRadius: "6px",
                      color: joinSessionId.trim()
                        ? "#4caf50"
                        : "rgba(255, 255, 255, 0.5)",
                      fontWeight: 600,
                      cursor: joinSessionId.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    Join
                  </button>
                  <button
                    onClick={() => {
                      setIsJoiningSession(false);
                      setJoinSessionId("");
                    }}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "rgba(255, 255, 255, 0.7)",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsJoiningSession(true)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "rgba(76, 175, 80, 0.12)",
                  border: "1px solid rgba(76, 175, 80, 0.4)",
                  borderRadius: "8px",
                  color: "#4caf50",
                  fontSize: "1rem",
                  fontWeight: 600,
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
                Join Existing Session
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "3rem",
              color: "#ffffff",
            }}
          >
            Collaboration Features
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: "⚡",
                title: "Real-time Editing",
                description:
                  "See changes instantly with live cursors and selections",
              },
              {
                icon: "🔧",
                title: "Live NeuroLint Pro",
                description:
                  "Run collaborative code analysis and fixes in real-time",
              },
              {
                icon: "💬",
                title: "Comments & Chat",
                description: "Add contextual comments and chat with your team",
              },
              {
                icon: "🎯",
                title: "Conflict Resolution",
                description:
                  "Advanced operational transforms prevent editing conflicts",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: "1.5rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#ffffff",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Main Editor */}
      <div style={{ flex: 1 }}>
        <CollaborativeEditor
          sessionId={sessionId}
          initialCode={code}
          filename={filename}
          userData={userData}
          onCodeChange={setCode}
          onSave={(code) => {
            console.log("Saving code:", code);
            // Implement save logic
          }}
        />
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div
          style={{
            width: "350px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.02)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "1rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              Team Chat
            </h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={leaveSession}
                style={{
                  padding: "0.5rem",
                  background: "rgba(229, 62, 62, 0.12)",
                  border: "1px solid rgba(229, 62, 62, 0.4)",
                  borderRadius: "4px",
                  color: "#e53e3e",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Leave
              </button>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  padding: "0.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {chatMessages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "0.875rem",
                  fontStyle: "italic",
                  marginTop: "2rem",
                }}
              >
                No messages yet. Start the conversation!
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background:
                      message.authorId === userData.id
                        ? "rgba(33, 150, 243, 0.12)"
                        : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${
                      message.authorId === userData.id
                        ? "rgba(33, 150, 243, 0.3)"
                        : "rgba(255, 255, 255, 0.1)"
                    }`,
                    marginLeft: message.authorId === userData.id ? "2rem" : "0",
                    marginRight:
                      message.authorId === userData.id ? "0" : "2rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color:
                        message.authorId === userData.id
                          ? "#2196f3"
                          : "#ffffff",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {message.author}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      lineHeight: 1.4,
                    }}
                  >
                    {message.content}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "6px",
                color: "#ffffff",
                fontSize: "0.875rem",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendChatMessage();
                }
              }}
            />
            <button
              onClick={sendChatMessage}
              disabled={!newMessage.trim()}
              style={{
                padding: "0.75rem",
                background: newMessage.trim()
                  ? "rgba(33, 150, 243, 0.12)"
                  : "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${newMessage.trim() ? "rgba(33, 150, 243, 0.4)" : "rgba(255, 255, 255, 0.15)"}`,
                borderRadius: "6px",
                color: newMessage.trim()
                  ? "#2196f3"
                  : "rgba(255, 255, 255, 0.5)",
                cursor: newMessage.trim() ? "pointer" : "not-allowed",
                fontSize: "0.875rem",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Chat Toggle (when hidden) */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "56px",
            height: "56px",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.15) 50%, rgba(255, 255, 255, 0.1) 100%)",
            border: "1px solid rgba(33, 150, 243, 0.4)",
            color: "#ffffff",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 12px rgba(33, 150, 243, 0.2)",
            fontSize: "1.25rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
          }}
        >
          ↔
          {unreadCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "#e53e3e",
                color: "#ffffff",
                borderRadius: "10px",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </button>
      )}
    </div>
  );
}
