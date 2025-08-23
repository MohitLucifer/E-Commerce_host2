import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaArrowLeft,
  FaHeart,
  FaShare
} from 'react-icons/fa';

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        const quantity = item.quantity || 1;
        total = total + (item.price * quantity);
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate subtotal
  const subtotal = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        const quantity = item.quantity || 1;
        total = total + (item.price * quantity);
      });
      return total;
    } catch (error) {
      console.log(error);
    }
  };

  // Update item quantity
  const updateQuantity = (pid, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      if (index !== -1) {
        myCart[index].quantity = newQuantity;
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
        toast.success("Quantity updated!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Remove cart item with animation
  const removeCartItem = async (pid) => {
    try {
      setRemovingItem(pid);
      // Add a small delay for animation
      setTimeout(() => {
        let myCart = [...cart];
        let index = myCart.findIndex((item) => item._id === pid);
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
        setRemovingItem(null);
        toast.success("Item removed from cart!");
      }, 300);
    } catch (error) {
      console.log(error);
      setRemovingItem(null);
    }
  };

  // Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        cart
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  // Continue shopping
  const continueShopping = () => {
    navigate("/");
  };

  if (cart?.length === 0) {
    return (
      <Layout>
        <div className="empty-cart-container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <FaShoppingCart />
            </div>
            <h1>Your Cart is Empty</h1>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={continueShopping}>
              <FaArrowLeft />
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="modern-cart-container">
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-header-content">
            <h1>Hello {auth?.token && auth?.user?.name}</h1>
            <div className="cart-summary-badge">
              <FaShoppingCart />
              <span>{cart?.length} {cart?.length === 1 ? 'item' : 'items'} in your cart</span>
            </div>
          </div>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="section-header">
              <h2>Shopping Cart</h2>
              <span className="item-count">{cart?.length} {cart?.length === 1 ? 'item' : 'items'}</span>
            </div>
            
            <div className="cart-items">
              {cart?.map((item) => (
                <div 
                  key={item._id} 
                  className={`cart-item ${removingItem === item._id ? 'removing' : ''}`}
                >
                  <div className="item-image">
                    <img
                      src={`/api/v1/product/product-photo/${item._id}`}
                      alt={item.name}
                    />
                  </div>
                  
                  <div className="item-details">
                    <div className="item-header">
                      <h3 className="item-name">{item.name}</h3>
                      <button 
                        className="remove-btn"
                        onClick={() => removeCartItem(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <p className="item-description">
                      {item.description?.substring(0, 80)}...
                    </p>
                    
                    <div className="item-price">
                      <span className="price">${item.price}</span>
                      {item.originalPrice && (
                        <span className="original-price">${item.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{item.quantity || 1}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <div className="item-total">
                      <span>Total: ${((item.quantity || 1) * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-section">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-items">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>${subtotal()?.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>
                <div className="summary-item">
                  <span>Tax</span>
                  <span>${(subtotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item total">
                  <span>Total</span>
                  <span>{totalPrice()}</span>
                </div>
              </div>

              {/* Address Section */}
              <div className="address-section">
                <div className="address-header">
                  <FaMapMarkerAlt />
                  <h3>Delivery Address</h3>
                </div>
                
                {auth?.user?.address ? (
                  <div className="current-address">
                    <p>{auth?.user?.address}</p>
                    <button
                      className="update-address-btn"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                ) : (
                  <div className="no-address">
                    <p>No address set</p>
                    {auth?.token ? (
                      <button
                        className="add-address-btn"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Add Address
                      </button>
                    ) : (
                      <button
                        className="login-btn"
                        onClick={() => navigate("/login", { state: "/cart" })}
                      >
                        Login to Continue
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="payment-section">
                <div className="payment-header">
                  <FaCreditCard />
                  <h3>Payment</h3>
                </div>
                
                <button
                  className="payment-btn"
                  onClick={handlePayment}
                  disabled={loading || !auth?.user?.address}
                >
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <FaCreditCard />
                      {auth?.user?.address ? "Proceed to Payment" : "Add Address First"}
                    </>
                  )}
                </button>
              </div>

              {/* Continue Shopping */}
              <button className="continue-shopping-btn-secondary" onClick={continueShopping}>
                <FaArrowLeft />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;