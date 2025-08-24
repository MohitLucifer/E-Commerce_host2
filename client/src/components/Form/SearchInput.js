import React, { useState, useEffect, useRef } from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaClock, FaFire, FaArrowUp } from 'react-icons/fa';

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    "iPhone", "Samsung", "Laptop", "Headphones", "Shoes", "Dress", "Watch"
  ]);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Debounced search suggestions
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (values.keyword.trim().length >= 2) {
      setLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const { data } = await axios.get(
            `https://e-commerce-host2.onrender.com/api/v1/product/search-suggestions/${values.keyword}`
          );
          setSuggestions(data.suggestions || []);
          setLoading(false);
        } catch (error) {
          // Fallback to basic suggestions if API fails
          const basicSuggestions = popularSearches.filter(item =>
            item.toLowerCase().includes(values.keyword.toLowerCase())
          );
          setSuggestions(basicSuggestions);
          setLoading(false);
        }
      }, 300); // 300ms delay
    } else {
      setSuggestions([]);
      setLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [values.keyword, popularSearches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.keyword.trim()) return;
    
    saveRecentSearch(values.keyword);
    setShowSuggestions(false);
    
    try {
      const { data } = await axios.get(
        `https://e-commerce-host2.onrender.com/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setValues({ ...values, keyword: suggestion });
    saveRecentSearch(suggestion);
    setShowSuggestions(false);
    
    // Auto-search when suggestion is clicked
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const clearSearch = () => {
    setValues({ ...values, keyword: "" });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setValues({ ...values, keyword: value });
    setShowSuggestions(value.length >= 2);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (values.keyword.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const removeRecentSearch = (searchTerm, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== searchTerm);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div className="modern-search-container">
      <form className="modern-search-form" onSubmit={handleSubmit}>
        <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
          <FaSearch className="search-icon" />
          <input
            className="modern-search-input"
            type="search"
            placeholder="Search products..."
            aria-label="Search"
            value={values.keyword}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoComplete="off"
          />
          {values.keyword && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={clearSearch}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button className="modern-search-btn" type="submit">
          Search
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="search-suggestions">
          {/* Loading State */}
          {loading && (
            <div className="suggestion-item loading">
              <div className="loading-spinner"></div>
              <span>Searching...</span>
            </div>
          )}

          {/* Search Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className="suggestions-section">
              <div className="section-header">
                <FaSearch />
                <span>Search Suggestions</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item clickable"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FaSearch />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!loading && recentSearches.length > 0 && (
            <div className="suggestions-section">
              <div className="section-header">
                <FaClock />
                <span>Recent Searches</span>
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="suggestion-item clickable"
                  onClick={() => handleSuggestionClick(search)}
                >
                  <FaClock />
                  <span>{search}</span>
                  <button
                    className="remove-recent"
                    onClick={(e) => removeRecentSearch(search, e)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!loading && suggestions.length === 0 && (
            <div className="suggestions-section">
              <div className="section-header">
                <FaFire />
                <span>Popular Searches</span>
              </div>
              {popularSearches.map((search, index) => (
                <div
                  key={index}
                  className="suggestion-item clickable"
                  onClick={() => handleSuggestionClick(search)}
                >
                  <FaFire />
                  <span>{search}</span>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && values.keyword.length >= 2 && suggestions.length === 0 && (
            <div className="suggestion-item no-results">
              <span>No suggestions found for "{values.keyword}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;