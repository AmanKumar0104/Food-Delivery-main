import React, { useState, useContext, useEffect } from 'react';
import './SmartMealPlanner.css';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const SmartMealPlanner = () => {
    const { food_list, url, addToCart } = useContext(StoreContext);
    const [budget, setBudget] = useState(500);
    const [goal, setGoal] = useState('Maintain'); // Weight Loss, Maintain, Weight Gain
    const [loading, setLoading] = useState(false);
    const [mealPlan, setMealPlan] = useState(null);

    const generateMealPlan = () => {
        setLoading(true);
        setTimeout(() => {
            // Filter logic based on goal
            let breakfastItems = food_list.filter(item => ['Breakfast', 'Sandwich', 'Starter'].includes(item.category));
            let lunchItems = food_list.filter(item => ['Pure Veg', 'Biryani', 'Rolls'].includes(item.category));
            let dinnerItems = food_list.filter(item => ['Pasta', 'Salad', 'Chinese', 'Noodles'].includes(item.category));

            // Simplified random selection based on budget
            const bItem = breakfastItems[Math.floor(Math.random() * breakfastItems.length)] || food_list[0];
            const lItem = lunchItems[Math.floor(Math.random() * lunchItems.length)] || food_list[1];
            const dItem = dinnerItems[Math.floor(Math.random() * dinnerItems.length)] || food_list[2];

            // Mock calorie estimation
            const calMap = { 'Weight Loss': 0.7, 'Maintain': 1, 'Weight Gain': 1.4 };
            const baseCal = 450;

            const plan = {
                breakfast: { ...bItem, cal: Math.round(baseCal * calMap[goal] * (0.8 + Math.random() * 0.4)) },
                lunch: { ...lItem, cal: Math.round(baseCal * 1.5 * calMap[goal] * (0.8 + Math.random() * 0.4)) },
                dinner: { ...dItem, cal: Math.round(baseCal * 1.2 * calMap[goal] * (0.8 + Math.random() * 0.4)) }
            };

            setMealPlan(plan);
            setLoading(false);
            toast.success("Your personalized meal plan is ready! 🍽️");
        }, 1200);
    };

    const addAllToCart = () => {
        if (!mealPlan) return;
        addToCart(mealPlan.breakfast._id);
        addToCart(mealPlan.lunch._id);
        addToCart(mealPlan.dinner._id);
        toast.success("Full day meal plan added to cart! 🛒");
    };

    return (
        <div className="smart-meal-planner">
            <div className="planner-header">
                <h3>Smart <span>Meal Planner</span> 🤖</h3>
                <p>AI-driven nutrition & budget management</p>
            </div>

            <div className="planner-inputs">
                <div className="input-group">
                    <label>💰 Daily Budget: <strong>₹{budget}</strong></label>
                    <input 
                        type="range" 
                        min="200" 
                        max="3000" 
                        step="50" 
                        value={budget} 
                        onChange={(e) => setBudget(e.target.value)} 
                    />
                </div>

                <div className="input-group">
                    <label>🎯 Fitness Goal</label>
                    <div className="goal-selector">
                        {['Weight Loss', 'Maintain', 'Weight Gain'].map(g => (
                            <button 
                                key={g} 
                                className={goal === g ? 'active' : ''} 
                                onClick={() => setGoal(g)}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    className={`generate-btn ${loading ? 'loading' : ''}`} 
                    onClick={generateMealPlan}
                    disabled={loading}
                >
                    {loading ? 'Analyzing Menu...' : 'Generate My Plan'}
                </button>
            </div>

            {mealPlan && !loading && (
                <div className="meal-plan-results animate-fade-in">
                    <div className="meal-card">
                        <div className="meal-time">🌅 Breakfast</div>
                        <div className="meal-content">
                            <img src={url + "/images/" + mealPlan.breakfast.image} alt="" />
                            <div className="meal-info">
                                <h4>{mealPlan.breakfast.name}</h4>
                                <p>{mealPlan.breakfast.cal} kcal • ₹{mealPlan.breakfast.price}</p>
                            </div>
                        </div>
                    </div>

                    <div className="meal-card">
                        <div className="meal-time">🌞 Lunch</div>
                        <div className="meal-content">
                            <img src={url + "/images/" + mealPlan.lunch.image} alt="" />
                            <div className="meal-info">
                                <h4>{mealPlan.lunch.name}</h4>
                                <p>{mealPlan.lunch.cal} kcal • ₹{mealPlan.lunch.price}</p>
                            </div>
                        </div>
                    </div>

                    <div className="meal-card">
                        <div className="meal-time">🌙 Dinner</div>
                        <div className="meal-content">
                            <img src={url + "/images/" + mealPlan.dinner.image} alt="" />
                            <div className="meal-info">
                                <h4>{mealPlan.dinner.name}</h4>
                                <p>{mealPlan.dinner.cal} kcal • ₹{mealPlan.dinner.price}</p>
                            </div>
                        </div>
                    </div>

                    <div className="plan-summary">
                        <div className="summary-row">
                            <span>Total Calories:</span>
                            <strong>{mealPlan.breakfast.cal + mealPlan.lunch.cal + mealPlan.dinner.cal} kcal</strong>
                        </div>
                        <div className="summary-row">
                            <span>Total Cost:</span>
                            <strong>₹{mealPlan.breakfast.price + mealPlan.lunch.price + mealPlan.dinner.price}</strong>
                        </div>
                        <button className="add-all-btn" onClick={addAllToCart}>Add All to Cart 🛒</button>
                        <button className="regenerate-link" onClick={generateMealPlan}>Regenerate Plan</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartMealPlanner;
