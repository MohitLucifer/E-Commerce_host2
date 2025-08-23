import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaBox, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEye, FaImage } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  //get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  //get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/v1/product/delete-product/${productId}`);
        toast.success("Product deleted successfully");
        getAllProducts();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleImageError = (productId) => {
    console.log(`Image failed to load for product: ${productId}`);
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const getImageUrl = (product) => {
    if (imageErrors[product._id]) {
      return null; // Will show fallback
    }
    return `/api/v1/product/product-photo/${product._id}`;
  };

  return (
    <Layout>
      <div className="modern-admin-container">
        <div className="admin-content">
          <div className="admin-sidebar">
          <AdminMenu />
        </div>
          <div className="admin-main">
            {/* Header */}
            <div className="admin-header">
              <div className="header-content">
                <h1 className="admin-title">
                  <FaBox />
                  All Products
                </h1>
                <p className="admin-subtitle">
                  Manage your product inventory
                </p>
              </div>
              <div className="header-actions">
                <Link to="/dashboard/admin/create-product" className="add-product-btn">
                  <FaPlus />
                  Add Product
                </Link>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="filters-section">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-box">
                <FaFilter />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="empty-products">
                <div className="empty-icon">
                  <FaBox />
                </div>
                <h3>No Products Found</h3>
                <p>
                  {searchTerm || selectedCategory !== "all" 
                    ? "No products match your search criteria" 
                    : "You haven't added any products yet"}
                </p>
                <Link to="/dashboard/admin/create-product" className="add-first-product-btn">
                  <FaPlus />
                  Add Your First Product
                </Link>
              </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <div className="products-grid">
                {filteredProducts?.map((product) => (
                                     <div key={product._id} className="product-card">
                     <div className="product-image">
                       {getImageUrl(product) ? (
                         <img
                           src={getImageUrl(product)}
                           alt={product.name}
                           className="product-img"
                           onError={() => handleImageError(product._id)}
                         />
                       ) : (
                         <div className="product-img-fallback">
                           <FaImage />
                           <span>No Image</span>
                         </div>
                       )}
                      <div className="product-overlay">
                        <div className="product-actions">
                          <Link 
                            to={`/dashboard/admin/product/${product.slug}`}
                            className="action-btn view"
                          >
                            <FaEye />
                          </Link>
                          <Link 
                            to={`/dashboard/admin/product/${product.slug}`}
                            className="action-btn edit"
                          >
                            <FaEdit />
                          </Link>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDelete(product._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="product-badge">
                        {product.shipping ? "Free Shipping" : "Paid Shipping"}
                      </div>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">
                        {product.description.substring(0, 100)}...
                      </p>
                      
                      <div className="product-meta">
                        <div className="meta-item">
                          <span className="label">Price:</span>
                          <span className="value price">${product.price}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">Quantity:</span>
                          <span className="value quantity">{product.quantity}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">Category:</span>
                          <span className="value category">{product.category?.name}</span>
                  </div>
                </div>
                      
                      <div className="product-status">
                        <span className={`status ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
          </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Summary */}
            {!loading && filteredProducts.length > 0 && (
              <div className="results-summary">
                <p>
                  Showing {filteredProducts.length} of {products.length} products
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== "all" && ` in ${categories.find(c => c._id === selectedCategory)?.name}`}
                </p>
              </div>
            )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Products;
