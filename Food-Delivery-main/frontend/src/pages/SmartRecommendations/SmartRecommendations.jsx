import React, { useContext, useState, useEffect, useMemo } from 'react';
import './SmartRecommendations.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/frontend_assets/assets';
import { toast } from 'react-toastify';

const SmartRecommendations = () => {
    const { food_list, addToCart, url } = useContext(StoreContext);
    
    const [selectedMood, setSelectedMood] = useState(localStorage.getItem('sr_mood') || null);
    const [moodText, setMoodText] = useState("");
    const [healthFilters, setHealthFilters] = useState(JSON.parse(localStorage.getItem('sr_health')) || []);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);

    const moods = [
        { id: 'happy', label: 'Happy', icon: '😄' },
        { id: 'sad', label: 'Sad', icon: '😢' },
        { id: 'stressed', label: 'Stressed', icon: '😫' },
        { id: 'tired', label: 'Tired', icon: '😴' },
        { id: 'energetic', label: 'Energetic', icon: '⚡' },
    ];

    const healthChips = [
        { id: 'veg', label: 'Pure Veg', color: '#10b981' },
        { id: 'high-protein', label: 'High Protein', color: '#3b82f6' },
        { id: 'low-calorie', label: 'Low Calorie', color: '#f59e0b' },
        { id: 'gluten-free', label: 'Gluten Free', color: '#8b5cf6' },
        { id: 'vegan', label: 'Vegan', color: '#06b6d4' },
        { id: 'diabetic', label: 'Diabetic Friendly', color: '#ef4444' }
    ];

    // Helper to generate random persistent rating based on item ID
    const getRating = (id) => {
        const lastDigit = id.slice(-1).charCodeAt(0);
        return (4.3 + (lastDigit % 7) / 10).toFixed(1);
    };

    const detectMoodFromText = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes("tire") || lower.includes("exhaust") || lower.includes("sleep") || lower.includes("lazy")) return "tired";
        if (lower.includes("sad") || lower.includes("bad") || lower.includes("unhappy") || lower.includes("cry")) return "sad";
        if (lower.includes("stress") || lower.includes("work") || lower.includes("anxious") || lower.includes("pressure")) return "stressed";
        if (lower.includes("happy") || lower.includes("good") || lower.includes("great") || lower.includes("party") || lower.includes("celebrate")) return "happy";
        if (lower.includes("energetic") || lower.includes("gym") || lower.includes("fit") || lower.includes("ready") || lower.includes("active")) return "energetic";
        return null;
    };

    const toggleHealthFilter = (id) => {
        setHealthFilters(prev => 
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    // Sync preferences
    useEffect(() => {
        if (selectedMood) localStorage.setItem('sr_mood', selectedMood);
        else localStorage.removeItem('sr_mood');
    }, [selectedMood]);

    useEffect(() => {
        localStorage.setItem('sr_health', JSON.stringify(healthFilters));
    }, [healthFilters]);

    // Recommendation logic with simulated delay for modern feel
    useEffect(() => {
        const updateRecs = () => {
            let filtered = [...food_list];

            let effectiveMood = selectedMood;
            if (moodText.trim()) {
                const detected = detectMoodFromText(moodText);
                if (detected) effectiveMood = detected;
            }

            if (effectiveMood) {
                filtered = filtered.filter(item => {
                    const desc = item.description.toLowerCase();
                    const name = item.name.toLowerCase();
                    const cat = item.category.toLowerCase();
                    switch (effectiveMood) {
                        case 'stressed': return cat === 'main course' || cat === 'pasta' || cat === 'biryani & rice' || desc.includes("creamy") || name.includes("dal");
                        case 'energetic': return cat === 'main course' || desc.includes("protein") || name.includes("chicken") || name.includes("paneer") || cat === 'rolls';
                        case 'sad': return cat === 'desserts' || cat === 'cake' || desc.includes("sweet") || name.includes("gulab");
                        case 'happy': return cat === 'street food' || cat === 'starters' || cat === 'sandwich' || cat === 'rolls';
                        case 'tired': return cat === 'beverages' || cat === 'street food' || name.includes("chai") || name.includes("coffee");
                        default: return true;
                    }
                });
            }

            healthFilters.forEach(filter => {
                filtered = filtered.filter(item => {
                    const desc = item.description.toLowerCase();
                    const name = item.name.toLowerCase();
                    const cat = item.category.toLowerCase();
                    switch (filter) {
                        case 'veg': return !name.includes("chicken") && !name.includes("mutton") && !name.includes("egg") && !name.includes("fish") && !name.includes("prawn");
                        case 'high-protein': return name.includes("chicken") || name.includes("paneer") || name.includes("mutton") || name.includes("egg") || name.includes("soya");
                        case 'low-calorie': return cat === 'salads' || desc.includes("healthy") || desc.includes("steamed") || name.includes("fruit");
                        case 'gluten-free': return cat !== 'bread' && cat !== 'pasta' && !name.includes("roll");
                        case 'vegan': 
                            const nonVegan = ["chicken", "mutton", "egg", "fish", "prawn", "paneer", "cheese", "butter", "milk", "ghee", "malai", "curd"];
                            return !nonVegan.some(nv => name.includes(nv) || desc.includes(nv));
                        case 'diabetic': return cat !== 'desserts' && cat !== 'cake' && !desc.includes("sweet");
                        default: return true;
                    }
                });
            });

            setRecommendations(filtered.slice(0, 12));
            setIsLoading(false);
        };

        setIsLoading(true);
        const timer = setTimeout(updateRecs, 800); // UI Polish: 800ms delay to see skeletons
        return () => clearTimeout(timer);
    }, [selectedMood, moodText, healthFilters, food_list]);

    const displayMood = useMemo(() => {
        if (moodText.trim()) return detectMoodFromText(moodText) || "neutral";
        return selectedMood || "your";
    }, [selectedMood, moodText]);

    return (
        <div className="smart-recommendations">
            <div className="sr-header">
                <span className="dynamic-badge">Moody</span>
                <h1>Perfectly Curated for <span>{displayMood.charAt(0).toUpperCase() + displayMood.slice(1)}</span> Mood</h1>
                <p>Advanced cross-matching of your emotional state and health goals to find the ultimate dish for you.</p>
            </div>

            <div className="sr-config-wrapper">
                <div className="sr-mood-section">
                    <h3 className="sr-section-title">✨ How are you feeling today?</h3>
                    <div className="chip-container">
                        {moods.map((m) => (
                            <button 
                                key={m.id} 
                                className={`toggle-chip ${selectedMood === m.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedMood(m.id);
                                    setMoodText("");
                                }}
                            >
                                {m.icon} {m.label}
                            </button>
                        ))}
                    </div>
                    <div className="sr-input-group">
                        <input 
                            type="text" 
                            placeholder="Type something: 'Hard day at work' or 'Full of energy!'" 
                            className="sr-advanced-input"
                            value={moodText}
                            onChange={(e) => {
                                setMoodText(e.target.value);
                                setSelectedMood(null);
                            }}
                        />
                    </div>
                </div>

                <div className="sr-health-section">
                    <h3 className="sr-section-title">🥗 Health Priorities</h3>
                    <div className="chip-container">
                        {healthChips.map((chip) => (
                            <button 
                                key={chip.id} 
                                className={`toggle-chip ${healthFilters.includes(chip.id) ? 'active' : ''}`}
                                onClick={() => toggleHealthFilter(chip.id)}
                                style={healthFilters.includes(chip.id) ? {} : {borderColor: chip.color + '44'}}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sr-results-grid">
                {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="sr-skeleton card-skeleton"></div>
                    ))
                ) : recommendations.length > 0 ? (
                    recommendations.map((item) => (
                        <div key={item._id} className="food-card-sr">
                            <div className="card-img-wrapper">
                                <img 
                                    src={item.image?.startsWith("http") ? item.image : `${url}/images/${item.image}`} 
                                    alt={item.name} 
                                    loading="lazy"
                                    onError={(e) => { 
                                        e.target.src = "https://via.placeholder.com/200x150/1a1d27/ff5722?text=No+Image";
                                        e.target.onerror = null; 
                                    }} 
                                />
                                <span className="badge-float">{item.category}</span>
                                <div className="rating-badge">
                                    ★ {getRating(item._id)}
                                </div>
                            </div>
                            <div className="card-content-sr">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="card-footer-sr">
                                    <span className="sr-price"><small>₹</small>{item.price}</span>
                                    <button 
                                        className="sr-add-circle"
                                        onClick={() => {
                                            addToCart(item._id);
                                            toast.success(`${item.name} added!`, { theme: "colored" });
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="sr-no-results-advanced">
                        <img src={assets.parcel_icon} alt="Empty" />
                        <h2>No matches found for this mix!</h2>
                        <p>Try easing up on health filters or exploring a different mood.</p>
                        <button 
                            className="sr-add-circle" 
                            style={{marginTop: '30px'}}
                            onClick={() => {setSelectedMood(null); setHealthFilters([]); setMoodText("");}}
                        >
                            Reset Preferences
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartRecommendations;
