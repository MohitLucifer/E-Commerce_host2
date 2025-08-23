import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaShoppingBag, FaHeart, FaStar } from 'react-icons/fa';

const Dashboard = () => {
  const [auth] = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategory: 'Electronics'
  });

  // Simulate loading stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalOrders: 12,
        totalSpent: 1250,
        favoriteCategory: 'Electronics'
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="modern-dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-sidebar">
            <UserMenu />
          </div>
          <div className="dashboard-main">
            {/* Welcome Section */}
            <div className="welcome-section">
              <div className="welcome-content">
                <h1 className="welcome-title">
                  Welcome back, <span className="user-name">{auth?.user?.name}</span>! 👋
                </h1>
                <p className="welcome-subtitle">
                  Here's what's happening with your account today
                </p>
              </div>
              <div className="welcome-illustration">
                <div className="welcome-icon">
                  <FaUser />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orders">
                  <FaShoppingBag />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.totalOrders}</h3>
                  <p className="stat-label">Total Orders</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon spent">
                  <FaStar />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">${stats.totalSpent}</h3>
                  <p className="stat-label">Total Spent</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon category">
                  <FaHeart />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.favoriteCategory}</h3>
                  <p className="stat-label">Favorite Category</p>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="user-info-card">
              <div className="card-header">
                <h2 className="card-title">Personal Information</h2>
                <p className="card-subtitle">Your account details and preferences</p>
              </div>
              
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <FaUser />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Full Name</label>
                    <p className="info-value">{auth?.user?.name}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Email Address</label>
                    <p className="info-value">{auth?.user?.email}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Address</label>
                    <p className="info-value">{auth?.user?.address || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="info-content">
                    <label className="info-label">Member Since</label>
                    <p className="info-value">January 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3 className="section-title">Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-btn primary">
                  <FaShoppingBag />
                  <span>View Orders</span>
                </button>
                <button className="action-btn secondary">
                  <FaUser />
                  <span>Edit Profile</span>
                </button>
                <button className="action-btn secondary">
                  <FaHeart />
                  <span>Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;