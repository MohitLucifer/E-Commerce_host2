import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryProductStyles.css";
import { toast } from "react-toastify";
import { useCart } from "../context/cart";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `https://e-commerce-host2.onrender.com/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="product-grid">
              {products?.map((p) => (
                <div className="modern-product-card" key={p._id}>
                  <div className="product-image-container">
                    <img
                      src={`https://e-commerce-host2.onrender.com/api/v1/product/product-photo/${p._id}`}
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
            {/* <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;