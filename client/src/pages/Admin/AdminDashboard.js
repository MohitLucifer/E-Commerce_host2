import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { FaUserShield, FaBox, FaShoppingBag, FaUsers, FaTags } from "react-icons/fa";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [auth] = useAuth();

  const name = auth?.user?.name || "Admin";
  const email = auth?.user?.email || "—";
  const phone = auth?.user?.phone || "—";
  const initials = (name || "AD")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const firstName = name.split(" ")[0];

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="admin-dashboard">
              <section className="admin-hero card-animated">
                <div className="avatar" aria-label="Admin avatar">{initials}</div>
                <div className="hero-content">
                  <div className="role-badge">
                    <FaUserShield /> Administrator
                  </div>
                  <h2 className="hero-title">Welcome back, {firstName}!</h2>
                  <p className="hero-subtitle">{email}</p>
                </div>
              </section>

              <div className="admin-grid">
                <div className="admin-card card-animated delay-1">
                  <h4 className="card-title">Profile Overview</h4>
                  <div className="info-row">
                    <span>Name</span>
                    <span>{name}</span>
                  </div>
                  <div className="info-row">
                    <span>Email</span>
                    <span>{email}</span>
                  </div>
                  <div className="info-row">
                    <span>Contact</span>
                    <span>{phone}</span>
                  </div>
                </div>

                <div className="admin-tile card-animated delay-2">
                  <div className="tile-icon"><FaBox /></div>
                  <div className="tile-title">Products</div>
                  <div className="tile-subtitle">Manage all products</div>
                </div>

                <div className="admin-tile card-animated delay-3">
                  <div className="tile-icon"><FaShoppingBag /></div>
                  <div className="tile-title">Orders</div>
                  <div className="tile-subtitle">View and manage orders</div>
                </div>

                <div className="admin-tile card-animated delay-4">
                  <div className="tile-icon"><FaUsers /></div>
                  <div className="tile-title">Users</div>
                  <div className="tile-subtitle">Manage user accounts</div>
                </div>

                <div className="admin-tile card-animated delay-4">
                  <div className="tile-icon"><FaTags /></div>
                  <div className="tile-title">Categories</div>
                  <div className="tile-subtitle">Organize product catalog</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
