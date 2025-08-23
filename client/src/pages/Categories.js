import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { 
  FaShoppingBag, 
  FaTshirt, 
  FaChild, 
  FaMobileAlt, 
  FaSnowflake,
  FaArrowRight,
  FaUsers,
  FaHome,
  FaStar
} from 'react-icons/fa';

const Categories = () => {
  const categories = useCategory();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Category icons mapping
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('men') || name.includes('mens')) return <FaUsers />;
    if (name.includes('women') || name.includes('womens')) return <FaTshirt />;
    if (name.includes('kids') || name.includes('children')) return <FaChild />;
    if (name.includes('electronic') || name.includes('phone') || name.includes('mobile')) return <FaMobileAlt />;
    if (name.includes('winter') || name.includes('cold')) return <FaSnowflake />;
    return <FaShoppingBag />;
  };

  // Category gradients
  const getCategoryGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Layout title={"All Categories"}>
      <div className="modern-categories-container">
        {/* Header Section */}
        <div className="categories-header">
          <div className="header-content">
            <h1>Explore Our Categories</h1>
            <p>Discover amazing products across all categories</p>
            <div className="category-stats">
              <div className="stat-item">
                <FaStar />
                <span>{categories.length} Categories</span>
              </div>
              <div className="stat-item">
                <FaShoppingBag />
                <span>Premium Products</span>
              </div>
              <div className="stat-item">
                <FaHome />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className={`category-card ${hoveredCategory === category._id ? 'hovered' : ''}`}
              style={{
                background: getCategoryGradient(index),
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link to={`/category/${category.slug}`} className="category-link">
                <div className="category-icon">
                  {getCategoryIcon(category.name)}
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">
                    Explore our amazing {category.name.toLowerCase()} collection
                  </p>
                  
                  <div className="category-actions">
                    <span className="explore-text">Explore Now</span>
                    <FaArrowRight className="arrow-icon" />
                  </div>
                </div>

                <div className="category-overlay">
                  <div className="overlay-content">
                    <span>Click to explore</span>
                    <FaArrowRight />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Featured Categories Section */}
        <div className="featured-section">
          <div className="section-header">
            <h2>Featured Categories</h2>
            <p>Most popular categories our customers love</p>
          </div>
          
          <div className="featured-grid">
            {categories.slice(0, 3).map((category, index) => (
              <div
                key={`featured-${category._id}`}
                className="featured-card"
                style={{
                  background: getCategoryGradient(index + 3),
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <Link to={`/category/${category.slug}`} className="featured-link">
                  <div className="featured-icon">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3>{category.name}</h3>
                  <div className="featured-badge">
                    <FaStar />
                    <span>Popular</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Can't find what you're looking for?</h2>
            <p>Browse all our products or contact our support team</p>
            <div className="cta-buttons">
              <Link to="/" className="cta-btn primary">
                Browse All Products
              </Link>
              <Link to="/contact" className="cta-btn secondary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
