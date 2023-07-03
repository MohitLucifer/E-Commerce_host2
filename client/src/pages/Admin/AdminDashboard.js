import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div
              className="card w-75 p-3"
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>
                Admin Name: {auth?.user?.name}
              </h3>
              <h3 style={{ marginBottom: "10px" }}>
                Admin Email: {auth?.user?.email}
              </h3>
              <h3 style={{ marginBottom: "10px" }}>
                Admin Contact: {auth?.user?.phone}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
