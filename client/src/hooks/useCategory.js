import { useState, useEffect } from "react";
import axios from "axios";

const CACHE_KEY = "categories-cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (!Array.isArray(data) || Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // storage full/unavailable — cache is best-effort
  }
};

export default function useCategory() {
  // Serve cached categories instantly; fetch only when cache is missing/stale.
  const [categories, setCategories] = useState(() => readCache() || []);

  useEffect(() => {
    if (readCache()) return; // fresh enough, skip network

    let active = true;
    (async () => {
      try {
        const { data } = await axios.get(
          "https://e-commerce-host2.onrender.com/api/v1/category/get-category"
        );
        if (active && data?.category) {
          setCategories(data.category);
          writeCache(data.category);
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return categories;
}
