import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { FaShoppingBag, FaCheckCircle, FaClock, FaTruck, FaBox, FaCalendarAlt, FaDollarSign, FaEye } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <FaClock className="status-icon processing" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      default:
        return <FaBox className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return '#ffa726';
      case 'shipped':
        return '#42a5f5';
      case 'delivered':
        return '#66bb6a';
      default:
        return '#9e9e9e';
    }
  };

  const calculateTotal = (products) => {
    return products?.reduce((total, product) => total + product.price, 0) || 0;
  };

  return (
    <Layout title={"Your Orders"}>
      <div className="modern-orders-container">
        <div className="orders-content">
          <div className="orders-sidebar">
            <UserMenu />
          </div>
          <div className="orders-main">
            {/* Orders Header */}
            <div className="orders-header">
              <div className="header-content">
                <h1 className="orders-title">
                  <FaShoppingBag />
                  My Orders
                </h1>
                <p className="orders-subtitle">
                  Track your order history and current shipments
                </p>
              </div>
              <div className="orders-stats">
                <div className="stat-item">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your orders...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && orders.length === 0 && (
              <div className="empty-orders">
                <div className="empty-icon">
                  <FaShoppingBag />
                </div>
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
                <button className="shop-now-btn">Start Shopping</button>
              </div>
            )}

            {/* Orders List */}
            {!loading && orders.length > 0 && (
              <div className="orders-list">
                {orders?.map((order, index) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-number">
                          <span className="label">Order #{index + 1}</span>
                          <span className="value">{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="order-date">
                          <FaCalendarAlt />
                          <span>{moment(order?.createAt).format('MMM DD, YYYY')}</span>
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
                      <div className="order-actions">
                        <button 
                          className="view-details-btn"
                          onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                        >
                          <FaEye />
                          <span>{selectedOrder === order._id ? 'Hide' : 'View'} Details</span>
                        </button>
                      </div>
                    </div>

                    <div className="order-summary">
                      <div className="summary-item">
                        <span className="label">Items:</span>
                        <span className="value">{order?.products?.length} products</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Total:</span>
                        <span className="value total-price">
                          <FaDollarSign />
                          {calculateTotal(order?.products).toFixed(2)}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Payment:</span>
                        <span className="value payment-status">
                          <FaCheckCircle />
                          Success
                        </span>
                      </div>
                    </div>

                    {/* Order Details (Expandable) */}
                    {selectedOrder === order._id && (
                      <div className="order-details">
                        <div className="products-list">
                          <h4>Order Items</h4>
                          {order?.products?.map((product, productIndex) => (
                            <div key={product._id} className="product-item">
                              <div className="product-image">
                                <img
                                  src={`/api/v1/product/product-photo/${product._id}`}
                                  alt={product.name}
                          />
                        </div>
                              <div className="product-info">
                                <h5 className="product-name">{product.name}</h5>
                                <p className="product-description">
                                  {product.description.substring(0, 100)}...
                                </p>
                                <div className="product-meta">
                                  <span className="product-price">
                                    <FaDollarSign />
                                    {product.price}
                                  </span>
                                  <span className="product-category">
                                    {product.category?.name}
                                  </span>
                                </div>
                        </div>
                      </div>
                    ))}
                  </div>
                        
                        <div className="order-timeline">
                          <h4>Order Timeline</h4>
                          <div className="timeline">
                            <div className="timeline-item completed">
                              <div className="timeline-icon">
                                <FaCheckCircle />
                              </div>
                              <div className="timeline-content">
                                <h5>Order Placed</h5>
                                <p>{moment(order?.createAt).format('MMM DD, YYYY HH:mm')}</p>
                              </div>
                            </div>
                            <div className="timeline-item active">
                              <div className="timeline-icon">
                                <FaTruck />
                              </div>
                              <div className="timeline-content">
                                <h5>Processing</h5>
                                <p>Your order is being prepared</p>
                              </div>
                            </div>
                            <div className="timeline-item">
                              <div className="timeline-icon">
                                <FaBox />
                              </div>
                              <div className="timeline-content">
                                <h5>Shipped</h5>
                                <p>Order will be shipped soon</p>
                              </div>
                            </div>
                            <div className="timeline-item">
                              <div className="timeline-icon">
                                <FaCheckCircle />
                              </div>
                              <div className="timeline-content">
                                <h5>Delivered</h5>
                                <p>Order will be delivered</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;