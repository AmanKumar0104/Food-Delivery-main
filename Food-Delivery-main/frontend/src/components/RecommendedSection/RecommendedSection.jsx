import React, { useContext } from 'react';
import './RecommendedSection.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import Badge from '../Badge/Badge';

const RecommendedSection = () => {
    const { food_list, timeCategory, timeTheme } = useContext(StoreContext);

    // Filter food list based on time category
    const recommendedItems = food_list.filter(item => 
        item.category.toLowerCase() === timeCategory.toLowerCase()
    ).slice(0, 4);

    if (recommendedItems.length === 0) return null;

    return (
        <section className={`recommended-section ${timeTheme}`}>
            <div className="rs-container">
                <div className="rs-header">
                    <div className="rs-title-group">
                        <h2 className="rs-title">Recommended for You <span className="rs-subtitle">(Based on Time)</span></h2>
                        <Badge 
                            text={timeCategory === 'Starters' ? '🌅 Morning Picks' : 
                                 timeCategory === 'Main Course' ? '🍛 Hearty Lunch' : 
                                 '🌜 Perfect Tonight'} 
                            className="static"
                        />
                    </div>
                </div>
                <div className="rs-grid">
                    {recommendedItems.map((item, index) => (
                        <div key={index} className="rs-card-wrapper">
                            <Badge text="Trending 🔥" type="orange" className="absolute" />
                            <FoodItem 
                                id={item._id} 
                                name={item.name} 
                                description={item.description} 
                                price={item.price} 
                                image={item.image} 
                                rating={item.rating}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecommendedSection;
