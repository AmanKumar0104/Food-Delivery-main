import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import CustomizeModal from "../CustomizeModal/CustomizeModal";

const FoodItem = ({ id, name, price, description, image, rating }) => {
  const {cartItems,addToCart,removeFromCart,url}=useContext(StoreContext); 
  const navigate = useNavigate();
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <>
      <div className="food-item">
        <div className="food-item-img-container">
          <img 
            src={image?.startsWith("http") ? image : `${url}/images/${image}`} 
            alt={name} 
            className="food-item-image" 
            loading="lazy"
            onError={(e) => {
              const localIndex = (parseInt(id) - 1) % (assets.food_images?.length || 32);
              e.target.src = assets.food_images ? assets.food_images[localIndex] : "";
              e.target.onerror = null; 
            }}
          />
          {(!cartItems || !cartItems[id]) ? (
            <img
              className="add"
              onClick={() => addToCart(id)}
              src={assets.add_icon_white}
              alt=""
            />
          ) : (
            <div className="food-item-counter">
              <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
              <p>{cartItems[id]}</p>
              <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
            </div>
          )}
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <div className="food-item-rating">
              <span>⭐ {rating || "4.5"}</span>
            </div>
          </div>
          <p className="food-item-desc">{description}</p>
          <div className="food-item-price-row">
            <p className="food-item-price">₹{price}</p>
            <button className="customize-btn" onClick={() => setShowCustomize(true)}>
              Customize 
            </button>
          </div>
        </div>
      </div>
      {showCustomize && (
        <CustomizeModal 
          item={{id, name, price, description, image, _id: id}} 
          setShowCustomize={setShowCustomize} 
        />
      )}
    </>
  );
};

export default FoodItem;
