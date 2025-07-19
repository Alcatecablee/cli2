"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth, logAdminAction, reportError } from "../utils/auth";

interface User {
  id: string;
  email: string;
  full_name: string;
  plan: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
  email_confirmed_at: string;
  analysis_count: number;
}

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  selectedUser: User | null;
  editModalOpen: boolean;
  deleteConfirmOpen: boolean;
}

export default function UserManagement() {
  const { user: currentUser, adminFetch } = useAdminAuth();
  const [state, setState] = useState<UserManagementState>({
    users: [],
    loading: true,
    error: null,
    searchTerm: "",
    currentPage: 1,
    totalPages: 1,
    selectedUser: null,
    editModalOpen: false,
    deleteConfirmOpen: false,
  });

  const fetchUsers = async (page = 1, search = "") => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
      });

      const response = await adminFetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        users: data.users || [],
        totalPages: data.pagination?.totalPages || 1,
        currentPage: page,
        loading: false,
      }));

      // Log successful user fetch for audit
      await logAdminAction("fetch_users", "users", undefined, {
        page,
        search,
        userCount: data.users?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Report error to admin system
      await reportError(
        error instanceof Error ? error : new Error(errorMessage),
        "error",
        {
          action: "fetch_users",
          page,
          search,
        },
      );

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (searchTerm: string) => {
    setState((prev) => ({ ...prev, searchTerm }));
    fetchUsers(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page, state.searchTerm);
  };

  const openEditModal = (user: User) => {
    setState((prev) => ({
      ...prev,
      selectedUser: user,
      editModalOpen: true,
    }));
  };

  const closeEditModal = () => {
    setState((prev) => ({
      ...prev,
      selectedUser: null,
      editModalOpen: false,
    }));
  };

  const openDeleteConfirm = (user: User) => {
    setState((prev) => ({
      ...prev,
      selectedUser: user,
      deleteConfirmOpen: true,
    }));
  };

  const closeDeleteConfirm = () => {
    setState((prev) => ({
      ...prev,
      selectedUser: null,
      deleteConfirmOpen: false,
    }));
  };

  const handleUpdateUser = async (updates: Partial<User>) => {
    if (!state.selectedUser) return;

    try {
      const response = await adminFetch("/api/admin/users", {
        method: "PUT",
        body: JSON.stringify({
          userId: state.selectedUser.id,
          updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Log successful user update
      await logAdminAction("update_user", "user", state.selectedUser.id, {
        updates,
        userEmail: state.selectedUser.email,
      });

      // Refresh users list
      fetchUsers(state.currentPage, state.searchTerm);
      closeEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Report error to admin system
      await reportError(
        error instanceof Error ? error : new Error(errorMessage),
        "error",
        {
          action: "update_user",
          userId: state.selectedUser.id,
          updates,
        },
      );

      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  const handleDeleteUser = async () => {
    if (!state.selectedUser) return;

    try {
      const response = await adminFetch(
        `/api/admin/users?userId=${state.selectedUser.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Log successful user deletion
      await logAdminAction("delete_user", "user", state.selectedUser.id, {
        userEmail: state.selectedUser.email,
        userPlan: state.selectedUser.plan,
      });

      // Refresh users list
      fetchUsers(state.currentPage, state.searchTerm);
      closeDeleteConfirm();
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Report error to admin system
      await reportError(
        error instanceof Error ? error : new Error(errorMessage),
        "error",
        {
          action: "delete_user",
          userId: state.selectedUser?.id,
        },
      );

      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanBadgeClass = (plan: string) => {
    switch (plan) {
      case "free":
        return "badge-gray";
      case "developer":
        return "badge-blue";
      case "professional":
        return "badge-purple";
      case "team":
        return "badge-green";
      case "enterprise":
        return "badge-gold";
      default:
        return "badge-gray";
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "badge-red";
      case "moderator":
        return "badge-orange";
      case "user":
        return "badge-blue";
      default:
        return "badge-gray";
    }
  };

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>User Management</h1>
        <p>Manage user accounts, permissions, and subscriptions</p>
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
        <div className="users-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={state.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <button
            onClick={() => fetchUsers(state.currentPage, state.searchTerm)}
            className="btn-secondary"
            disabled={state.loading}
          >
            {state.loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Role</th>
                <th>Analyses</th>
                <th>Joined</th>
                <th>Last Sign In</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.full_name || "No name"}
                        </div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getPlanBadgeClass(user.plan)}`}>
                      {user.plan || "free"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td>{user.analysis_count || 0}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>{formatDate(user.last_sign_in_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(user)}
                        className="btn-icon"
                        title="Edit user"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(user)}
                        className="btn-icon btn-danger"
                        title="Delete user"
                        disabled={user.id === currentUser?.id}
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

          {state.users.length === 0 && !state.loading && (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          )}
        </div>

        {state.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(state.currentPage - 1)}
              disabled={state.currentPage <= 1}
              className="btn-secondary"
            >
              Previous
            </button>

            <span className="page-info">
              Page {state.currentPage} of {state.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(state.currentPage + 1)}
              disabled={state.currentPage >= state.totalPages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {state.editModalOpen && state.selectedUser && (
        <EditUserModal
          user={state.selectedUser}
          onSave={handleUpdateUser}
          onClose={closeEditModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {state.deleteConfirmOpen && state.selectedUser && (
        <DeleteConfirmModal
          user={state.selectedUser}
          onConfirm={handleDeleteUser}
          onClose={closeDeleteConfirm}
        />
      )}
    </div>
  );
}

interface EditUserModalProps {
  user: User;
  onSave: (updates: Partial<User>) => void;
  onClose: () => void;
}

function EditUserModal({ user, onSave, onClose }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    plan: user.plan || "free",
    role: user.role || "user",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit User</h3>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Plan</label>
            <select
              value={formData.plan}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, plan: e.target.value }))
              }
              className="form-select"
            >
              <option value="free">Free</option>
              <option value="developer">Developer</option>
              <option value="professional">Professional</option>
              <option value="team">Team</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="form-select"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
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

interface DeleteConfirmModalProps {
  user: User;
  onConfirm: () => void;
  onClose: () => void;
}

function DeleteConfirmModal({
  user,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal modal-danger">
        <div className="modal-header">
          <h3>Delete User</h3>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete this user?</p>
          <div className="user-preview">
            <strong>{user.full_name || "No name"}</strong>
            <br />
            <span>{user.email}</span>
          </div>
          <p className="warning-text">
            This action cannot be undone. All user data will be permanently
            deleted.
          </p>

          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-danger">
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
