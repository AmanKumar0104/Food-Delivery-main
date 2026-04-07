import React, { useContext, useState } from "react";
import "./CustomizeModal.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const CustomizeModal = ({ item, setShowCustomize }) => {
  const { url, addToCart } = useContext(StoreContext);
  const [customs, setCustoms] = useState({
    spice: "Medium",
    servings: "1 Person",
    toppings: [],
  });

  const spiceLevels = ["Mild", "Medium", "Extra Spicy"];
  const portions = ["1 Person", "2 People", "Family Pack"];
  const availableToppings = [
    "Extra Cheese",
    "Onions",
    "Garlic Butter",
    "Fresh Herbs",
  ];

  // Helper to get image source with fallback support
  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000";
    if (image.startsWith("http")) return image;
    return `${url}/images/${image}`;
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000";
  };

  const toggleTopping = (topping) => {
    if (customs.toppings.includes(topping)) {
      setCustoms((prev) => ({
        ...prev,
        toppings: prev.toppings.filter((t) => t !== topping),
      }));
    } else {
      setCustoms((prev) => ({
        ...prev,
        toppings: [...prev.toppings, topping],
      }));
    }
  };

  const handleAddToCart = (itemId) => {
    addToCart(itemId);
    toast.success(`"${item.name}" customized and added! 🥘`);
    setShowCustomize(false);
  };

  return (
    <div className="customize-modal-overlay" onClick={() => setShowCustomize(false)}>
      <div className="customize-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowCustomize(false)}>×</button>
        
        {/* Modern Image Header */}
        <div className="modal-header">
          <img 
            src={getImageUrl(item.image)} 
            alt={item.name} 
            onError={handleImageError}
            className="header-main-img"
          />
          <div className="header-overlay-content">
            <div className="badge-category">{item.category}</div>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </div>
        </div>

        <div className="modal-body">
          <div className="customize-section">
            <div className="section-title-flex">
              <h4>🌶️ Spice Level</h4>
              <span className="selected-value">{customs.spice}</span>
            </div>
            <div className="option-group">
              {spiceLevels.map((s) => (
                <button
                  key={s}
                  className={`pill-btn ${customs.spice === s ? "active" : ""}`}
                  onClick={() => setCustoms((prev) => ({ ...prev, spice: s }))}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="customize-section">
            <div className="section-title-flex">
              <h4>🍽️ Portion Size</h4>
              <span className="selected-value">{customs.servings}</span>
            </div>
            <div className="option-group">
              {portions.map((p) => (
                <button
                  key={p}
                  className={`pill-btn ${customs.servings === p ? "active" : ""}`}
                  onClick={() => setCustoms((prev) => ({ ...prev, servings: p }))}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="customize-section">
            <div className="section-title-flex">
              <h4>🥗 Add Toppings</h4>
              <span className="selected-value">{customs.toppings.length} selected</span>
            </div>
            <div className="topping-grid">
              {availableToppings.map((t) => (
                <div
                  key={t}
                  className={`topping-card ${
                    customs.toppings.includes(t) ? "selected" : ""
                  }`}
                  onClick={() => toggleTopping(t)}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="customize-footer">
            <div className="total-display">
               <span className="label">Total Price</span>
               <span className="price-val">₹{item.price}</span>
            </div>
            <button
              className="add-to-cart-cta"
              onClick={() => handleAddToCart(item._id || item.id)}
            >
              Add to Group Cart 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;
