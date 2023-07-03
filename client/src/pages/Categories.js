import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container gx-xxl-5" style={{ marginTop: "100px" }}>
        <div className="row container">
          {categories.map((c) => (
            <div
              className="col-md-4 mt-5 mb-3 gx-3 gy-3"
              style={{
                color: "white",
                background: "linear-gradient(to right, #FF416C, #FF4B2B)",
                padding: "10px 20px",
                borderRadius: "5px",
                textDecoration: "none",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                transition: "background-color 0.3s ease",
              }}
              key={c._id}
            >
              <div
                className="card"
                style={{ backgroundColor: "white", margin: "50px" }}
              >
                <Link to={`/category/${c.slug}`} className="btn cat-btn">
                  {c.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
