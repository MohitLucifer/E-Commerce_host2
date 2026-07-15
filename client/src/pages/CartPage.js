import React, { useState } from "react";
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
} from "react-icons/fa";
import API_URL from "../config";

const API = API_URL;
const TAX_RATE = 0.08;
const REMOVE_MS = 280; // keep under the 300ms UI ceiling

const usd = (value) =>
  (Number(value) || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

const truncate = (text = "", max = 80) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  const subtotal = () =>
    cart?.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) || 0;

  const updateQuantity = (pid, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const myCart = [...cart];
      const index = myCart.findIndex((item) => item._id === pid);
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

  const removeCartItem = (pid) => {
    try {
      setRemovingItem(pid);
      setTimeout(() => {
        const myCart = [...cart];
        const index = myCart.findIndex((item) => item._id === pid);
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
        setRemovingItem(null);
        toast.success("Item removed from cart!");
      }, REMOVE_MS);
    } catch (error) {
      console.log(error);
      setRemovingItem(null);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/api/v1/product/braintree/payment`, { cart });
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

  const continueShopping = () => navigate("/");

  if (cart?.length === 0) {
    return (
      <Layout title={"Your Cart"}>
        <div className="empty-cart-container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon" aria-hidden="true">
              <FaShoppingCart />
            </div>
            <h1>Your cart is empty</h1>
            <p>Looks like you haven't added any items yet.</p>
            <button
              type="button"
              className="continue-shopping-btn"
              onClick={continueShopping}
            >
              <FaArrowLeft aria-hidden="true" />
              Continue shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const itemWord = cart?.length === 1 ? "item" : "items";

  return (
    <Layout title={"Your Cart"}>
      <main className="modern-cart-container">
        <header className="cart-header">
          <div className="cart-header-content">
            <h1>{auth?.token ? `Hello, ${auth?.user?.name}` : "Your cart"}</h1>
            <p className="cart-summary-badge">
              <FaShoppingCart aria-hidden="true" />
              <span>
                {cart?.length} {itemWord} in your cart
              </span>
            </p>
          </div>
        </header>

        <div className="cart-content">
          <section className="cart-items-section" aria-label="Cart items">
            <div className="section-header">
              <h2>Shopping cart</h2>
              <span className="item-count">
                {cart?.length} {itemWord}
              </span>
            </div>

            <ul className="cart-items">
              {cart?.map((item) => (
                <li
                  key={item._id}
                  className={`cart-item ${
                    removingItem === item._id ? "removing" : ""
                  }`}
                >
                  <div className="item-image">
                    <img
                      src={`${API}/api/v1/product/product-photo/${item._id}`}
                      alt={item.name || "Product image"}
                      loading="lazy"
                    />
                  </div>

                  <div className="item-details">
                    <div className="item-header">
                      <h3 className="item-name">{item.name}</h3>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeCartItem(item._id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FaTrash aria-hidden="true" />
                      </button>
                    </div>

                    <p className="item-description">
                      {truncate(item.description)}
                    </p>

                    <div className="item-price">
                      <span className="price">{usd(item.price)}</span>
                      {item.originalPrice && (
                        <span className="original-price">
                          {usd(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) - 1)
                        }
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <FaMinus aria-hidden="true" />
                      </button>
                      <span className="quantity" aria-live="polite">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) + 1)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <FaPlus aria-hidden="true" />
                      </button>
                    </div>

                    <div className="item-total">
                      <span>{usd((item.quantity || 1) * item.price)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="cart-summary-section" aria-label="Order summary">
            <div className="summary-card">
              <h2>Order summary</h2>

              <div className="summary-items">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>{usd(subtotal())}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>
                <div className="summary-item">
                  <span>Tax</span>
                  <span>{usd(subtotal() * TAX_RATE)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item total">
                  <span>Total</span>
                  <span>{usd(subtotal() * (1 + TAX_RATE))}</span>
                </div>
              </div>

              <div className="address-section">
                <div className="address-header">
                  <FaMapMarkerAlt aria-hidden="true" />
                  <h3>Delivery address</h3>
                </div>

                {auth?.user?.address ? (
                  <div className="current-address">
                    <p>{auth?.user?.address}</p>
                    <button
                      type="button"
                      className="update-address-btn"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update address
                    </button>
                  </div>
                ) : (
                  <div className="no-address">
                    <p>No address set</p>
                    {auth?.token ? (
                      <button
                        type="button"
                        className="add-address-btn"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Add address
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="login-btn"
                        onClick={() => navigate("/login", { state: "/cart" })}
                      >
                        Login to continue
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="payment-section">
                <div className="payment-header">
                  <FaCreditCard aria-hidden="true" />
                  <h3>Payment</h3>
                </div>

                <button
                  type="button"
                  className="payment-btn"
                  onClick={handlePayment}
                  disabled={loading || !auth?.user?.address}
                  aria-busy={loading}
                >
                  {loading ? (
                    <span className="spinner-sm" aria-hidden="true"></span>
                  ) : (
                    <>
                      <FaCreditCard aria-hidden="true" />
                      {auth?.user?.address
                        ? "Proceed to payment"
                        : "Add address first"}
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                className="continue-shopping-btn-secondary"
                onClick={continueShopping}
              >
                <FaArrowLeft aria-hidden="true" />
                Continue shopping
              </button>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
};

export default CartPage;
