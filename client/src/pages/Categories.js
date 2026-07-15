import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Categories.css";

const Categories = () => {
  const categories = useCategory();
  const reduce = useReducedMotion();

  const container = reduce
    ? {}
    : {
        initial: "hidden",
        animate: "show",
        variants: { show: { transition: { staggerChildren: 0.05 } } },
      };

  const tile = reduce
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 14 },
          show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] } },
        },
      };

  return (
    <Layout title={"All Categories"}>
      <main className="page-shell cats">
        <header className="cats-head">
          <h1 className="cats-title">Categories</h1>
          <p className="cats-sub">
            {categories.length > 0
              ? `${categories.length} collections to browse`
              : "Browse every collection"}
          </p>
        </header>

        <motion.div className="cat-grid" {...container}>
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              className={`cat-tile${index === 0 ? " cat-tile--feature" : ""}`}
              {...tile}
            >
              <Link
                to={`/category/${category.slug}`}
                className="cat-link"
                aria-label={`Shop ${category.name}`}
              >
                <span className="cat-name">{category.name}</span>
                <span className="cat-cta">
                  Shop the collection
                  <FaArrowRight className="cat-arrow" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <section className="cats-foot" aria-label="Shop all products">
          <div>
            <h2 className="cats-foot-title">Not sure where to start?</h2>
            <p className="cats-foot-sub">See everything in one place.</p>
          </div>
          <Link to="/" className="btn-glow">
            Browse all products <FaArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
    </Layout>
  );
};

export default Categories;
