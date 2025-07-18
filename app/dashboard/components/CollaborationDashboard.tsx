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
  details: any;
}

interface CollaborationDashboardProps {
  user: any;
  sessions: CollaborationSession[];
  loadingSessions: boolean;
  onRefreshSessions: () => Promise<void>;
  onUpdateSessions: (sessions: CollaborationSession[]) => void;
}

export default function CollaborationDashboard({
  user,
  sessions,
  loadingSessions,
  onRefreshSessions,
  onUpdateSessions,
}: CollaborationDashboardProps) {
  const [activeTab, setActiveTab] = useState<"sessions" | "teams" | "activity">(
    "sessions",
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<
    Map<string, { userName: string; lastSeen: Date; status: string }>
  >(new Map());
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const activityPollInterval = useRef<NodeJS.Timeout | null>(null);
  const presencePollInterval = useRef<NodeJS.Timeout | null>(null);

  // Real-time polling for live updates
  useEffect(() => {
    if (activeTab === "sessions") {
      pollInterval.current = setInterval(async () => {
        try {
          const response = await fetch("/api/collaboration/sessions", {
            headers: {
              "x-user-id": user.id,
              "x-user-name": user.firstName || user.email || "Anonymous",
            },
          });
          if (response.ok) {
            const data = await response.json();
            onUpdateSessions(data.sessions || []);
          }
        } catch (error) {
          console.error("Failed to poll sessions:", error);
        }
      }, 5000); // Poll every 5 seconds

      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
      };
    }

    // Poll activity feed for real-time updates
    if (activeTab === "activity") {
      activityPollInterval.current = setInterval(async () => {
        try {
          const response = await fetch("/api/collaboration/activity", {
            headers: {
              "x-user-id": user.id,
              "x-user-name": user.firstName || user.email || "Anonymous",
            },
          });
          if (response.ok) {
            const data = await response.json();
            const formattedActivities = data.activities.map(
              (activity: any) => ({
                id: activity.id,
                type: activity.type,
                sessionId: activity.session_id,
                userId: activity.user_id,
                userName: activity.user_name,
                timestamp: new Date(activity.timestamp),
                details: activity.details,
              }),
            );
            setActivities(formattedActivities);
          }
        } catch (error) {
          console.error("Failed to poll activity:", error);
        }
      }, 10000); // Poll every 10 seconds

      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
        if (activityPollInterval.current) {
          clearInterval(activityPollInterval.current);
        }
      };
    }

    // Always poll for online presence to show live indicators
    presencePollInterval.current = setInterval(async () => {
      try {
        const response = await fetch("/api/collaboration/presence", {
          headers: {
            "x-user-id": user.id,
            "x-user-name": user.firstName || user.email || "Anonymous",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const onlineMap = new Map();
          data.presence.forEach((p: any) => {
            onlineMap.set(p.userId, {
              userName: p.userName,
              lastSeen: new Date(p.lastSeen),
              status: p.status,
            });
          });
          setOnlineUsers(onlineMap);
        }
      } catch (error) {
        console.error("Failed to poll presence:", error);
      }
    }, 15000); // Poll every 15 seconds

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
      if (activityPollInterval.current) {
        clearInterval(activityPollInterval.current);
      }
      if (presencePollInterval.current) {
        clearInterval(presencePollInterval.current);
      }
    };
  }, [activeTab, user.id, user.firstName, user.email, onUpdateSessions]);

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
      if (activityPollInterval.current) {
        clearInterval(activityPollInterval.current);
      }
      if (presencePollInterval.current) {
        clearInterval(presencePollInterval.current);
      }
    };
  }, []);

  // Load team members
  const loadTeamMembers = useCallback(async () => {
    setLoadingTeams(true);
    try {
      const response = await fetch("/api/collaboration/teams", {
        headers: {
          "x-user-id": user.id,
          "x-user-name": user.firstName || user.email || "Anonymous",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Extract all unique members from all teams
        const allMembers = new Map<string, TeamMember>();

        data.teams.forEach((team: any) => {
          team.members.forEach((member: any) => {
            if (!allMembers.has(member.user_id)) {
              allMembers.set(member.user_id, {
                id: member.user_id,
                name: member.user_name || member.user_email || "Unknown",
                email: member.user_email || "",
                role: member.role,
                status: member.status || "offline",
                lastSeen: new Date(member.lastSeen || Date.now()),
              });
            }
          });
        });

        // Add current user if not already included
        if (!allMembers.has(user.id)) {
          allMembers.set(user.id, {
            id: user.id,
            name: user.firstName || user.email || "You",
            email: user.email || "",
            role: "owner",
            status: "online",
            lastSeen: new Date(),
          });
        }

        setTeamMembers(Array.from(allMembers.values()));
      } else {
        console.error(
          "Failed to load teams:",
          response.status,
          response.statusText,
        );
        // Show user-friendly error and fallback
        if (response.status === 401) {
          console.warn("Authentication required for team data");
        } else if (response.status >= 500) {
          console.error("Server error loading teams");
        }
        // Fallback to current user only
        setTeamMembers([
          {
            id: user.id,
            name: user.firstName || user.email || "You",
            email: user.email || "",
            role: "owner",
            status: "online",
            lastSeen: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load team members:", error);
      // Fallback to basic user data
      setTeamMembers([
        {
          id: user.id,
          name: user.firstName || user.email || "You",
          email: user.email || "",
          role: "owner",
          status: "online",
          lastSeen: new Date(),
        },
      ]);
    } finally {
      setLoadingTeams(false);
    }
  }, [user]);

  // Load activity feed
  const loadActivity = useCallback(async () => {
    setLoadingActivity(true);
    try {
      const response = await fetch("/api/collaboration/activity", {
        headers: {
          "x-user-id": user.id,
          "x-user-name": user.firstName || user.email || "Anonymous",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedActivities: Activity[] = data.activities.map(
          (activity: any) => ({
            id: activity.id,
            type: activity.type,
            sessionId: activity.session_id,
            userId: activity.user_id,
            userName: activity.user_name,
            timestamp: new Date(activity.timestamp),
            details: activity.details,
          }),
        );
        setActivities(formattedActivities);
      } else {
        console.error("Failed to load activity:", response.statusText);
        // Fallback to sample activities for demo
        const sampleActivities: Activity[] = [
          {
            id: "sample1",
            type: "session_created",
            sessionId: sessions[0]?.id,
            userId: user.id,
            userName: user.firstName || user.email || "You",
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            details: { sessionName: sessions[0]?.name || "Sample Session" },
          },
        ];
        setActivities(sampleActivities);
      }
    } catch (error) {
      console.error("Failed to load activity:", error);
      setActivities([]);
    } finally {
      setLoadingActivity(false);
    }
  }, [user, sessions]);

  useEffect(() => {
    if (activeTab === "teams") {
      loadTeamMembers();
    } else if (activeTab === "activity") {
      loadActivity();
    }
  }, [activeTab, loadTeamMembers, loadActivity]);

  const createSession = async (sessionData: {
    name: string;
    filename: string;
    language: string;
    template?: string;
  }) => {
    try {
      const response = await fetch("/api/collaboration/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-name": user.firstName || user.email || "Anonymous",
        },
        body: JSON.stringify({
          name: sessionData.name,
          filename: sessionData.filename,
          language: sessionData.language,
          initialCode: getInitialCode(
            sessionData.template || "blank",
            sessionData.language,
          ),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Track activity
        await fetch("/api/collaboration/activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            "x-user-name": user.firstName || user.email || "Anonymous",
          },
          body: JSON.stringify({
            type: "session_created",
            sessionId: data.session.id,
            details: {
              sessionName: sessionData.name,
              filename: sessionData.filename,
              language: sessionData.language,
            },
          }),
        }).catch(console.error);

        window.open(`/collaborate?session=${data.session.id}`, "_blank");
        await onRefreshSessions();
        setShowCreateModal(false);
      } else {
        const error = await response.json();
        alert(`Failed to create session: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      alert("Failed to create session");
    }
  };

  const getInitialCode = (template: string, language: string) => {
    const templates = {
      blank: "// Start coding here...\n",
      component:
        language === "typescript"
          ? `import React from 'react';\n\ninterface Props {\n  // Add your props here\n}\n\nexport default function Component({ }: Props) {\n  return (\n    <div>\n      {/* Your component JSX */}\n    </div>\n  );\n}\n`
          : `import React from 'react';\n\nexport default function Component() {\n  return (\n    <div>\n      {/* Your component JSX */}\n    </div>\n  );\n}\n`,
      hook: `import { useState, useEffect } from 'react';\n\nexport function useCustomHook() {\n  const [state, setState] = useState(null);\n\n  useEffect(() => {\n    // Hook logic here\n  }, []);\n\n  return { state, setState };\n}\n`,
      api: `import { NextRequest, NextResponse } from 'next/server';\n\nexport async function GET(request: NextRequest) {\n  try {\n    // API logic here\n    return NextResponse.json({ success: true });\n  } catch (error) {\n    return NextResponse.json(\n      { error: 'Internal server error' },\n      { status: 500 }\n    );\n  }\n}\n`,
    };
    return templates[template as keyof typeof templates] || templates.blank;
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.document_filename
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active") {
      const lastActivity = new Date(session.last_activity);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return matchesSearch && lastActivity > fiveMinutesAgo;
    }
    if (filterStatus === "inactive") {
      const lastActivity = new Date(session.last_activity);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return matchesSearch && lastActivity <= fiveMinutesAgo;
    }
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#4caf50";
      case "away":
        return "#ff9800";
      case "offline":
        return "#9e9e9e";
      default:
        return "#9e9e9e";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="collaboration-dashboard">
      {/* Header */}
      <div className="collaboration-header">
        <div className="header-content">
          <div className="header-info">
            <h2>Team Collaboration</h2>
            <p>Real-time code collaboration with your team</p>
            {onlineUsers.size > 0 && (
              <div className="online-indicator">
                <div className="online-dot"></div>
                <span>{onlineUsers.size} online now</span>
              </div>
            )}
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              New Session
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowInviteModal(true)}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.49 1.49 0 0 0 18.5 7.5h-3A1.49 1.49 0 0 0 14.04 8.37L11.5 16H14v6h6zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-2 1L8.96 15H10v5H4v-5h1.04L3.5 12.5C3.18 11.75 3.73 11 4.54 11h3.92c.81 0 1.36.75 1.04 1.5z" />
              </svg>
              Invite Members
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="collaboration-tabs">
          <button
            className={`tab-button ${activeTab === "sessions" ? "active" : ""}`}
            onClick={() => setActiveTab("sessions")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
            </svg>
            Active Sessions
            <span className="tab-badge">{sessions.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.49 1.49 0 0 0 18.5 7.5h-3A1.49 1.49 0 0 0 14.04 8.37L11.5 16H14v6h6zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-2 1L8.96 15H10v5H4v-5h1.04L3.5 12.5C3.18 11.75 3.73 11 4.54 11h3.92c.81 0 1.36.75 1.04 1.5z" />
            </svg>
            Team Members
            <span className="tab-badge">{teamMembers.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
            Recent Activity
            <span className="tab-badge">{activities.length}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="collaboration-content">
        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <div className="sessions-panel">
            {/* Search and Filters */}
            <div className="panel-controls">
              <div className="search-container">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="search-icon"
                >
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-container">
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as "all" | "active" | "inactive",
                    )
                  }
                  className="filter-select"
                >
                  <option value="all">All Sessions</option>
                  <option value="active">Active (Last 5 min)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button
                className="btn btn-secondary"
                onClick={onRefreshSessions}
                disabled={loadingSessions}
              >
                {loadingSessions ? "..." : "Refresh"}
              </button>
            </div>

            {/* Sessions Grid */}
            <div className="sessions-grid">
              {loadingSessions ? (
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>Loading sessions...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="empty-state">
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="currentColor"
                    className="empty-icon"
                  >
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                  </svg>
                  <h3>No collaboration sessions found</h3>
                  <p>
                    Create a new session to start collaborating with your team
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Your First Session
                  </button>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <div key={session.id} className="session-card">
                    <div className="session-header">
                      <div className="session-info">
                        <h4 className="session-name">{session.name}</h4>
                        <p className="session-file">
                          {session.document_filename}
                        </p>
                      </div>
                      <div className="session-status">
                        <div
                          className={`status-indicator ${new Date(session.last_activity) > new Date(Date.now() - 5 * 60 * 1000) ? "active" : "inactive"}`}
                        ></div>
                        <span className="status-text">
                          {new Date(session.last_activity) >
                          new Date(Date.now() - 5 * 60 * 1000)
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="session-meta">
                      <div className="meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>{session.document_language}</span>
                      </div>
                      <div className="meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>
                          {session.participants?.length || 0} participants
                        </span>
                      </div>
                      <div className="meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                        <span>
                          {formatTimeAgo(new Date(session.last_activity))}
                        </span>
                      </div>
                    </div>

                    {session.participants &&
                      session.participants.length > 0 && (
                        <div className="session-participants">
                          <div className="participants-avatars">
                            {session.participants
                              .slice(0, 4)
                              .map((participant) => (
                                <div
                                  key={participant.id}
                                  className="participant-avatar"
                                  style={{
                                    borderColor: participant.user_color,
                                  }}
                                  title={participant.user_name}
                                >
                                  {participant.user_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              ))}
                            {session.participants.length > 4 && (
                              <div className="participant-overflow">
                                +{session.participants.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    <div className="session-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          window.open(
                            `/collaborate?session=${session.id}`,
                            "_blank",
                          )
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        Join Session
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={async (event) => {
                          try {
                            await navigator.clipboard.writeText(
                              `${window.location.origin}/collaborate?session=${session.id}`,
                            );
                            // Show temporary success feedback
                            const button =
                              event.currentTarget as HTMLButtonElement;
                            if (button) {
                              const originalText = button.textContent;
                              button.textContent = "Copied!";
                              button.style.background = "#4caf50";
                              setTimeout(() => {
                                button.textContent = originalText;
                                button.style.background = "";
                              }, 2000);
                            }
                          } catch (error) {
                            alert("Failed to copy link");
                          }
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                        Copy Link
                      </button>
                      {session.host_user_id === user.id && (
                        <>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={async () => {
                              try {
                                const response = await fetch(
                                  "/api/collaboration/sessions",
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                      "x-user-id": user.id,
                                    },
                                    body: JSON.stringify({
                                      sessionId: session.id,
                                      action: "lock_session",
                                      data: { locked: !session.is_locked },
                                    }),
                                  },
                                );
                                if (response.ok) {
                                  await onRefreshSessions();
                                }
                              } catch (error) {
                                console.error("Failed to toggle lock:", error);
                              }
                            }}
                            title={
                              session.is_locked
                                ? "Unlock session"
                                : "Lock session"
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="currentColor"
                            >
                              {session.is_locked ? (
                                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                              ) : (
                                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18Z" />
                              )}
                            </svg>
                            {session.is_locked ? "Unlock" : "Lock"}
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              const sessionUrl = `${window.location.origin}/collaborate?session=${session.id}`;
                              const subject = encodeURIComponent(
                                `Join my NeuroLint collaboration session: ${session.name}`,
                              );
                              const body = encodeURIComponent(
                                `Hi!\n\nI'd like to invite you to collaborate on "${session.name}".\n\nClick this link to join: ${sessionUrl}\n\nWe'll be working on: ${session.document_filename}\n\nBest regards`,
                              );
                              window.open(
                                `mailto:?subject=${subject}&body=${body}`,
                              );
                            }}
                            title="Send invitation via email"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="currentColor"
                            >
                              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                            </svg>
                            Invite
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={async () => {
                              if (
                                confirm(
                                  `Are you sure you want to delete "${session.name}"? This action cannot be undone.`,
                                )
                              ) {
                                try {
                                  const response = await fetch(
                                    `/api/collaboration/sessions?sessionId=${session.id}`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        "x-user-id": user.id,
                                      },
                                    },
                                  );
                                  if (response.ok) {
                                    // Track activity
                                    await fetch("/api/collaboration/activity", {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                        "x-user-id": user.id,
                                        "x-user-name":
                                          user.firstName ||
                                          user.email ||
                                          "Anonymous",
                                      },
                                      body: JSON.stringify({
                                        type: "session_deleted",
                                        sessionId: session.id,
                                        details: { sessionName: session.name },
                                      }),
                                    }).catch(console.error);

                                    await onRefreshSessions();
                                  }
                                } catch (error) {
                                  console.error(
                                    "Failed to delete session:",
                                    error,
                                  );
                                  alert("Failed to delete session");
                                }
                              }
                            }}
                            title="Delete session"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="currentColor"
                            >
                              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === "teams" && (
          <div className="teams-panel">
            <div className="panel-header">
              <h3>Team Members</h3>
              <button
                className="btn btn-primary"
                onClick={() => setShowInviteModal(true)}
              >
                Invite Members
              </button>
            </div>

            <div className="team-grid">
              {loadingTeams ? (
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>Loading team members...</p>
                </div>
              ) : (
                teamMembers.map((member) => {
                  const livePresence = onlineUsers.get(member.id);
                  const actualStatus = livePresence?.status || member.status;
                  const isOnline = livePresence && actualStatus === "online";

                  return (
                    <div key={member.id} className="member-card">
                      <div className="member-avatar">
                        <div
                          className="avatar-circle"
                          style={{
                            backgroundColor: getStatusColor(actualStatus),
                          }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={`status-dot ${isOnline ? "pulse" : ""}`}
                          style={{
                            backgroundColor: getStatusColor(actualStatus),
                          }}
                          title={
                            isOnline
                              ? "Online now"
                              : `Last seen ${formatTimeAgo(livePresence?.lastSeen || member.lastSeen)}`
                          }
                        ></div>
                      </div>
                      <div className="member-info">
                        <h4 className="member-name">{member.name}</h4>
                        <p className="member-email">{member.email}</p>
                        <div className="member-meta">
                          <span className={`role-badge role-${member.role}`}>
                            {member.role}
                          </span>
                          <span className="last-seen">
                            {member.status === "online"
                              ? "Online now"
                              : `Last seen ${formatTimeAgo(member.lastSeen)}`}
                          </span>
                        </div>
                      </div>
                      {member.id !== user.id && (
                        <div className="member-actions">
                          <button className="btn btn-secondary btn-sm">
                            Message
                          </button>
                          <button className="btn btn-secondary btn-sm">
                            ...
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="activity-panel">
            <div className="panel-header">
              <h3>Recent Activity</h3>
              <button
                className="btn btn-secondary"
                onClick={loadActivity}
                disabled={loadingActivity}
              >
                {loadingActivity ? "..." : "Refresh"}
              </button>
            </div>

            <div className="activity-feed">
              {loadingActivity ? (
                <div className="loading-placeholder">
                  <div className="loading-spinner"></div>
                  <p>Loading activity...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="empty-state">
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="currentColor"
                    className="empty-icon"
                  >
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                  </svg>
                  <h3>No recent activity</h3>
                  <p>Team activity will appear here when members collaborate</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-avatar">
                      {activity.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{activity.userName}</strong>
                        {getActivityText(activity)}
                      </div>
                      <div className="activity-time">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          onCreateSession={createSession}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={(emails) => {
            console.log("Inviting:", emails);
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

function getActivityText(activity: Activity): string {
  switch (activity.type) {
    case "session_created":
      return ` created session "${activity.details.sessionName}"`;
    case "session_joined":
      return ` joined session "${activity.details.sessionName}"`;
    case "session_left":
      return ` left session "${activity.details.sessionName}"`;
    case "document_edited":
      return ` edited ${activity.details.filename} (${activity.details.linesChanged} lines changed)`;
    case "comment_added":
      return ` added a comment`;
    case "analysis_run":
      return ` ran analysis on ${activity.details.layers?.join(", ") || "unknown"} layers (${activity.details.issuesFound || 0} issues found)`;
    case "session_deleted":
      return ` deleted session "${activity.details.sessionName || "Unknown Session"}"`;
    case "member_invited":
      return ` invited ${activity.details.inviteeEmail || "someone"} to the team`;
    case "member_joined":
      return ` joined the team`;
    default:
      return " performed an action";
  }
}

// Modal Components
function CreateSessionModal({
  onClose,
  onCreateSession,
}: {
  onClose: () => void;
  onCreateSession: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    filename: "",
    language: "typescript",
    template: "blank",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate session name
    if (!formData.name.trim()) {
      alert("Session name is required");
      return;
    }

    if (formData.name.trim().length < 3) {
      alert("Session name must be at least 3 characters long");
      return;
    }

    // Validate filename
    if (!formData.filename.trim()) {
      alert("Filename is required");
      return;
    }

    // Validate filename format
    const validExtensions = [".ts", ".tsx", ".js", ".jsx"];
    const hasValidExtension = validExtensions.some((ext) =>
      formData.filename.toLowerCase().endsWith(ext),
    );

    if (!hasValidExtension) {
      alert("Filename must end with .ts, .tsx, .js, or .jsx");
      return;
    }

    onCreateSession(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Collaboration Session</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="sessionName">Session Name *</label>
            <input
              id="sessionName"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., React Component Review"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="filename">Filename *</label>
            <input
              id="filename"
              type="text"
              value={formData.filename}
              onChange={(e) =>
                setFormData({ ...formData, filename: e.target.value })
              }
              placeholder="e.g., component.tsx"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="jsx">JSX</option>
              <option value="tsx">TSX</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="template">Template</label>
            <select
              id="template"
              value={formData.template}
              onChange={(e) =>
                setFormData({ ...formData, template: e.target.value })
              }
            >
              <option value="blank">Blank File</option>
              <option value="component">React Component</option>
              <option value="hook">Custom Hook</option>
              <option value="api">API Route</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (emails: string[]) => void;
}) {
  const [emails, setEmails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailList.length === 0) {
      alert("Please enter at least one email address");
      return;
    }

    onInvite(emailList);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Invite Team Members</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="emails">Email Addresses</label>
            <textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter email addresses separated by commas"
              rows={4}
              required
            />
            <p className="form-help">
              Separate multiple email addresses with commas
            </p>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send Invitations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
