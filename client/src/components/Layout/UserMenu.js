import React from "react";
import { NavLink } from "react-router-dom";
import "../Layout/userMenu.css"
const UserMenu = () => {
  return (
    <div>
      <div className="text-center">
        <div className="list-group">
          <h4>            Dashboard           </h4>
          <NavLink
            to="/dashboard/user/profile"
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
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
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
            Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
