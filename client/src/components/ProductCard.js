import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCartPlus, FaEye, FaCheck } from "react-icons/fa";
import { fadeIn } from "../utils/motion";

const API = "https://e-commerce-host2.onrender.com";

const truncate = (text = "", max = 90) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

const ProductCard = ({ product, index = 0, onAddToCart }) => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [added, setAdded] = useState(false);
  const [swap, setSwap] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleAdd = () => {
    onAddToCart?.(product);
    timers.current.forEach(clearTimeout);
    setSwap(true);
    setAdded(true);
    timers.current = [
      setTimeout(() => setSwap(false), 180), // blur-bridge window
      setTimeout(() => setAdded(false), 1400),
    ];
  };

  const openDetails = () => navigate(`/product/${product.slug}`);

  const price = product?.price?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const revealProps = reduce
    ? {}
    : {
        variants: fadeIn("up", "tween", (index % 8) * 0.06, 0.3),
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount: 0.2 },
      };

  const card = (
    <div className="pc-card glass-card">
      <div className="pc-image">
        <img
          src={`${API}/api/v1/product/product-photo/${product._id}`}
          alt={product.name || "Product image"}
          loading="lazy"
          decoding="async"
        />
        <div className="pc-image-overlay" />
        <button
          type="button"
          className="pc-quickview"
          onClick={openDetails}
          aria-label={`Quick view ${product.name || "product"}`}
        >
          <FaEye aria-hidden="true" />
        </button>
      </div>
      <div className="pc-body">
        <div className="pc-head">
          <h3 className="pc-title">{product.name}</h3>
          <span className="pc-price">{price}</span>
        </div>
        <p className="pc-desc">{truncate(product.description)}</p>
        <div className="pc-actions">
          <button type="button" className="btn-ghost pc-btn" onClick={openDetails}>
            Details
          </button>
          <button
            type="button"
            className="btn-glow pc-btn"
            onClick={handleAdd}
            aria-live="polite"
          >
            <span className={`pc-btn-inner${swap ? " transitioning" : ""}`}>
              {added ? (
                <>
                  <FaCheck aria-hidden="true" /> Added
                </>
              ) : (
                <>
                  <FaCartPlus aria-hidden="true" /> Add
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return <motion.div {...revealProps}>{card}</motion.div>;
};

export default ProductCard;
