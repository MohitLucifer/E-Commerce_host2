import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUsers, FaUser, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPhone } from 'react-icons/fa';
import moment from "moment";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  // Get all users
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/all-users");
      if (data?.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const { data } = await axios.delete(`/api/v1/auth/delete-user/${userId}`);
        if (data?.success) {
          toast.success("User deleted successfully");
          getAllUsers();
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete user");
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="role-badge admin">Admin</span>;
      case 'user':
        return <span className="role-badge user">User</span>;
      default:
        return <span className="role-badge user">User</span>;
    }
  };

  const getStatusBadge = (user) => {
    if (user.verified) {
      return <span className="status-badge verified">Verified</span>;
    } else {
      return <span className="status-badge unverified">Unverified</span>;
    }
  };

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="modern-admin-container">
        <div className="admin-content">
          <div className="admin-sidebar">
            <AdminMenu />
          </div>
          <div className="admin-main">
            {/* Header */}
            <div className="admin-header">
              <div className="header-content">
                <h1 className="admin-title">
                  <FaUsers />
                  All Users
                </h1>
                <p className="admin-subtitle">
                  Manage user accounts and permissions
                </p>
              </div>
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">{users.length}</span>
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {users.filter(user => user.role === 'admin').length}
                  </span>
                  <span className="stat-label">Admins</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {users.filter(user => user.verified).length}
                  </span>
                  <span className="stat-label">Verified</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="search-box">
                <FaUser />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-box">
                <FaFilter />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredUsers.length === 0 && (
              <div className="empty-users">
                <div className="empty-icon">
                  <FaUsers />
                </div>
                <h3>No Users Found</h3>
                <p>
                  {searchTerm || selectedRole !== "all" 
                    ? "No users match your search criteria" 
                    : "No users have registered yet"}
                </p>
              </div>
            )}

            {/* Users List */}
            {!loading && filteredUsers.length > 0 && (
              <div className="users-list">
                {filteredUsers?.map((user) => (
                  <div key={user._id} className="user-card">
                    <div className="user-header">
                      <div className="user-avatar">
                        <FaUser />
                      </div>
                      <div className="user-info">
                        <div className="user-name-section">
                          <h3 className="user-name">{user.name}</h3>
                          <div className="user-badges">
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user)}
                          </div>
                        </div>
                        <div className="user-contact">
                          <div className="contact-item">
                            <FaEnvelope />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="contact-item">
                              <FaPhone />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {user.address && (
                            <div className="contact-item">
                              <FaMapMarkerAlt />
                              <span>{user.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="user-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
                        >
                          <FaEye />
                          <span>{selectedUser === user._id ? 'Hide' : 'View'} Details</span>
                        </button>
                        <button className="action-btn edit">
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* User Details (Expandable) */}
                    {selectedUser === user._id && (
                      <div className="user-details">
                        <div className="details-grid">
                          <div className="detail-item">
                            <label>User ID:</label>
                            <span>{user._id}</span>
                          </div>
                          <div className="detail-item">
                            <label>Registration Date:</label>
                            <span>{moment(user.createdAt).format('MMM DD, YYYY HH:mm')}</span>
                          </div>
                          <div className="detail-item">
                            <label>Last Updated:</label>
                            <span>{moment(user.updatedAt).format('MMM DD, YYYY HH:mm')}</span>
                          </div>
                          <div className="detail-item">
                            <label>Email Verified:</label>
                            <span className={user.verified ? 'verified' : 'unverified'}>
                              {user.verified ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="detail-item">
                            <label>Account Status:</label>
                            <span className={user.active ? 'active' : 'inactive'}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        {user.address && (
                          <div className="address-section">
                            <h4>Address Information</h4>
                            <p>{user.address}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Results Summary */}
            {!loading && filteredUsers.length > 0 && (
              <div className="results-summary">
                <p>
                  Showing {filteredUsers.length} of {users.length} users
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedRole !== "all" && ` with role "${selectedRole}"`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;