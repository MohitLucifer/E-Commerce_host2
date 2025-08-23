import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Search = () => {
  const [values, setValues] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  return (
    <Layout title={"Search results"}>
      <div className="modern-product-details">
        <div className="section-header">
          <h1>Search Results</h1>
          <p>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} product(s)`}
          </p>
        </div>
        
        {values?.results.length > 0 && (
          <div className="product-grid">
            {values?.results.map((p) => (
              <div className="modern-product-card" key={p._id}>
                <div className="product-image-container">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
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
    </Layout>
  );
};

export default Search;