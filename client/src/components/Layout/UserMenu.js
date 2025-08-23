import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUser, FaShoppingBag, FaHome, FaCog, FaSignOutAlt } from 'react-icons/fa';
import "../Layout/userMenu.css";

const UserMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      icon: <FaHome />,
      label: "Dashboard",
      description: "Overview of your account"
    },
    {
      path: "/dashboard/user/profile",
      icon: <FaUser />,
      label: "Profile",
      description: "Manage your personal information"
    },
    {
      path: "/dashboard/user/orders",
      icon: <FaShoppingBag />,
      label: "Orders",
      description: "View your order history"
    }
  ];

  return (
    <div className="modern-user-menu">
      <div className="menu-header">
        <div className="menu-avatar">
          <FaUser />
        </div>
        <div className="menu-title">
          <h3>User Menu</h3>
          <p>Manage your account</p>
        </div>
      </div>

      <nav className="menu-navigation">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `menu-item ${isActive ? 'active' : ''}`
            }
          >
            <div className="menu-item-icon">
              {item.icon}
            </div>
            <div className="menu-item-content">
              <span className="menu-item-label">{item.label}</span>
              <span className="menu-item-description">{item.description}</span>
            </div>
            <div className="menu-item-indicator">
              <div className="indicator-dot"></div>
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="menu-footer">
        <button className="menu-action-btn">
          <FaCog />
          <span>Settings</span>
        </button>
        <button className="menu-action-btn logout">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
