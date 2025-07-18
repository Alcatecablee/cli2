"use client";

import React, { useState, useEffect } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  user_id: string;
  user_email: string;
  usage_count: number;
  rate_limit: number;
  last_used: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface RateLimit {
  endpoint: string;
  limit: number;
  window: number;
  current_usage: number;
}

interface ApiManagementState {
  apiKeys: ApiKey[];
  rateLimits: RateLimit[];
  loading: boolean;
  error: string | null;
  selectedKey: ApiKey | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  stats: {
    totalKeys: number;
    activeKeys: number;
    totalRequests: number;
    requestsToday: number;
  };
}

export default function ApiManagement() {
  const [state, setState] = useState<ApiManagementState>({
    apiKeys: [],
    rateLimits: [],
    loading: true,
    error: null,
    selectedKey: null,
    showCreateModal: false,
    showEditModal: false,
    stats: {
      totalKeys: 0,
      activeKeys: 0,
      totalRequests: 0,
      requestsToday: 0,
    },
  });

  const fetchApiData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/api-management", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        apiKeys: data.apiKeys || [],
        rateLimits: data.rateLimits || [],
        stats: data.stats || prev.stats,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching API data:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  const handleCreateApiKey = async (keyData: {
    name: string;
    userId: string;
    rateLimit: number;
    expiresAt?: string;
  }) => {
    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/api-management", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "create_key", ...keyData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      fetchApiData();
      setState((prev) => ({ ...prev, showCreateModal: false }));
    } catch (error) {
      console.error("Error creating API key:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  };

  const handleUpdateApiKey = async (
    keyId: string,
    updates: Partial<ApiKey>,
  ) => {
    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/api-management", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "update_key", keyId, updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      fetchApiData();
      setState((prev) => ({
        ...prev,
        showEditModal: false,
        selectedKey: null,
      }));
    } catch (error) {
      console.error("Error updating API key:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const token =
        localStorage.getItem("supabase.auth.token") ||
        sessionStorage.getItem("supabase.auth.token");

      const response = await fetch("/api/admin/api-management", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "delete_key", keyId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      fetchApiData();
    } catch (error) {
      console.error("Error deleting API key:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getUsageColor = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100;
    if (percentage > 90) return "usage-critical";
    if (percentage > 75) return "usage-warning";
    return "usage-normal";
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  if (state.loading) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading API management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>API Management</h1>
        <p>Manage API keys, rate limits, and usage monitoring</p>
      </div>

      {state.error && (
        <div className="error-banner">
          <span>Error: {state.error}</span>
          <button
            onClick={() => setState((prev) => ({ ...prev, error: null }))}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="content-body">
        {/* API Stats */}
        <div className="api-stats">
          <div className="stat-card">
            <h3>Total API Keys</h3>
            <div className="stat-value">{state.stats.totalKeys}</div>
          </div>
          <div className="stat-card">
            <h3>Active Keys</h3>
            <div className="stat-value">{state.stats.activeKeys}</div>
          </div>
          <div className="stat-card">
            <h3>Total Requests</h3>
            <div className="stat-value">
              {state.stats.totalRequests.toLocaleString()}
            </div>
          </div>
          <div className="stat-card">
            <h3>Requests Today</h3>
            <div className="stat-value">
              {state.stats.requestsToday.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="api-controls">
          <button
            onClick={() =>
              setState((prev) => ({ ...prev, showCreateModal: true }))
            }
            className="btn-primary"
          >
            Create API Key
          </button>
          <button onClick={fetchApiData} className="btn-secondary">
            Refresh
          </button>
        </div>

        {/* API Keys Table */}
        <div className="api-keys-section">
          <h3>API Keys</h3>
          <div className="table-container">
            <table className="api-keys-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>User</th>
                  <th>Key</th>
                  <th>Usage / Limit</th>
                  <th>Last Used</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.apiKeys.map((apiKey) => (
                  <tr key={apiKey.id}>
                    <td>
                      <div className="key-name">
                        {apiKey.name}
                        <div className="key-created">
                          Created: {formatDate(apiKey.created_at)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-email">{apiKey.user_email}</div>
                        <div className="user-id">{apiKey.user_id}</div>
                      </div>
                    </td>
                    <td>
                      <div className="api-key-display">
                        <code>{maskApiKey(apiKey.key)}</code>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(apiKey.key)
                          }
                          className="copy-btn"
                          title="Copy full key"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14">
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="usage-info">
                        <div className="usage-numbers">
                          {apiKey.usage_count.toLocaleString()} /{" "}
                          {apiKey.rate_limit.toLocaleString()}
                        </div>
                        <div className="usage-bar">
                          <div
                            className={`usage-fill ${getUsageColor(apiKey.usage_count, apiKey.rate_limit)}`}
                            style={{
                              width: `${Math.min((apiKey.usage_count / apiKey.rate_limit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>{formatDate(apiKey.last_used)}</td>
                    <td>
                      <span
                        className={`status-badge ${apiKey.is_active ? "status-active" : "status-inactive"}`}
                      >
                        {apiKey.is_active ? "Active" : "Inactive"}
                      </span>
                      {apiKey.expires_at &&
                        new Date(apiKey.expires_at) < new Date() && (
                          <span className="status-badge status-expired">
                            Expired
                          </span>
                        )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setState((prev) => ({
                              ...prev,
                              selectedKey: apiKey,
                              showEditModal: true,
                            }));
                          }}
                          className="btn-icon"
                          title="Edit"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="btn-icon btn-danger"
                          title="Delete"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="rate-limits-section">
          <h3>Rate Limits</h3>
          <div className="rate-limits-grid">
            {state.rateLimits.map((limit) => (
              <div key={limit.endpoint} className="rate-limit-card">
                <h4>{limit.endpoint}</h4>
                <div className="limit-info">
                  <div className="limit-detail">
                    <span>Limit:</span>
                    <span>
                      {limit.limit} requests / {limit.window}s
                    </span>
                  </div>
                  <div className="limit-detail">
                    <span>Current:</span>
                    <span>{limit.current_usage} requests</span>
                  </div>
                  <div className="limit-bar">
                    <div
                      className={`limit-fill ${getUsageColor(limit.current_usage, limit.limit)}`}
                      style={{
                        width: `${Math.min((limit.current_usage / limit.limit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {state.showCreateModal && (
        <CreateApiKeyModal
          onSave={handleCreateApiKey}
          onClose={() =>
            setState((prev) => ({ ...prev, showCreateModal: false }))
          }
        />
      )}

      {/* Edit API Key Modal */}
      {state.showEditModal && state.selectedKey && (
        <EditApiKeyModal
          apiKey={state.selectedKey}
          onSave={(updates) =>
            handleUpdateApiKey(state.selectedKey!.id, updates)
          }
          onClose={() =>
            setState((prev) => ({
              ...prev,
              showEditModal: false,
              selectedKey: null,
            }))
          }
        />
      )}
    </div>
  );
}

interface CreateApiKeyModalProps {
  onSave: (data: {
    name: string;
    userId: string;
    rateLimit: number;
    expiresAt?: string;
  }) => void;
  onClose: () => void;
}

function CreateApiKeyModal({ onSave, onClose }: CreateApiKeyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    rateLimit: 1000,
    expiresAt: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      userId: formData.userId,
      rateLimit: formData.rateLimit,
      ...(formData.expiresAt && { expiresAt: formData.expiresAt }),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Create API Key</h3>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, userId: e.target.value }))
              }
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Rate Limit (requests per hour)</label>
            <input
              type="number"
              value={formData.rateLimit}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rateLimit: parseInt(e.target.value) || 0,
                }))
              }
              className="form-input"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Expires At (optional)</label>
            <input
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
              }
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditApiKeyModalProps {
  apiKey: ApiKey;
  onSave: (updates: Partial<ApiKey>) => void;
  onClose: () => void;
}

function EditApiKeyModal({ apiKey, onSave, onClose }: EditApiKeyModalProps) {
  const [formData, setFormData] = useState({
    name: apiKey.name,
    rate_limit: apiKey.rate_limit,
    is_active: apiKey.is_active,
    expires_at: apiKey.expires_at
      ? new Date(apiKey.expires_at).toISOString().slice(0, 16)
      : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      rate_limit: formData.rate_limit,
      is_active: formData.is_active,
      expires_at: formData.expires_at || null,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit API Key</h3>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Rate Limit (requests per hour)</label>
            <input
              type="number"
              value={formData.rate_limit}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rate_limit: parseInt(e.target.value) || 0,
                }))
              }
              className="form-input"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
              Active
            </label>
          </div>

          <div className="form-group">
            <label>Expires At</label>
            <input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expires_at: e.target.value }))
              }
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
