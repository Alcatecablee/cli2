"use client";

import React, { useState, useEffect } from "react";

interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  permissions: string[];
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
  usageCount: number;
  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

interface ApiKeysManagerProps {
  userId?: string;
}

export default function ApiKeysManager({
  userId = "demo-user",
}: ApiKeysManagerProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: "",
    permissions: ["analyze", "projects"],
    expiresInDays: 90,
    rateLimit: {
      requestsPerHour: 100,
      requestsPerDay: 1000,
    },
  });
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/api-keys?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setApiKeys(data.apiKeys || []);
      } else {
        console.error("Failed to load API keys:", data.error);
      }
    } catch (error) {
      console.error("Error loading API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    try {
      setCreating(true);
      const response = await fetch("/api/auth/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newKeyData,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedKey(data.apiKey.key);
        setNewKeyData({
          name: "",
          permissions: ["analyze", "projects"],
          expiresInDays: 90,
          rateLimit: {
            requestsPerHour: 100,
            requestsPerDay: 1000,
          },
        });
        setShowCreateForm(false);
        loadApiKeys();
      } else {
        alert(`Failed to create API key: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      alert("Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  const toggleApiKey = async (keyId: string, isActive: boolean) => {
    try {
      const response = await fetch("/api/auth/api-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyId,
          updates: { isActive: !isActive },
          userId,
        }),
      });

      if (response.ok) {
        loadApiKeys();
      } else {
        const data = await response.json();
        alert(`Failed to update API key: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating API key:", error);
      alert("Failed to update API key");
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/auth/api-keys?keyId=${keyId}&userId=${userId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        loadApiKeys();
      } else {
        const data = await response.json();
        alert(`Failed to delete API key: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      alert("Failed to delete API key");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("API key copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("API key copied to clipboard!");
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, [userId]);

  if (loading) {
    return (
      <div className="api-keys-loading">
        <div className="loading-spinner"></div>
        <p>Loading API keys...</p>
      </div>
    );
  }

  return (
    <div className="api-keys-manager">
      <div className="api-keys-header">
        <h3>API Key Management</h3>
        <p className="api-keys-description">
          Create and manage API keys for programmatic access to NeuroLint Pro.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New API Key
        </button>
      </div>

      {/* Show newly created key */}
      {createdKey && (
        <div className="created-key-alert">
          <h4>API Key Created Successfully</h4>
          <p>
            <strong>Important:</strong> This is the only time your API key will
            be displayed. Please copy it now and store it securely.
          </p>
          <div className="created-key-container">
            <code className="created-key">{createdKey}</code>
            <button
              className="btn btn-sm"
              onClick={() => copyToClipboard(createdKey)}
            >
              Copy
            </button>
          </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setCreatedKey(null)}
          >
            I've saved it
          </button>
        </div>
      )}

      {/* Create form */}
      {showCreateForm && (
        <div className="create-form-overlay">
          <div className="create-form">
            <h4>Create New API Key</h4>

            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                value={newKeyData.name}
                onChange={(e) =>
                  setNewKeyData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="My API Key"
                required
              />
            </div>

            <div className="form-field">
              <label>Permissions</label>
              <div className="permissions-grid">
                {["analyze", "projects", "webhooks", "teams"].map(
                  (permission) => (
                    <label key={permission} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={newKeyData.permissions.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...newKeyData.permissions, permission]
                            : newKeyData.permissions.filter(
                                (p) => p !== permission,
                              );
                          setNewKeyData((prev) => ({
                            ...prev,
                            permissions: newPermissions,
                          }));
                        }}
                      />
                      <span>{permission}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="form-field">
              <label>Expires In (Days)</label>
              <select
                value={newKeyData.expiresInDays}
                onChange={(e) =>
                  setNewKeyData((prev) => ({
                    ...prev,
                    expiresInDays: parseInt(e.target.value),
                  }))
                }
              >
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>1 year</option>
                <option value={0}>Never expires</option>
              </select>
            </div>

            <div className="form-field">
              <label>Rate Limits</label>
              <div className="rate-limit-inputs">
                <input
                  type="number"
                  value={newKeyData.rateLimit.requestsPerHour}
                  onChange={(e) =>
                    setNewKeyData((prev) => ({
                      ...prev,
                      rateLimit: {
                        ...prev.rateLimit,
                        requestsPerHour: parseInt(e.target.value),
                      },
                    }))
                  }
                  placeholder="Requests per hour"
                />
                <input
                  type="number"
                  value={newKeyData.rateLimit.requestsPerDay}
                  onChange={(e) =>
                    setNewKeyData((prev) => ({
                      ...prev,
                      rateLimit: {
                        ...prev.rateLimit,
                        requestsPerDay: parseInt(e.target.value),
                      },
                    }))
                  }
                  placeholder="Requests per day"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={createApiKey}
                disabled={creating || !newKeyData.name}
              >
                {creating ? "Creating..." : "Create API Key"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys list */}
      <div className="api-keys-list">
        {apiKeys.length === 0 ? (
          <div className="empty-state">
            <h4>No API Keys</h4>
            <p>
              Create your first API key to get started with programmatic access.
            </p>
          </div>
        ) : (
          apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className={`api-key-card ${!apiKey.isActive ? "inactive" : ""}`}
            >
              <div className="api-key-header">
                <h4>{apiKey.name}</h4>
                <div className="api-key-status">
                  {apiKey.isActive ? (
                    <span className="status-active">Active</span>
                  ) : (
                    <span className="status-inactive">Inactive</span>
                  )}
                </div>
              </div>

              <div className="api-key-details">
                <div className="api-key-preview">
                  <label>API Key</label>
                  <code>{apiKey.keyPreview}</code>
                </div>

                <div className="api-key-info">
                  <div className="info-item">
                    <label>Permissions</label>
                    <div className="permissions-list">
                      {apiKey.permissions.map((permission) => (
                        <span key={permission} className="permission-tag">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="info-item">
                    <label>Usage</label>
                    <span>{apiKey.usageCount} requests</span>
                  </div>

                  <div className="info-item">
                    <label>Rate Limit</label>
                    <span>
                      {apiKey.rateLimit.requestsPerHour}/hour,{" "}
                      {apiKey.rateLimit.requestsPerDay}/day
                    </span>
                  </div>

                  <div className="info-item">
                    <label>Created</label>
                    <span>
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {apiKey.expiresAt && (
                    <div className="info-item">
                      <label>Expires</label>
                      <span>
                        {new Date(apiKey.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="api-key-actions">
                <button
                  className={`btn btn-sm ${apiKey.isActive ? "btn-warning" : "btn-success"}`}
                  onClick={() => toggleApiKey(apiKey.id, apiKey.isActive)}
                >
                  {apiKey.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteApiKey(apiKey.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .api-keys-manager {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
        }

        .api-keys-header {
          margin-bottom: 32px;
        }

        .api-keys-header h3 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .api-keys-description {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 20px 0;
          font-size: 0.9rem;
        }

        .api-keys-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #2196f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .created-key-alert {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .created-key-alert h4 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.1rem;
        }

        .created-key-alert p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 16px 0;
          font-size: 0.9rem;
        }

        .created-key-container {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 16px;
        }

        .created-key {
          background: rgba(0, 0, 0, 0.3);
          padding: 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.9rem;
          color: #ffffff;
          flex: 1;
          word-break: break-all;
        }

        .create-form-overlay {
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
        }

        .create-form {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .create-form h4 {
          color: #ffffff;
          margin: 0 0 24px 0;
          font-size: 1.25rem;
        }

        .form-field {
          margin-bottom: 20px;
        }

        .form-field label {
          display: block;
          color: #ffffff;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-field input,
        .form-field select {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #ffffff;
          font-size: 0.9rem;
        }

        .form-field input:focus,
        .form-field select:focus {
          outline: none;
          border-color: #2196f3;
        }

        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .permission-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .permission-checkbox input {
          width: auto;
        }

        .rate-limit-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #2196f3;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1976d2;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.85rem;
        }

        .btn-success {
          background: #4caf50;
          color: white;
        }

        .btn-warning {
          background: #ff9800;
          color: white;
        }

        .btn-danger {
          background: #e53e3e;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .empty-state h4 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 1.25rem;
        }

        .api-keys-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .api-key-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .api-key-card.inactive {
          opacity: 0.6;
        }

        .api-key-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .api-key-header h4 {
          color: #ffffff;
          margin: 0;
          font-size: 1.1rem;
        }

        .status-active {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-inactive {
          background: rgba(255, 152, 0, 0.2);
          color: #ff9800;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .api-key-details {
          margin-bottom: 20px;
        }

        .api-key-preview {
          margin-bottom: 16px;
        }

        .api-key-preview label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          margin-bottom: 4px;
        }

        .api-key-preview code {
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 12px;
          border-radius: 4px;
          font-family: monospace;
          color: #ffffff;
          font-size: 0.9rem;
        }

        .api-key-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .info-item span {
          color: #ffffff;
          font-size: 0.9rem;
        }

        .permissions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .permission-tag {
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .api-key-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .api-key-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .api-key-info {
            grid-template-columns: 1fr;
          }

          .api-key-actions {
            justify-content: stretch;
          }

          .permissions-grid {
            grid-template-columns: 1fr;
          }

          .rate-limit-inputs {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
