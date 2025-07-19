"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface CollaborationSession {
  id: string;
  name: string;
  document_filename: string;
  document_language: string;
  host_user_id: string;
  created_at: string;
  last_activity: string;
  is_locked: boolean;
  participants?: Array<{
    id: string;
    user_id: string;
    user_name: string;
    user_color: string;
    is_active: boolean;
    is_host: boolean;
    last_seen_at: string;
  }>;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen: Date;
}

interface Activity {
  id: string;
  type:
    | "session_created"
    | "session_joined"
    | "session_left"
    | "document_edited"
    | "comment_added"
    | "analysis_run"
    | "session_deleted"
    | "member_invited"
    | "member_joined";
  sessionId?: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: string;
  fileName?: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  owner: string;
  created_at: string;
}

export default function CollaborationDashboard() {
  const [activeTab, setActiveTab] = useState<"sessions" | "teams" | "activity">(
    "sessions",
  );
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "locked">(
    "all",
  );
  const [newSessionName, setNewSessionName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newLanguage, setNewLanguage] = useState("javascript");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHeartbeatRef = useRef<Date>(new Date());

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    try {
      // Skip WebSocket connection in demo mode since the backend doesn't support it
      console.log(
        "WebSocket connection skipped - using REST API polling instead",
      );
      setError(null);
      return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/collaboration/ws`;

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("Connected to collaboration WebSocket");
        setError(null);
        lastHeartbeatRef.current = new Date();

        // Send heartbeat every 30 seconds
        const heartbeatInterval = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({ type: "heartbeat", timestamp: new Date() }),
            );
            lastHeartbeatRef.current = new Date();
          } else {
            clearInterval(heartbeatInterval);
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          switch (data.type) {
            case "session_updated":
              if (data.session) {
                setSessions((prev) =>
                  prev.map((session) =>
                    session.id === data.session.id ? data.session : session,
                  ),
                );
              }
              break;

            case "session_created":
              if (data.session) {
                setSessions((prev) => [...prev, data.session]);
                setActivities((prev) => [
                  {
                    id: `activity_${Date.now()}`,
                    type: "session_created",
                    sessionId: data.session.id,
                    userId: data.session.host_user_id || "unknown",
                    userName: data.session.host_name || "Unknown User",
                    timestamp: new Date(),
                    details: `Created session "${data.session.name}"`,
                    fileName: data.session.document_filename,
                  },
                  ...prev.slice(0, 49),
                ]);
              }
              break;

            case "participant_joined":
              if (data.sessionId && data.participant) {
                setSessions((prev) =>
                  prev.map((session) => {
                    if (session.id === data.sessionId) {
                      const updatedParticipants = [
                        ...(session.participants || []),
                        data.participant,
                      ];
                      return {
                        ...session,
                        participants: updatedParticipants,
                      };
                    }
                    return session;
                  }),
                );

                setActivities((prev) => [
                  {
                    id: `activity_${Date.now()}`,
                    type: "session_joined",
                    sessionId: data.sessionId,
                    userId: data.participant.user_id,
                    userName: data.participant.user_name,
                    timestamp: new Date(),
                    details: `Joined collaboration session`,
                  },
                  ...prev.slice(0, 49),
                ]);
              }
              break;

            case "participant_left":
              if (data.sessionId && data.userId) {
                setSessions((prev) =>
                  prev.map((session) => {
                    if (session.id === data.sessionId) {
                      const updatedParticipants = (
                        session.participants || []
                      ).filter((p) => p.user_id !== data.userId);
                      return {
                        ...session,
                        participants: updatedParticipants,
                      };
                    }
                    return session;
                  }),
                );

                setActivities((prev) => [
                  {
                    id: `activity_${Date.now()}`,
                    type: "session_left",
                    sessionId: data.sessionId,
                    userId: data.userId,
                    userName: data.userName || "Unknown User",
                    timestamp: new Date(),
                    details: `Left collaboration session`,
                  },
                  ...prev.slice(0, 49),
                ]);
              }
              break;

            case "heartbeat_response":
              lastHeartbeatRef.current = new Date();
              break;

            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);

        if (event.code !== 1000) {
          setError("Connection lost. Attempting to reconnect...");

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect WebSocket...");
            initializeWebSocket();
          }, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error details:", {
          type: error.type,
          target: error.target,
          timeStamp: error.timeStamp,
          eventPhase: error.eventPhase,
        });
        setError(
          `WebSocket connection failed: ${error.type || "Connection error"}`,
        );
      };
    } catch (e) {
      console.error("Failed to initialize WebSocket:", e);
      setError("Failed to establish real-time connection");
    }
  }, []);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch current user
        const userResponse = await fetch("/api/auth/current-user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUserId(userData.user?.id);
        }

        // Fetch collaboration sessions
        const sessionsResponse = await fetch("/api/collaboration/sessions");
        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        }

        // Fetch teams
        const teamsResponse = await fetch("/api/teams");
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setTeams(Array.isArray(teamsData) ? teamsData : []);
        }

        // Fetch activities
        const activitiesResponse = await fetch("/api/collaboration/activity");
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          const formattedActivities = (
            Array.isArray(activitiesData) ? activitiesData : []
          ).map((activity: any) => ({
            ...activity,
            timestamp: new Date(activity.timestamp),
          }));
          setActivities(formattedActivities);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching collaboration data:", error);
        setError("Failed to load collaboration data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    initializeWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [initializeWebSocket]);

  // Monitor WebSocket health
  useEffect(() => {
    const healthCheckInterval = setInterval(() => {
      const now = new Date();
      const timeSinceLastHeartbeat =
        now.getTime() - lastHeartbeatRef.current.getTime();

      if (timeSinceLastHeartbeat > 60000) {
        console.log("WebSocket seems unhealthy, reconnecting...");
        if (wsRef.current) {
          wsRef.current.close();
        }
        initializeWebSocket();
      }
    }, 30000);

    return () => clearInterval(healthCheckInterval);
  }, [initializeWebSocket]);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !session.is_locked) ||
      (statusFilter === "locked" && session.is_locked);
    return matchesSearch && matchesStatus;
  });

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim() || !newFileName.trim()) return;

    try {
      const response = await fetch("/api/collaboration/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSessionName,
          document_filename: newFileName,
          document_language: newLanguage,
        }),
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions((prev) => [newSession, ...prev]);
        setNewSessionName("");
        setNewFileName("");
        setNewLanguage("javascript");
        setIsCreateModalOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      setError("Failed to create session");
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const response = await fetch(
        `/api/collaboration/sessions/${sessionId}/join`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        // Session joined successfully, navigate or update UI as needed
        console.log("Joined session successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to join session");
      }
    } catch (error) {
      console.error("Error joining session:", error);
      setError("Failed to join session");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/collaboration/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setActivities((prev) => [
          {
            id: `activity_${Date.now()}`,
            type: "session_deleted",
            sessionId,
            userId: currentUserId || "unknown",
            userName: "You",
            timestamp: new Date(),
            details: "Deleted collaboration session",
          },
          ...prev.slice(0, 49),
        ]);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      setError("Failed to delete session");
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "session_created":
        return "➕";
      case "session_joined":
        return "👥";
      case "session_left":
        return "👋";
      case "document_edited":
        return "✏️";
      case "comment_added":
        return "💬";
      case "analysis_run":
        return "🔍";
      case "session_deleted":
        return "🗑️";
      default:
        return "📝";
    }
  };

  const getStatusColor = (status: TeamMember["status"]) => {
    switch (status) {
      case "online":
        return "#4CAF50";
      case "away":
        return "#FF9800";
      default:
        return "#757575";
    }
  };

  if (isLoading) {
    return (
      <div className="collaboration-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading collaboration data...</p>
        </div>
        <style jsx>{`
          .collaboration-dashboard {
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 50%,
              rgba(255, 255, 255, 0.02) 100%
            );
            border: 2px solid #000000;
            border-radius: 16px;
            margin: 1rem 0;
          }

          .loading-state {
            text-align: center;
            color: #ffffff;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

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
    <div className="collaboration-dashboard">
      {/* Header */}
      <div className="collaboration-header">
        <div className="header-title">
          <h2>Collaboration Dashboard</h2>
          <p>Manage sessions, teams, and collaborative work</p>
        </div>

        <div className="header-actions">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="create-session-btn"
          >
            ➕ New Session
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button
            onClick={() => setError(null)}
            className="error-dismiss"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        {[
          { id: "sessions", label: "Sessions", count: sessions.length },
          { id: "teams", label: "Teams", count: teams.length },
          { id: "activity", label: "Activity", count: activities.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "sessions" && (
          <div className="sessions-section">
            {/* Sessions Controls */}
            <div className="sessions-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-buttons">
                {[
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "locked", label: "Locked" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id as any)}
                    className={`filter-btn ${
                      statusFilter === filter.id ? "active" : ""
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sessions Grid */}
            <div className="sessions-grid">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <div key={session.id} className="session-card">
                    <div className="session-header">
                      <div className="session-info">
                        <h4 className="session-name">{session.name}</h4>
                        <p className="session-file">
                          📄 {session.document_filename}
                        </p>
                        <div className="session-meta">
                          <span className="language-tag">
                            {session.document_language}
                          </span>
                          <span
                            className={`status-indicator ${
                              session.is_locked ? "locked" : "active"
                            }`}
                          >
                            {session.is_locked ? "🔒 Locked" : "🟢 Active"}
                          </span>
                        </div>
                      </div>

                      <div className="session-actions">
                        <button
                          onClick={() => handleJoinSession(session.id)}
                          className="join-btn"
                          disabled={session.is_locked}
                        >
                          Join
                        </button>
                        {session.host_user_id === currentUserId && (
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="session-details">
                      <div className="participants-section">
                        <h5>
                          Participants ({session.participants?.length || 0})
                        </h5>
                        <div className="participants-list">
                          {session.participants
                            ?.slice(0, 5)
                            .map((participant) => (
                              <div
                                key={participant.id}
                                className="participant-item"
                                title={participant.user_name}
                              >
                                <div
                                  className="participant-avatar"
                                  style={{
                                    backgroundColor: participant.user_color,
                                  }}
                                >
                                  {participant.user_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                {participant.is_host && (
                                  <span className="host-badge">👑</span>
                                )}
                              </div>
                            ))}
                          {(session.participants?.length || 0) > 5 && (
                            <div className="participant-overflow">
                              +{(session.participants?.length || 0) - 5}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="session-timestamps">
                        <div className="timestamp-item">
                          <span className="timestamp-label">Created:</span>
                          <span className="timestamp-value">
                            {formatTimeAgo(session.created_at)}
                          </span>
                        </div>
                        <div className="timestamp-item">
                          <span className="timestamp-label">
                            Last Activity:
                          </span>
                          <span className="timestamp-value">
                            {formatTimeAgo(session.last_activity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No collaboration sessions found</h3>
                  <p>
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Create your first session to start collaborating"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="create-first-session-btn"
                    >
                      Create Session
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="teams-section">
            <div className="teams-header">
              <h3>Your Teams</h3>
              <button className="create-team-btn">Create Team</button>
            </div>

            <div className="teams-grid">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div key={team.id} className="team-card">
                    <div className="team-header">
                      <h4 className="team-name">{team.name}</h4>
                      <span className="member-count">
                        {team.memberCount} members
                      </span>
                    </div>
                    {team.description && (
                      <p className="team-description">{team.description}</p>
                    )}
                    <div className="team-footer">
                      <span className="team-owner">Owner: {team.owner}</span>
                      <span className="team-created">
                        Created {formatTimeAgo(team.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No teams yet</h3>
                  <p>Create or join a team to collaborate with others</p>
                  <button className="create-first-team-btn">Create Team</button>
                </div>
              )}
            </div>

            {/* Team Members Section */}
            {teamMembers.length > 0 && (
              <div className="team-members-section">
                <h3>Team Members</h3>
                <div className="members-grid">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="member-card">
                      <div className="member-avatar">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div
                          className="status-dot"
                          style={{
                            backgroundColor: getStatusColor(member.status),
                          }}
                        />
                      </div>
                      <div className="member-info">
                        <h5 className="member-name">{member.name}</h5>
                        <p className="member-email">{member.email}</p>
                        <div className="member-meta">
                          <span className="member-role">{member.role}</span>
                          <span className="member-status">{member.status}</span>
                        </div>
                        {member.status !== "online" && (
                          <span className="last-seen">
                            Last seen {formatTimeAgo(member.lastSeen)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-section">
            <div className="activity-header">
              <h3>Recent Activity</h3>
              <span className="activity-count">
                {activities.length} activities
              </span>
            </div>

            <div className="activity-list">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-main">
                        <span className="activity-user">
                          {activity.userName}
                        </span>
                        <span className="activity-action">
                          {activity.details || activity.type.replace("_", " ")}
                        </span>
                        {activity.fileName && (
                          <span className="activity-file">
                            on {activity.fileName}
                          </span>
                        )}
                      </div>
                      <div className="activity-timestamp">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No recent activity</h3>
                  <p>Start collaborating to see activity here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Session</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSession} className="session-form">
              <div className="form-group">
                <label htmlFor="sessionName">Session Name</label>
                <input
                  type="text"
                  id="sessionName"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="Enter session name..."
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fileName">File Name</label>
                <input
                  type="text"
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="example.js"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="form-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .collaboration-dashboard {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 2px solid #000000;
          border-radius: 16px;
          padding: 2rem;
          margin: 1rem 0;
          color: #ffffff;
          backdrop-filter: blur(12px);
          transition: transform 0.2s ease;
        }

        .collaboration-dashboard:hover {
          transform: translateY(-2px);
        }

        .collaboration-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-title h2 {
          color: #ffffff;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .header-title p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 0.95rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .create-session-btn {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.2) 100%
          );
          border: 2px solid #000000;
          border-radius: 12px;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .create-session-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.4) 0%,
            rgba(33, 150, 243, 0.3) 100%
          );
          transform: translateY(-1px);
        }

        .error-banner {
          background: linear-gradient(
            135deg,
            rgba(229, 62, 62, 0.2) 0%,
            rgba(229, 62, 62, 0.1) 100%
          );
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #ffffff;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .error-text {
          flex: 1;
          font-weight: 500;
        }

        .error-dismiss {
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .error-dismiss:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .tab-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 0.5rem;
        }

        .tab-button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
        }

        .tab-button.active {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.2) 100%
          );
          border: 2px solid #000000;
          color: #ffffff;
        }

        .tab-button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .tab-count {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid #000000;
          border-radius: 10px;
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .tab-content {
          min-height: 400px;
        }

        .sessions-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 300px;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .search-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(33, 150, 243, 0.5);
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #000000;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .filter-btn.active {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.2) 100%
          );
          color: #ffffff;
        }

        .filter-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .sessions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .session-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 2px solid #000000;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }

        .session-card:hover {
          transform: translateY(-2px);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 100%
          );
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .session-info {
          flex: 1;
        }

        .session-name {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .session-file {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin: 0 0 0.75rem 0;
        }

        .session-meta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .language-tag {
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid #000000;
          border-radius: 8px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4caf50;
          text-transform: uppercase;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-indicator.active {
          color: #4caf50;
        }

        .status-indicator.locked {
          color: #ff9800;
        }

        .session-actions {
          display: flex;
          gap: 0.5rem;
          flex-direction: column;
        }

        .join-btn {
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.3) 0%,
            rgba(76, 175, 80, 0.2) 100%
          );
          border: 2px solid #000000;
          border-radius: 8px;
          color: #ffffff;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .join-btn:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.4) 0%,
            rgba(76, 175, 80, 0.3) 100%
          );
          transform: translateY(-1px);
        }

        .join-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .delete-btn {
          background: linear-gradient(
            135deg,
            rgba(229, 62, 62, 0.3) 0%,
            rgba(229, 62, 62, 0.2) 100%
          );
          border: 2px solid #000000;
          border-radius: 8px;
          color: #ffffff;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(229, 62, 62, 0.4) 0%,
            rgba(229, 62, 62, 0.3) 100%
          );
          transform: translateY(-1px);
        }

        .session-details {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
        }

        .participants-section h5 {
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
        }

        .participants-list {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .participant-item {
          position: relative;
          display: flex;
          align-items: center;
        }

        .participant-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .host-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 0.7rem;
        }

        .participant-overflow {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #000000;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .session-timestamps {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .timestamp-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .timestamp-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .timestamp-value {
          color: #ffffff;
          font-size: 0.8rem;
        }

        .teams-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .teams-header h3 {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
        }

        .create-team-btn {
          background: linear-gradient(
            135deg,
            rgba(156, 39, 176, 0.3) 0%,
            rgba(156, 39, 176, 0.2) 100%
          );
          border: 2px solid #000000;
          border-radius: 8px;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .create-team-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(156, 39, 176, 0.4) 0%,
            rgba(156, 39, 176, 0.3) 100%
          );
          transform: translateY(-1px);
        }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .team-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 2px solid #000000;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }

        .team-card:hover {
          transform: translateY(-2px);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 100%
          );
        }

        .team-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .team-name {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .member-count {
          background: rgba(33, 150, 243, 0.2);
          border: 1px solid #000000;
          border-radius: 12px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          color: #2196f3;
          font-weight: 600;
        }

        .team-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }

        .team-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .team-members-section {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
        }

        .team-members-section h3 {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
        }

        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .member-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          transition: all 0.2s ease;
        }

        .member-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .member-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #000000;
          flex-shrink: 0;
        }

        .member-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2196f3, #9c27b0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #000000;
        }

        .member-info {
          flex: 1;
        }

        .member-name {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .member-email {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          margin: 0 0 0.5rem 0;
        }

        .member-meta {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .member-role {
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid #000000;
          border-radius: 8px;
          padding: 0.2rem 0.4rem;
          font-size: 0.7rem;
          color: #4caf50;
          font-weight: 600;
          text-transform: capitalize;
        }

        .member-status {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: capitalize;
        }

        .last-seen {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .activity-header h3 {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
        }

        .activity-count {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #000000;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          transition: all 0.2s ease;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-main {
          margin-bottom: 0.5rem;
        }

        .activity-user {
          color: #ffffff;
          font-weight: 600;
          margin-right: 0.5rem;
        }

        .activity-action {
          color: rgba(255, 255, 255, 0.8);
          margin-right: 0.5rem;
        }

        .activity-file {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .activity-timestamp {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          margin: 0 0 1.5rem 0;
          font-size: 0.95rem;
        }

        .create-first-session-btn,
        .create-first-team-btn {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.3) 0%,
            rgba(33, 150, 243, 0.2) 100%
          );
          border: 2px solid #000000;
          border-radius: 12px;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
        }

        .create-first-session-btn:hover,
        .create-first-team-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(33, 150, 243, 0.4) 0%,
            rgba(33, 150, 243, 0.3) 100%
          );
          transform: translateY(-1px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          border: 2px solid #000000;
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          color: #ffffff;
          backdrop-filter: blur(12px);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-header h3 {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .session-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #ffffff;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-input,
        .form-select {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #000000;
          border-radius: 8px;
          padding: 0.75rem;
          color: #ffffff;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(33, 150, 243, 0.5);
        }

        .form-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #000000;
          border-radius: 8px;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .create-btn {
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.3) 0%,
            rgba(76, 175, 80, 0.2) 100%
          );
          border: 2px solid #000000;
          border-radius: 8px;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
        }

        .create-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.4) 0%,
            rgba(76, 175, 80, 0.3) 100%
          );
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .collaboration-dashboard {
            padding: 1.5rem;
          }

          .collaboration-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .sessions-controls {
            flex-direction: column;
          }

          .search-container {
            min-width: unset;
          }

          .sessions-grid {
            grid-template-columns: 1fr;
          }

          .teams-grid {
            grid-template-columns: 1fr;
          }

          .members-grid {
            grid-template-columns: 1fr;
          }

          .tab-navigation {
            flex-direction: column;
          }

          .tab-button {
            justify-content: flex-start;
          }

          .modal-content {
            margin: 1rem;
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .session-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .session-actions {
            flex-direction: row;
            width: 100%;
          }

          .join-btn {
            flex: 1;
          }

          .teams-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .member-card {
            flex-direction: column;
            text-align: center;
          }

          .member-meta {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
