import React from 'react';

const FoodCard = ({ item, onAdd, url }) => {
    return (
        <div className="go-food-card">
            <div className="card-image-wrapper">
                <img 
                    src={url + "/images/" + item.image} 
                    alt={item.name} 
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('fade-in')}
                />
                <span className="card-category">{item.category}</span>
            </div>
            <div className="card-details">
                <div className="card-header-flex">
                    <h3>{item.name}</h3>
                    <span className="card-rating">⭐ 4.5</span>
                </div>
                <p className="card-desc">{item.description.substring(0, 50)}...</p>
                <div className="card-footer">
                    <span className="card-price">₹{item.price}</span>
                    <button className="add-to-group-btn" onClick={() => onAdd(item)}>
                        Add to Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
