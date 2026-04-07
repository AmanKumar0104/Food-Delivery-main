import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery, loading } = useContext(StoreContext);

  const filteredList = (food_list || []).filter((item) => {
    if (!item) return false;
    
    const matchesCategory = category === "All" || category === item.category;
    
    const name = item.name || "";
    const description = item.description || "";
    const query = searchQuery || "";
    
    const matchesSearch = name.toLowerCase().includes(query.toLowerCase()) || 
                         description.toLowerCase().includes(query.toLowerCase());
                         
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="food-display-loading">
        <div className="loader"></div>
        <p>Loading the best dishes for you...</p>
      </div>
    );
  }

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>{searchQuery ? `Searching for "${searchQuery}"` : "Top dishes near you"}</h2>
        {filteredList.length > 0 && <p className="results-count">{filteredList.length} items found</p>}
      </div>
      <div className="food-display-list">
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              rating={item.rating}
            />
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No food items match your search</h3>
            <p>Try adjusting your search query or exploring other categories.</p>
            {searchQuery && <button onClick={() => window.location.reload()} className="clear-search-btn">Clear Search</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
