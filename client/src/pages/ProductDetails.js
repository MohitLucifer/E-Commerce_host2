import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { 
  FaShoppingCart, 
  FaHeart, 
  FaShare, 
  FaStar, 
  FaTruck, 
  FaShieldAlt, 
  FaUndo 
} from 'react-icons/fa';

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock product images for demonstration
  const productImages = [
    `/api/v1/product/product-photo/${product._id}`,
    `/api/v1/product/product-photo/${product._id}`,
    `/api/v1/product/product-photo/${product._id}`,
  ];

  //initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //getProduct
  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://e-commerce-host2.onrender.com/api/v1/product/get-product/${params.slug}`
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
        `https://e-commerce-host2.onrender.com/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    setCart([...cart, productWithQuantity]);
    localStorage.setItem("cart", JSON.stringify([...cart, productWithQuantity]));
    toast.success(`${quantity} item(s) added to cart!`);
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
        <div className="product-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="modern-product-details">
        {/* Product Main Section */}
        <div className="product-details-container">
          {/* Product Images */}
          <div className="product-images-section">
            <div className="main-image-container">
              <img
                src={productImages[selectedImage]}
                className="main-product-image"
                alt={product.name}
              />
              <div className="image-overlay">
                <button className="wishlist-btn" onClick={handleWishlist}>
                  <FaHeart className={isWishlisted ? "wishlisted" : ""} />
                </button>
                <button className="share-btn" onClick={handleShare}>
                  <FaShare />
                </button>
              </div>
            </div>
            <div className="thumbnail-images">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="star-icon" />
                  ))}
                </div>
                <span className="rating-text">4.8 (2,456 reviews)</span>
              </div>
            </div>

            <div className="product-price-section">
              <div className="price-container">
                <span className="currency">$</span>
                <span className="price">{product.price}</span>
                <span className="original-price">$699</span>
                <span className="discount">-14%</span>
              </div>
              <p className="price-note">Free shipping • In stock</p>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-category">
              <span className="category-label">Category:</span>
              <span className="category-name">{product?.category?.name}</span>
            </div>

            <div className="quantity-section">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="quantity-input"
                />
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart />
                Add to Cart
              </button>
              <button className="buy-now-btn">
                Buy Now
              </button>
            </div>

            <div className="product-features">
              <div className="feature">
                <FaTruck />
                <span>Free Shipping</span>
              </div>
              <div className="feature">
                <FaShieldAlt />
                <span>Secure Payment</span>
              </div>
              <div className="feature">
                <FaUndo />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="similar-products-section">
          <div className="section-header">
            <h2>Similar Products</h2>
            <p>You might also like these products</p>
          </div>
          
          {relatedProducts.length < 1 ? (
            <div className="no-products">
              <p>No similar products found</p>
            </div>
          ) : (
            <div className="product-grid">
              {relatedProducts?.map((p) => (
                <div className="modern-product-card" key={p._id}>
                  <div className="product-image-container">
                    <img
                      src={`/api/v1/product/product-photo/${p?._id}`}
                      className="product-image"
                      alt={p.name}
                    />
                  </div>
                  <div className="product-card-body">
                    <div className="product-header">
                      <h5 className="product-title">{p.name}</h5>
                      <p className="product-price">${p.price}</p>
                    </div>
                    <p className="product-description">
                      {p.description.substring(0, 120)}...
                    </p>
                    <div className="product-actions">
                      <button
                        className="product-btn product-btn-primary"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button 
                        className="product-btn product-btn-secondary"
                        onClick={() => {
                          // Check if item already exists in cart
                          const existingItemIndex = cart.findIndex(item => item._id === p._id);
                          
                          if (existingItemIndex !== -1) {
                            // Item exists, increase quantity
                            const updatedCart = [...cart];
                            updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1;
                            setCart(updatedCart);
                            localStorage.setItem("cart", JSON.stringify(updatedCart));
                            toast.success("Quantity increased in cart");
                          } else {
                            // New item, add with quantity 1
                            const newItem = { ...p, quantity: 1 };
                            setCart([...cart, newItem]);
                            localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
                            toast.success("Item Added to cart");
                          }
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;