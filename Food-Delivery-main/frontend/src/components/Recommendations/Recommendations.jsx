import React, { useState, useEffect, useContext } from "react";
import "./Recommendations.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { url, token, addToCart } = useContext(StoreContext);

    useEffect(() => {
        if (token) {
            fetchRecommendations();
        }
    }, [token]);

    const fetchRecommendations = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                url + "/api/ai/recommend",
                {},
                { headers: { token } }
            );
            if (response.data.success && response.data.data.length > 0) {
                setRecommendations(response.data.data);
            }
        } catch {
            // Silently fail — section just won't show
        }
        setIsLoading(false);
    };

    if (!token || (!isLoading && recommendations.length === 0)) {
        return null;
    }

    return (
        <div className="recommendations-section">
            <div className="recommendations-header">
                <div className="recommendations-header-left">
                    <span className="recommendations-emoji">🍽️</span>
                    <div>
                        <h2>Recommended For You</h2>
                        <p>Personalized picks based on your taste</p>
                    </div>
                </div>
                <span className="recommendations-ai-badge">✨ AI Powered</span>
            </div>

            <div className="recommendations-track">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rec-card rec-skeleton">
                            <div className="rec-skeleton-img"></div>
                            <div className="rec-skeleton-text"></div>
                            <div className="rec-skeleton-text short"></div>
                        </div>
                    ))
                    : recommendations.map((item, index) => (
                        <div
                            key={item._id}
                            className="rec-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="rec-card-img-wrapper">
                                <img
                                    src={url + "/images/" + item.image}
                                    alt={item.name}
                                />
                                <button
                                    className="rec-card-add"
                                    onClick={() => addToCart(item._id)}
                                    title="Add to cart"
                                >
                                    +
                                </button>
                            </div>
                            <div className="rec-card-info">
                                <div className="rec-card-name-price">
                                    <h4>{item.name}</h4>
                                    <span className="rec-card-price">₹{item.price}</span>
                                </div>
                                <p className="rec-card-reason">✨ {item.aiReason}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Recommendations;
