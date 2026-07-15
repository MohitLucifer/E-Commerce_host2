import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/HomePage.css";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import API_URL from "../config";

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "priceLowHigh" },
  { label: "Price: High to Low", value: "priceHighLow" },
];

const HomePage = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/api/v1/product/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Sorting handler
  const handleSort = (option) => {
    setSortBy(option);
    let sortedProducts = [...products];
    if (option === "priceLowHigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "priceHighLow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (option === "popularity") {
      // If you have a popularity field, sort by it. Example:
      // sortedProducts.sort((a, b) => b.popularity - a.popularity);
      // Otherwise, keep as is.
    } else {
      // "relevance" or default: keep original order
      sortedProducts = [...products];
    }
    setProducts(sortedProducts);
  };

  // Re-sort products when sortBy changes or products change
  useEffect(() => {
    handleSort(sortBy);
    // eslint-disable-next-line
  }, [sortBy, products.length]);

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

  const activeFilters = checked.length + (radio.length ? 1 : 0);

  return (
    <Layout title={"All Products - Best offers"}>
      <HeroSection />

      <section className="shop" id="products" aria-labelledby="shop-heading">
        <aside className="shop-rail" aria-label="Product filters">
          <div className="rail-inner">
            <div className="rail-top">
              <h2 className="rail-title">Refine</h2>
              {activeFilters > 0 && (
                <span className="rail-count" aria-live="polite">
                  {activeFilters} active
                </span>
              )}
            </div>

            <div className="filter-group">
              <button
                type="button"
                className="filter-head"
                aria-expanded={categoryOpen}
                aria-controls="filter-category"
                onClick={() => setCategoryOpen((v) => !v)}
              >
                <span>Category</span>
                {categoryOpen ? <DownOutlined /> : <RightOutlined />}
              </button>
              <div
                id="filter-category"
                className={`filter-body ${categoryOpen ? "open" : ""}`}
              >
                <div className="filter-body-inner">
                  {categories?.map((c) => (
                    <label className="filter-item" key={c._id}>
                      <input
                        type="checkbox"
                        checked={checked.includes(c._id)}
                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-group">
              <button
                type="button"
                className="filter-head"
                aria-expanded={priceOpen}
                aria-controls="filter-price"
                onClick={() => setPriceOpen((v) => !v)}
              >
                <span>Price</span>
                {priceOpen ? <DownOutlined /> : <RightOutlined />}
              </button>
              <div
                id="filter-price"
                className={`filter-body ${priceOpen ? "open" : ""}`}
              >
                <div className="filter-body-inner">
                  {Prices?.map((p) => (
                    <label className="filter-item" key={p._id}>
                      <input
                        type="radio"
                        name="price"
                        checked={radio === p.array}
                        value={p.array}
                        onChange={() => setRadio(p.array)}
                      />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="rail-reset"
              onClick={() => {
                setChecked([]);
                setRadio([]);
                getAllProducts();
              }}
            >
              Reset filters
            </button>
          </div>
        </aside>

        <div className="shop-main">
          <header className="shop-head">
            <div>
              <h2 id="shop-heading" className="shop-title">
                The catalog
              </h2>
              <p className="shop-sub">
                {total > 0
                  ? `${products.length} of ${total} products`
                  : "Curated for you"}
              </p>
            </div>

            <div
              className="sort-group"
              role="group"
              aria-label="Sort products"
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`sort-chip${sortBy === opt.value ? " active" : ""}`}
                  aria-pressed={sortBy === opt.value}
                  onClick={() => handleSort(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </header>

          {products?.length === 0 && !loading ? (
            <div className="shop-empty">
              <p>No products match these filters.</p>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setChecked([]);
                  setRadio([]);
                  getAllProducts();
                }}
              >
                Clear filters
              </button>
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

          {products && products.length < total && (
            <div className="shop-more">
              <button
                type="button"
                className="btn-ghost"
                aria-busy={loading}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
