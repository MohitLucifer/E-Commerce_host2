import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/HomePage.css";
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Popularity", value: "popularity" },
  { label: "Price -- Low to High", value: "priceLowHigh" },
  { label: "Price -- High to Low", value: "priceHighLow" },
];

const HomePage = () => {
  const navigate = useNavigate();
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
      const { data } = await axios.get("https://e-commerce-host2.onrender.com/api/v1/category/get-category");
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
      const { data } = await axios.get(`https://e-commerce-host2.onrender.com/api/v1/product/product-list/${page}`);
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
      const { data } = await axios.get("https://e-commerce-host2.onrender.com/api/v1/product/product-count");
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
      const { data } = await axios.get(`https://e-commerce-host2.onrender.com/api/v1/product/product-list/${page}`);
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
      const { data } = await axios.post("https://e-commerce-host2.onrender.com/api/v1/product/product-filters", {
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

  return (
    <Layout title={"ALl Products - Best offers "}>
      <div className="row justify-content-center align-items-center" style={{ marginTop: "30px" }}>
        <div className="col-lg-2 d-none d-lg-block">
          <div className="carousel-side-panel left-panel">
            <div className="panel-content">
              <h6>Trending</h6>
              <ul>
                <li>Smartphones</li>
                <li>Winter Wear</li>
                <li>Kids Fashion</li>
                <li>Smart Watches</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-12">
          <div
            id="carouselExampleCaptions"
            className="carousel slide modern-carousel"
            data-bs-ride="carousel"
            style={{
              padding: 0,
              margin: "0 auto",
              maxWidth: "100%",
              borderRadius: "24px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
              overflow: "hidden",
            }}
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={0}
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              />
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={1}
                aria-label="Slide 2"
              />
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={2}
                aria-label="Slide 3"
              />
            </div>
            <div className="carousel-inner" style={{ minHeight: "340px" }}>
              <div className="carousel-item active">
                <img
                  src="/images/moto1.jpg"
                  className="d-block w-100 carousel-img"
                  alt="Moto"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Ecommerce Shopping</h5>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="/images/vivo1.jpg"
                  className="d-block w-100 carousel-img"
                  alt="VIVO V29 PRO"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>VIVO V29 PRO</h5>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="/images/br2.jpg"
                  className="d-block w-100 carousel-img"
                  alt="FIRE BOLT"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>FIRE BOLT</h5>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev modern-arrow"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
            </button>
            <button
              className="carousel-control-next modern-arrow"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="col-lg-2 d-none d-lg-block">
          <div className="carousel-side-panel right-panel">
            <div className="panel-content">
              <h6>Offers</h6>
              <ul>
                <li>Up to 50% Off</li>
                <li>New Arrivals</li>
                <li>Best Sellers</li>
                <li>Free Shipping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid row mt-3">
        <div className="col-md-2 filter-card">
          <div className="filter-section">
            <div className="filter-header" onClick={() => setCategoryOpen(!categoryOpen)}>
              Filter By Category
              {categoryOpen ? <DownOutlined /> : <RightOutlined />}
            </div>
            <div className={`filter-list ${categoryOpen ? "expanded" : "collapsed"}`}>
              {categories?.map((c) => (
                <label className="filter-item" key={c._id}>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={checked.includes(c._id)}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-header" onClick={() => setPriceOpen(!priceOpen)}>
              Filter By Price
              {priceOpen ? <DownOutlined /> : <RightOutlined />}
            </div>
            <div className={`filter-list ${priceOpen ? "expanded" : "collapsed"}`}>
              <Radio.Group value={radio} onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <label className="filter-item" key={p._id}>
                    <input
                      type="radio"
                      className="custom-radio"
                      checked={radio === p.array}
                      value={p.array}
                      onChange={() => setRadio(p.array)}
                      name="price"
                    />
                    {p.name}
                  </label>
                ))}
              </Radio.Group>
            </div>
          </div>
          <button
            className="reset-btn"
            onClick={() => {
              setChecked([]);
              setRadio([]);
              getAllProducts();
            }}
          >
            RESET FILTERS
          </button>
        </div>
        <div className="col-md-9 offset-1">
          {/* Sort Bar */}
          <nav className="sort-bar" aria-label="Sort products">
            <span>Sort By</span>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                className={`sort-btn${sortBy === opt.value ? " active" : ""}`}
                type="button"
                aria-current={sortBy === opt.value ? "true" : undefined}
                onClick={() => handleSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </nav>
          <h1 className="text-center">All Products</h1>
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
          <div className="m-2 p-3">
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
// style={{ backgroundColor: '#c2c2d6', border: '5px solid black', borderRadius: '10px' }}