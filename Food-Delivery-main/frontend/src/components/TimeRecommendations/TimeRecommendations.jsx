import React, { useContext } from 'react';
import './TimeRecommendations.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const TimeRecommendations = () => {
    const { food_list, timeCategory, timeTheme } = useContext(StoreContext);

    // Filter food list based on time category
    // Using simple substring match for the demo (Breakfast, Lunch categories)
    const recommendedItems = food_list.filter(item => 
        item.category.toLowerCase() === timeCategory.toLowerCase()
    ).slice(0, 4);

    if (recommendedItems.length === 0) return null;

    return (
        <div className={`time-recommendations ${timeTheme}`}>
            <div className="tr-header">
                <h2>Recommended for You <span>(Based on Time)</span></h2>
                <div className="tr-tag">
                    {timeCategory === 'Breakfast' ? '🌅 Fresh Morning Picks' : 
                     timeCategory === 'Pure Veg' ? '🍴 Hearty Lunch' : 
                     '🌙 Perfect Tonight'}
                </div>
            </div>
            <div className="tr-list">
                {recommendedItems.map((item, index) => (
                    <FoodItem 
                        key={index} 
                        id={item._id} 
                        name={item.name} 
                        description={item.description} 
                        price={item.price} 
                        image={item.image} 
                    />
                ))}
            </div>
            <hr />
        </div>
    );
};

export default TimeRecommendations;
