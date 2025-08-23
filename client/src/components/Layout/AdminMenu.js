import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaCog, FaPlus, FaBox, FaShoppingBag, FaUsers, FaSignOutAlt, FaChartBar } from 'react-icons/fa';

const AdminMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard/admin/create-category",
      icon: <FaPlus />,
      label: "Create Category",
      description: "Add new product categories"
    },
    {
      path: "/dashboard/admin/create-product",
      icon: <FaPlus />,
      label: "Create Product",
      description: "Add new products to inventory"
    },
    {
      path: "/dashboard/admin/products",
      icon: <FaBox />,
      label: "Products",
      description: "Manage all products"
    },
    {
      path: "/dashboard/admin/orders",
      icon: <FaShoppingBag />,
      label: "Orders",
      description: "View and manage orders"
    },
    {
      path: "/dashboard/admin/users",
      icon: <FaUsers />,
      label: "Users",
      description: "Manage user accounts"
    }
  ];

  return (
    <div className="modern-admin-menu">
      <div className="menu-header">
        <div className="menu-avatar">
          <FaCog />
        </div>
        <div className="menu-title">
          <h3>Admin Panel</h3>
          <p>Manage your store</p>
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
          <FaChartBar />
          <span>Analytics</span>
        </button>
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

export default AdminMenu;
