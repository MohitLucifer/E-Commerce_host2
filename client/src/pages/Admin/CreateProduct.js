import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUpload, FaSave, FaTimes, FaImage, FaTag, FaFileAlt, FaDollarSign, FaBoxes, FaShippingFast } from 'react-icons/fa';

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("https://e-commerce-host2.onrender.com/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !quantity || !photo) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);
      
      const { data } = await axios.post(
        "https://e-commerce-host2.onrender.com/api/v1/product/create-product",
        productData
      );
      
      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setPhoto(files[0]);
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setQuantity("");
    setShipping("");
    setPhoto("");
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
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
                  <FaPlus />
                  Create New Product
                </h1>
                <p className="admin-subtitle">
                  Add a new product to your inventory
                </p>
              </div>
              <div className="header-actions">
                <button className="clear-btn" onClick={clearForm}>
                  <FaTimes />
                  Clear Form
                </button>
              </div>
            </div>

            {/* Create Product Form */}
            <div className="create-product-form">
              <form onSubmit={handleCreate}>
                <div className="form-grid">
                  {/* Category Selection */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaTag />
                      Product Category
                    </label>
                    <Select
                      bordered={false}
                      placeholder="Select a category"
                      size="large"
                      showSearch
                      className="modern-select"
                      onChange={(value) => setCategory(value)}
                      value={category}
                    >
                      {categories?.map((c) => (
                        <Option key={c._id} value={c._id}>
                          {c.name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Photo Upload */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaImage />
                      Product Image
                    </label>
                    <div 
                      className={`upload-area ${isDragging ? 'dragging' : ''} ${photo ? 'has-file' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file" 
                        name="photo"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        className="file-input"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="upload-label">
                        <FaUpload />
                        <span>{photo ? photo.name : "Click to upload or drag & drop"}</span>
                        <small>Supports: JPG, PNG, GIF (Max 5MB)</small>
                      </label>
                    </div>
                    
                    {photo && (
                      <div className="image-preview">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt="product_photo"
                          className="preview-image"
                        />
                        <button 
                          type="button" 
                          className="remove-image"
                          onClick={() => setPhoto("")}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaFileAlt />
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      placeholder="Enter product name"
                      className="modern-form-input"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Product Description */}
                  <div className="form-group full-width">
                    <label className="form-label">
                      <FaFileAlt />
                      Product Description
                    </label>
                    <textarea
                      value={description}
                      placeholder="Enter detailed product description"
                      className="modern-form-textarea"
                      rows="4"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Price */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaDollarSign />
                      Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      placeholder="0.00"
                      className="modern-form-input"
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaBoxes />
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      placeholder="0"
                      className="modern-form-input"
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0"
                    />
                  </div>

                  {/* Shipping */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaShippingFast />
                      Shipping Available
                    </label>
                    <Select
                      bordered={false}
                      placeholder="Select shipping option"
                      size="large"
                      className="modern-select"
                      onChange={(value) => setShipping(value)}
                      value={shipping}
                    >
                      <Option value="0">No</Option>
                      <Option value="1">Yes</Option>
                    </Select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => navigate("/dashboard/admin/products")}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="create-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Create Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;