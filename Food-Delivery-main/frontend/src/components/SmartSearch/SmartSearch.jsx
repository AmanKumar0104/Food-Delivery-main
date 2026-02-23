import React, { useState, useRef, useEffect, useContext } from "react";
import "./SmartSearch.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const SmartSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);
    const { url, addToCart } = useContext(StoreContext);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
        if (!isOpen) {
            setQuery("");
            setResults([]);
            setHasSearched(false);
        }
    }, [isOpen]);

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        try {
            const response = await axios.post(url + "/api/ai/search", {
                query: searchQuery,
            });
            if (response.data.success) {
                setResults(response.data.data);
            } else {
                setResults([]);
            }
        } catch {
            setResults([]);
        }
        setIsSearching(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        // Debounce search
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            performSearch(value);
        }, 600);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Enter") {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            performSearch(query);
        }
    };

    const handleAddToCart = (id) => {
        addToCart(id);
    };

    if (!isOpen) return null;

    return (
        <div className="smart-search-overlay" onClick={onClose}>
            <div className="smart-search-container" onClick={(e) => e.stopPropagation()}>
                <div className="smart-search-header">
                    <div className="smart-search-input-wrapper">
                        <svg className="smart-search-icon" viewBox="0 0 24 24" width="22" height="22">
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                                fill="currentColor"
                            />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder='Try "something spicy" or "best dessert under ₹500"'
                        />
                        {query && (
                            <button
                                className="smart-search-clear"
                                onClick={() => {
                                    setQuery("");
                                    setResults([]);
                                    setHasSearched(false);
                                    inputRef.current?.focus();
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button className="smart-search-close" onClick={onClose}>
                        ESC
                    </button>
                </div>

                <div className="smart-search-badge">
                    <span>✨ AI-Powered Search</span>
                    <span>Understands natural language</span>
                </div>

                <div className="smart-search-results">
                    {isSearching && (
                        <div className="smart-search-loading">
                            <div className="smart-search-spinner"></div>
                            <p>AI is finding the perfect matches...</p>
                        </div>
                    )}

                    {!isSearching && hasSearched && results.length === 0 && (
                        <div className="smart-search-empty">
                            <span>🔍</span>
                            <p>No matches found. Try a different query!</p>
                        </div>
                    )}

                    {!isSearching &&
                        results.map((item, index) => (
                            <div
                                key={item._id}
                                className="smart-search-result-card"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <img
                                    src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image}
                                    alt={item.name}
                                    className="search-result-img"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"; }}
                                />
                                <div className="search-result-info">
                                    <div className="search-result-header">
                                        <h4>{item.name}</h4>
                                        <span className="search-result-price">₹{item.price}</span>
                                    </div>
                                    <p className="search-result-desc">{item.description}</p>
                                    <span className="search-result-ai-tag">✨ {item.aiReason}</span>
                                </div>
                                <button
                                    className="search-result-add"
                                    onClick={() => handleAddToCart(item._id)}
                                    title="Add to cart"
                                >
                                    +
                                </button>
                            </div>
                        ))}
                </div>

                {!hasSearched && !isSearching && (
                    <div className="smart-search-suggestions">
                        <p>💡 Try searching for:</p>
                        <div className="smart-search-suggestion-chips">
                            {["Spicy food", "Healthy salads", "Cheap eats", "Best desserts", "Quick snacks"].map(
                                (s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setQuery(s);
                                            performSearch(s);
                                        }}
                                    >
                                        {s}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartSearch;
