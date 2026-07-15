import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { fadeIn, staggerContainer } from "../utils/motion";
import API_URL from "../config";
import "../styles/Hero.css";

const API = API_URL;

const usd = (v) =>
  typeof v === "number"
    ? v.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : v;

const HeroSection = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  // Pull a few real products to populate the carousel.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API}/api/v1/product/product-list/1`);
        if (active && data?.products?.length) {
          setSlides(data.products.slice(0, 5));
        }
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Auto-advance (paused on hover/focus, disabled for reduced motion).
  useEffect(() => {
    if (reduce || paused || slides.length < 2) return undefined;
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4000
    );
    return () => clearInterval(timer.current);
  }, [reduce, paused, slides.length]);

  const go = (next) =>
    setIndex((i) => (next + slides.length) % slides.length);

  const motionProps = reduce
    ? { initial: false }
    : {
        variants: staggerContainer(0.06, 0.05),
        initial: "hidden",
        animate: "show",
      };
  const item = (delay) =>
    reduce ? {} : { variants: fadeIn("up", "tween", delay, 0.3) };

  return (
    <motion.section
      className="hero"
      aria-label="Featured storefront"
      {...motionProps}
    >
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.h1 className="hero-title" {...item(0.05)}>
            Gear that feels like the <span className="gradient-text">future</span>
          </motion.h1>

          <motion.p className="hero-sub" {...item(0.12)}>
            A curated storefront built for speed — studio-lit product shots,
            secure checkout, and free delivery on every order.
          </motion.p>

          <motion.div className="hero-cta" {...item(0.18)}>
            <button
              type="button"
              className="btn-glow"
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
              }
            >
              Shop the catalog <FaArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate("/categories")}
            >
              Explore categories
            </button>
          </motion.div>
        </div>

        <motion.div
          className="hero-carousel"
          {...(reduce ? {} : { variants: fadeIn("left", "tween", 0.15, 0.35) })}
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured products"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {slides.length === 0 && <div className="hero-carousel-skeleton" />}

          {slides.map((p, i) => (
            <button
              type="button"
              key={p._id}
              className={`hero-slide${i === index ? " active" : ""}`}
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
              onClick={() => navigate(`/product/${p.slug}`)}
              aria-label={`View ${p.name}`}
            >
              <img
                src={`${API}/api/v1/product/product-photo/${p._id}`}
                alt={p.name || "Featured product"}
                loading={i === 0 ? "eager" : "lazy"}
              />
              <span className="hero-slide-overlay" />
              <span className="hero-slide-cap">
                <span className="hero-slide-name">{p.name}</span>
                <span className="hero-slide-price">{usd(p.price)}</span>
              </span>
            </button>
          ))}

          {slides.length > 1 && (
            <>
              <div className="hero-car-nav">
                <button
                  type="button"
                  className="hero-car-btn"
                  onClick={() => go(index - 1)}
                  aria-label="Previous product"
                >
                  <FaArrowLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="hero-car-btn"
                  onClick={() => go(index + 1)}
                  aria-label="Next product"
                >
                  <FaArrowRight aria-hidden="true" />
                </button>
              </div>
              <div className="hero-dots" role="tablist" aria-label="Choose product">
                {slides.map((p, i) => (
                  <button
                    type="button"
                    key={p._id}
                    className={`hero-dot${i === index ? " active" : ""}`}
                    aria-label={`Go to product ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
