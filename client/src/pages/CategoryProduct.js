import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryProductStyles.css";
import { toast } from "react-toastify";
import { useCart } from "../context/cart";
import ProductCard from "../components/ProductCard";
import API_URL from "../config";

const API = API_URL;

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
    // eslint-disable-next-line
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (p) => {
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

  const count = products?.length || 0;

  return (
    <Layout title={category?.name ? `${category.name} - Category` : "Category"}>
      <main className="page-shell">
        <header className="shell-head">
          <h1 className="shell-title">{category?.name}</h1>
          <p className="shell-sub">
            {count} {count === 1 ? "product" : "products"} in this collection
          </p>
        </header>

        {count === 0 ? (
          <div className="shell-empty">
            <p>Nothing here yet — check back soon.</p>
          </div>
        ) : (
          <div className="pc-grid">
            {products?.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
};

export default CategoryProduct;
