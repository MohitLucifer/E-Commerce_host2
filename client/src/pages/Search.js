import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";

const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart();

  const results = values?.results || [];
  const count = results.length;

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

  return (
    <Layout title={"Search results"}>
      <main className="page-shell">
        <header className="shell-head">
          <h1 className="shell-title">Search results</h1>
          <p className="shell-sub">
            {count < 1
              ? "No products matched your search."
              : `${count} product${count === 1 ? "" : "s"} found`}
          </p>
        </header>

        {count > 0 ? (
          <div className="pc-grid">
            {results.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="shell-empty">
            <p>Try a different keyword or browse the full catalog.</p>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Search;
