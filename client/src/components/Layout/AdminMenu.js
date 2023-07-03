import React from "react";
import { NavLink } from "react-router-dom";
const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <h4
            style={{ backgroundColor: "grey", height: "50px", padding: "10px",borderRadius: '5px' }}
          >
            Admin Panel
          </h4>
          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action"
            style={{
              color: "white",
              background: "linear-gradient(to right, #FF416C, #FF4B2B)",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              transition: "background-color 0.3s ease",
            }}
          >
            Create Category
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action"
            style={{
              color: "white",
              background: "linear-gradient(to right, #FF416C, #FF4B2B)",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              transition: "background-color 0.3s ease",
            }}
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
            style={{
              color: "white",
              background: "linear-gradient(to right, #FF416C, #FF4B2B)",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              transition: "background-color 0.3s ease",
            }}
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-action"
            style={{
              color: "white",
              background: "linear-gradient(to right, #FF416C, #FF4B2B)",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              transition: "background-color 0.3s ease",
            }}
          >
            orders
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
            style={{
              color: "white",
              background: "linear-gradient(to right, #FF416C, #FF4B2B)",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              transition: "background-color 0.3s ease",
            }}
          >
            Users
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
