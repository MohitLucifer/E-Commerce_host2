import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import {useCart} from '../../context/cart'
import { Badge } from "antd";
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <>
      <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo Section */}
          <Link to="/" className="nav-logo">
            <FaShoppingCart className="logo-icon" />
            <span className="logo-text">ECOMMERCE</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navigation Content */}
          <div className={`nav-content ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Search Section */}
            <div className="search-section">
              <SearchInput />
            </div>

            {/* Navigation Links */}
            <ul className="nav-links">
              <li className="nav-item">
                <NavLink to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </NavLink>
              </li>
              
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/categories"
                  data-bs-toggle="dropdown"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/categories">
                      All Categories
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li key={c.slug}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* User Authentication */}
              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link auth-link" onClick={() => setIsMobileMenuOpen(false)}>
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link auth-link login-btn" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle user-menu"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUser className="user-icon" />
                    <span>{auth?.user?.name}</span>
                  </NavLink>
                  <ul className="dropdown-menu user-dropdown">
                    <li>
                      <NavLink
                        to={`/dashboard/${
                          auth?.user?.role === 1 ? "admin" : "user"
                        }`}
                        className="dropdown-item"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={handleLogout}
                        to="/login"
                        className="dropdown-item"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )}

              {/* Cart */}
              <li className="nav-item">
                <Badge count={cart?.length} showZero className="cart-badge">
                  <NavLink to="/cart" className="nav-link cart-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaShoppingCart className="cart-icon" />
                    <span>Cart</span>
                  </NavLink>
                </Badge>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;