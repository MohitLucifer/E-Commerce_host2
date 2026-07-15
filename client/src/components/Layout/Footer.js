import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <FaShoppingCart className="logo-icon" aria-hidden="true" />
            <span className="logo-text">ECOMMERCE</span>
          </div>
          <p className="footer-tagline">
            A modern shopping experience, reimagined in 3D. Discover, explore
            and shop your favourite products.
          </p>
          <div className="footer-socials">
            <a
              href="https://github.com/MohitLucifer"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/mohitkumar00228"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav className="footer-col" aria-label="Shop">
          <h4>Shop</h4>
          <Link to="/">All Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/cart">Cart</Link>
        </nav>

        <nav className="footer-col" aria-label="Company">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policy">Privacy Policy</Link>
        </nav>

        <nav className="footer-col" aria-label="Account">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard/user">Dashboard</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>
          Built with <FaHeart className="heart" aria-label="love" /> &copy;{" "}
          {new Date().getFullYear()} LUCIFER. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
