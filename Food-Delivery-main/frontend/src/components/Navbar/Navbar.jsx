import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { getTotalCartAmount, token, setToken, setShowLogin, searchQuery, setSearchQuery, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    setToken("");
    setCartItems({}); // Clear cart upon logout
    toast.success("Logged out successfully");
    navigate("/"); // Redirect to home page
    setShowLogin(true); // Open login popup immediately
  };

  const closeMenu = () => setMobileMenu(false);

  return (
    <div className="navbar">
      {/* Mobile overlay — tap outside drawer to close */}
      {mobileMenu && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.35)",
          }}
          onClick={closeMenu}
        />
      )}

      <div className="navbar-container">
        <Link to="/" onClick={() => { closeMenu(); window.scrollTo(0, 0); }}>
          <img src={assets.logo} alt="Tomato logo" className="logo" />
        </Link>

        {/* Nav links (desktop) / slide drawer (mobile) */}
        <ul className={`navbar-menu ${mobileMenu ? "mobile" : ""}`}>
          <Link
            to="/"
            onClick={() => { setMenu("home"); closeMenu(); window.scrollTo(0, 0); }}
            className={menu === "home" ? "active" : ""}
          >
            Home
          </Link>
          <Link
            to="/moody"
            onClick={() => { setMenu("recommendations"); closeMenu(); }}
            className={menu === "recommendations" ? "active" : ""}
          >
            Moody
          </Link>
          <Link
            to="/dining"
            onClick={() => { setMenu("dining"); closeMenu(); }}
            className={menu === "dining" ? "active" : ""}
          >
            Dining
          </Link>
          {/* New Group Order link for Mobile Drawer */}
          <Link
            to="/group-order"
            onClick={() => { setMenu("group-order"); closeMenu(); }}
            className={`navbar-group-link mobile-only ${menu === "group-order" ? "active" : ""}`}
          >
            Group Order
          </Link>
          <a
            href="#contact-us"
            onClick={() => { setMenu("contact-us"); closeMenu(); }}
            className={menu === "contact-us" ? "active" : ""}
          >
            Contact Us
          </a>
          <a
            href="#explore-menu"
            onClick={() => { setMenu("menu"); closeMenu(); }}
            className={menu === "menu" ? "active" : ""}
          >
            Menu
          </a>
        </ul>

        {/* Right side icons */}
        <div className="navbar-right">
          
          {/* Group Order Button (Desktop) */}
          <div 
            onClick={() => { setMenu("group-order"); navigate("/group-order"); }}
            className={`navbar-group-order-btn desktop-only ${menu === "group-order" ? "active-btn" : ""}`}
            style={{cursor: 'pointer'}}
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
             <span>Group Order</span>
          </div>

          <div className={`navbar-search-container ${showSearchBar ? "active" : ""}`}>
            <img 
              src={assets.search_icon} 
              alt="Search" 
              className="search-icon" 
              onClick={() => setShowSearchBar(!showSearchBar)}
            />
            {showSearchBar && (
              <input 
                type="text" 
                placeholder="Search food items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            )}
          </div>

          <div className="navbar-search-icon">
            <Link to="/cart" aria-label="Cart">
              <img src={assets.basket_icon} alt="Cart" />
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>

          {!token ? (
            <button className="navbar-signin-btn" onClick={() => setShowLogin(true)}>
              Sign In
            </button>
          ) : (
            <div className={`navbar-profile ${showProfile ? "active" : ""}`} onClick={() => setShowProfile(!showProfile)}>
              <img src={assets.profile_icon} alt="Profile" />
              <ul className={`nav-profile-dropdown ${showProfile ? "show" : ""}`}>
                <li onClick={() => { navigate("/myorders"); setShowProfile(false); }}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={() => { logout(); setShowProfile(false); }}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}

          {/* Hamburger — CSS shows this only on mobile */}
          <div
            className="navbar-hamburger"
            onClick={() => setMobileMenu(!mobileMenu)}
            role="button"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {mobileMenu ? (
                <path d="M18 6L6 18M6 6L18 18" stroke="#ff4c24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#ff4c24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
