import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, rating }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Support both URL-based images and local uploaded images
  const imgSrc = image && image.startsWith("http") ? image : url + "/images/" + image;

  // Render star ratings
  const renderStars = (r) => {
    const stars = [];
    const full = Math.floor(r || 4);
    const hasHalf = (r || 4) - full >= 0.3;
    for (let i = 0; i < full; i++) stars.push("★");
    if (hasHalf) stars.push("½");
    return stars.join("");
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          src={imgSrc}
          alt={name}
          className="food-item-image"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"; }}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <span className="food-item-stars" title={`${rating || 4} / 5`}>{renderStars(rating)} <small>{rating || "4.0"}</small></span>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
