import React, { useRef } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({category, setCategory}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-header">
        <div className="explore-menu-header-left">
          <h1>Explore our menu</h1>
          <p className="explore-menu-text">
            Choose from a diverse menu featuring a detectable array of dishes. Our
            mission is to satisfy your cravings and elevate your dining experience,
            one delicious meal at a time.
          </p>
        </div>
        <div className="explore-menu-btns">
            <button onClick={() => scroll('left')} className="scroll-btn prev">❮</button>
            <button onClick={() => scroll('right')} className="scroll-btn next">❯</button>
        </div>
      </div>
      
      <div className="explore-menu-list-wrapper">
        <div className="explore-menu-list" ref={scrollRef}>
          {menu_list.map((item, index) => {
            return (
              <div 
                onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
                key={index} 
                className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
              >
                <img src={item.menu_image} alt={item.menu_name} />
                <p>{item.menu_name}</p>
              </div>
            );
          })}
        </div>
      </div>
      <hr/>
    </div>
  );
};

export default ExploreMenu;
