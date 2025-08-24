import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import { FaShoppingBag, FaUser, FaCalendarAlt, FaDollarSign, FaCheckCircle, FaClock, FaTruck, FaBox, FaEye, FaFilter } from 'react-icons/fa';

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://e-commerce-host2.onrender.com/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`https://e-commerce-host2.onrender.com/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      toast.success("Order status updated successfully");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <FaClock className="status-icon processing" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'deliverd':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'cancel':
        return <FaBox className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return '#ffa726';
      case 'shipped':
        return '#42a5f5';
      case 'deliverd':
        return '#66bb6a';
      case 'cancel':
        return '#ef5350';
      default:
        return '#9e9e9e';
    }
  };

  const calculateTotal = (products) => {
    return products?.reduce((total, product) => total + product.price, 0) || 0;
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title={"All Orders Data"}>
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
                  <FaShoppingBag />
                  All Orders
                </h1>
                <p className="admin-subtitle">
                  Manage and track customer orders
                </p>
              </div>
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    ${orders.reduce((total, order) => total + calculateTotal(order.products), 0).toFixed(2)}
                  </span>
                  <span className="stat-label">Total Revenue</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="search-box">
                <FaUser />
                <input
                  type="text"
                  placeholder="Search by customer name or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-box">
                <FaFilter />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  {status.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading orders...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredOrders.length === 0 && (
              <div className="empty-orders">
                <div className="empty-icon">
                  <FaShoppingBag />
                </div>
                <h3>No Orders Found</h3>
                <p>
                  {searchTerm || selectedStatus !== "all" 
                    ? "No orders match your search criteria" 
                    : "No orders have been placed yet"}
                </p>
              </div>
            )}

            {/* Orders List */}
            {!loading && filteredOrders.length > 0 && (
              <div className="orders-list">
                {filteredOrders?.map((order, index) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-number">
                          <span className="label">Order #{index + 1}</span>
                          <span className="value">{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="order-customer">
                          <FaUser />
                          <span>{order?.buyer?.name}</span>
                        </div>
                        <div className="order-date">
                          <FaCalendarAlt />
                          <span>{moment(order?.createAt).format('MMM DD, YYYY HH:mm')}</span>
                        </div>
                        <div className="order-status">
                          {getStatusIcon(order?.status)}
                          <span 
                            className="status-text"
                            style={{ color: getStatusColor(order?.status) }}
                          >
                            {order?.status}
                          </span>
                        </div>
                      </div>
                      <div className="order-total">
                        <FaDollarSign />
                        <span>${calculateTotal(order?.products).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="order-summary">
                      <div className="summary-item">
                        <span className="label">Items:</span>
                        <span className="value">{order?.products?.length} products</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Payment:</span>
                        <span className="value payment-status">
                          <FaCheckCircle />
                          Success
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Status:</span>
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(order._id, value)}
                          defaultValue={order?.status}
                          className="status-select"
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    {/* Order Products */}
                    <div className="order-products">
                      <h4>Order Items</h4>
                      <div className="products-grid">
                        {order?.products?.map((product) => (
                          <div key={product._id} className="product-item">
                            <div className="product-image">
                              <img
                                src={`https://e-commerce-host2.onrender.com/api/v1/product/product-photo/${product._id}`}
                                alt={product.name}
                              />
                            </div>
                            <div className="product-info">
                              <h5 className="product-name">{product.name}</h5>
                              <p className="product-description">
                                {product.description.substring(0, 50)}...
                              </p>
                              <div className="product-price">
                                <FaDollarSign />
                                <span>{product.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Summary */}
            {!loading && filteredOrders.length > 0 && (
              <div className="results-summary">
                <p>
                  Showing {filteredOrders.length} of {orders.length} orders
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedStatus !== "all" && ` with status "${selectedStatus}"`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;