import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import {
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaUndo,
} from "react-icons/fa";
import API_URL from "../config";

const API = API_URL;

const formatPrice = (value) =>
  typeof value === "number"
    ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : value;

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  //initial details
  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line
  }, [params?.slug]);

  //getProduct
  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    const next = [...cart, productWithQuantity];
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    toast.success(`${quantity} item(s) added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleAddRelated = (p) => {
    const existingItemIndex = cart.findIndex((item) => item._id === p._id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity =
        (updatedCart[existingItemIndex].quantity || 1) + 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Quantity increased in cart");
    } else {
      const newItem = { ...p, quantity: 1 };
      setCart([...cart, newItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
      toast.success("Item Added to cart");
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="product-details-loading" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Loading product details…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={product?.name ? `${product.name} - Details` : "Product"}>
      <main className="modern-product-details">
        <section className="product-details-container" aria-label="Product">
          {/* Product image */}
          <div className="product-images-section">
            <div className="main-image-container">
              <img
                src={`${API}/api/v1/product/product-photo/${product._id}`}
                className="main-product-image"
                alt={product.name || "Product image"}
                loading="eager"
              />
              <div className="image-overlay">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={handleWishlist}
                  aria-pressed={isWishlisted}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <FaHeart className={isWishlisted ? "wishlisted" : ""} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={handleShare}
                  aria-label="Share product"
                >
                  <FaShare aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Product information */}
          <div className="product-info-section">
            <nav className="pd-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep" aria-hidden="true">/</span>
              {product?.category?.slug ? (
                <Link to={`/category/${product.category.slug}`}>
                  {product.category.name}
                </Link>
              ) : (
                <span>{product?.category?.name}</span>
              )}
              <span className="sep" aria-hidden="true">/</span>
              <span className="current">{product.name}</span>
            </nav>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-section">
              <div className="pd-price-row">
                <span className="price">{formatPrice(product.price)}</span>
                <span className="pd-stock">
                  <span className="dot" aria-hidden="true" /> In stock
                </span>
              </div>
              <p className="price-note">Free shipping • 30-day returns</p>
            </div>

            <div className="product-description">
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>

            <div className="quantity-section">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-controls">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  min="1"
                  className="quantity-input"
                />
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart aria-hidden="true" />
                Add to cart
              </button>
              <button type="button" className="buy-now-btn" onClick={handleBuyNow}>
                Buy now
              </button>
            </div>

            <ul className="product-features">
              <li className="feature">
                <FaTruck aria-hidden="true" />
                <span>Free shipping</span>
              </li>
              <li className="feature">
                <FaShieldAlt aria-hidden="true" />
                <span>Secure payment</span>
              </li>
              <li className="feature">
                <FaUndo aria-hidden="true" />
                <span>Easy returns</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Similar products */}
        <section className="similar-products-section" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="similar-title">
            You might also like
          </h2>

          {relatedProducts.length < 1 ? (
            <div className="no-products">
              <p>No similar products found.</p>
            </div>
          ) : (
            <div className="pc-grid">
              {relatedProducts?.map((p, i) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  index={i}
                  onAddToCart={handleAddRelated}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default ProductDetails;
