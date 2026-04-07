import React, { useState, useContext, useEffect, useMemo } from 'react';
import './Dining.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel';
import SmartMealPlanner from '../../components/SmartMealPlanner/SmartMealPlanner';
import { toast } from 'react-toastify';

const Dining = () => {
    const { food_list, url } = useContext(StoreContext);
    const [filter, setFilter] = useState('All');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [menuView, setMenuView] = useState(null);
    const [guests, setGuests] = useState(2);
    const [diningType, setDiningType] = useState('Couple 💑');
    const [tableType, setTableType] = useState('Standard');

    const diningSlides = [
        {
            title: "Discover Exceptional Dining",
            subtitle: "Reserved for the finest moments. Select your dining style and book your preferred table instantly.",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600",
            btnText: "Book Now",
            btnAction: () => document.querySelector('.dining-sections')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            title: "Premium Table Reservations",
            subtitle: "Skip the queue and enjoy a seamless dining experience with our instant table booking system.",
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1600",
            btnText: "Reserve Table",
            btnAction: () => document.querySelector('.dining-sections')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            title: "Taste of Authenticity",
            subtitle: "From Royal Rajasthan to Coastal Curry, explore a world of flavors at our handpicked restaurants.",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1600",
            btnText: "View Restaurants",
            btnAction: () => document.querySelector('.dining-sections')?.scrollIntoView({ behavior: 'smooth' })
        }
    ];

    const [restaurants, setRestaurants] = useState([
        { id: 1, name: "Spice Village", rating: 4.8, distance: "1.2 km", cuisine: "North Indian, Punjabi", price: "₹800", type: "Family", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", availability: "available", waitTime: "5 mins", bestTime: "3 PM", crowd: "Low" },
        { id: 2, name: "The Tandoor Room", rating: 4.5, distance: "2.5 km", cuisine: "Tandoori, Mughlai", price: "₹1200", type: "Family", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800", availability: "limited", waitTime: "25 mins", bestTime: "4 PM", crowd: "Medium" },
        { id: 3, name: "Coastal Curry", rating: 4.6, distance: "0.8 km", cuisine: "Seafood, South Indian", price: "₹1500", type: "Couple", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800", availability: "available", waitTime: "0 mins", bestTime: "2 PM", crowd: "Low" },
        { id: 4, name: "Urban Tadka", rating: 4.2, distance: "3.1 km", cuisine: "Fusion, Asian", price: "₹1000", type: "Bachelor", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800", availability: "full", waitTime: "45 mins", bestTime: "10 PM", crowd: "High" },
        { id: 5, name: "Royal Rajasthan", rating: 4.9, distance: "4.5 km", cuisine: "Rajasthani, Marwari", price: "₹2000", type: "Family", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800", availability: "limited", waitTime: "15 mins", bestTime: "1 PM", crowd: "Medium" },
        { id: 6, name: "The Green Bowl", rating: 4.4, distance: "1.5 km", cuisine: "Healthy, Salads", price: "₹600", type: "Couple", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800", availability: "available", waitTime: "5 mins", bestTime: "5 PM", crowd: "Low" },
    ]);

    const diningTypes = ["All", "Couple", "Family", "Bachelor"];
    const bookingTypes = ["Couple 💑", "Family 👨‍👩‍👧‍👦", "Friends 👥", "Business 💼", "Bachelor 👤"];
    const tableTypes = ["Standard", "Window View 🪟", "Rooftop 🌃", "Private Cabin 扉", "Outdoor 🌳"];

    const getCrowdColor = (crowd) => {
        if (crowd === 'Low') return '#10b981';
        if (crowd === 'Medium') return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className='dining-container'>
            <BannerCarousel slides={diningSlides} />

            <div className='dining-main-layout'>
                <div className='dining-left-content'>
                    <div className='dining-types-nav'>
                        {diningTypes.map(t => (
                            <button key={t} className={filter === t ? 'active' : ''} onClick={() => setFilter(t)}>{t} Special</button>
                        ))}
                    </div>

                    <div className='dining-sections'>
                        {diningTypes.filter(t => t !== "All").map(type => {
                            const sectionRestos = restaurants.filter(r => r.type === type);
                            if (filter !== 'All' && filter !== type) return null;
                            
                            return (
                                <div key={type} className='dining-section'>
                                    <h2>{type} <span>Dining</span></h2>
                                    <div className='dining-grid'>
                                        {sectionRestos.map((restaurant) => (
                                            <div key={restaurant.id} className='restaurant-card modern'>
                                                <div className='card-image'>
                                                    <img src={restaurant.image} alt={restaurant.name} />
                                                    <div className='rating-badge'>⭐ {restaurant.rating}</div>
                                                    <span className='type-tag'>{restaurant.type}</span>
                                                    <div className={`status-pill ${restaurant.availability}`}>
                                                        {restaurant.availability.charAt(0).toUpperCase() + restaurant.availability.slice(1)}
                                                    </div>
                                                </div>
                                                <div className='card-info'>
                                                    <div className='info-top'>
                                                        <h3>{restaurant.name}</h3>
                                                        <p className='distance'>{restaurant.distance}</p>
                                                    </div>
                                                    <p className='cuisine'>{restaurant.cuisine}</p>
                                                    
                                                    <div className='smart-insights'>
                                                        <div className='insight-item'>
                                                            <span className='insight-label'>Wait Time:</span>
                                                            <span className='insight-value'>{restaurant.waitTime}</span>
                                                        </div>
                                                        <div className='best-time-badge'>
                                                            ⭐ Peak: {restaurant.bestTime} (Free)
                                                        </div>
                                                    </div>

                                                    <div className='card-actions'>
                                                        <button className='book-table-btn' onClick={() => setBookingDetails(restaurant)}>Book Table</button>
                                                        <button className='view-menu-btn' onClick={() => setMenuView(restaurant)}>View Menu</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='dining-right-sidebar'>
                    <SmartMealPlanner />
                    <div className="planner-ad-card">
                        <h4>🎁 Monthly Subscription</h4>
                        <p>Get daily meal plans and <strong>20% OFF</strong> on all orders.</p>
                        <button className="upgrade-btn">Join Platinum</button>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {bookingDetails && (
                <div className='dining-modal-overlay' onClick={() => setBookingDetails(null)}>
                    <div className='dining-modal' onClick={(e) => e.stopPropagation()}>
                        <button className='close-btn' onClick={() => setBookingDetails(null)}>×</button>
                        <div className="booking-header">
                            <h2>Reserve Your <span>Special Table</span></h2>
                            <p>Booking at <strong>{bookingDetails.name}</strong> • AI Active</p>
                        </div>
                        <div className='booking-form-v3' style={{padding: '20px'}}>
                            <div className='form-group'>
                                <label>👥 Party Size: <strong>{guests} guests</strong></label>
                                <input type="range" min="1" max="20" value={guests} onChange={(e) => setGuests(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label>🏢 Table Preference</label>
                                <div className='type-selector'>
                                    {tableTypes.map(t => (
                                        <div key={t} className={`type-chip ${tableType === t ? 'active' : ''}`} onClick={() => setTableType(t)}>
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className='confirm-booking-btn' style={{width: '100%', marginTop: '20px'}} onClick={() => {
                                toast.success(`Reserved ${tableType} for ${guests} at ${bookingDetails.name}!`);
                                setBookingDetails(null);
                            }}>Confirm Reservation Now</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Modal */}
            {menuView && (
                <div className='dining-modal-overlay' onClick={() => setMenuView(null)}>
                    <div className='menu-modal' style={{background: 'var(--card-bg)', borderRadius: '32px', overflow: 'hidden', maxWidth: '600px', width: '90%', position: 'relative'}} onClick={(e) => e.stopPropagation()}>
                        <button className='close-btn' onClick={() => setMenuView(null)}>×</button>
                        <div className='menu-header' style={{height: '180px', position: 'relative'}}>
                            <img src={menuView.image} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            <div style={{position: 'absolute', bottom: 0, left: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', width: '100%', color: 'white'}}>
                                <h3>{menuView.name} Menu</h3>
                            </div>
                        </div>
                        <div style={{padding: '20px', maxHeight: '400px', overflowY: 'auto'}}>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                                {food_list.slice(0, 10).map((item, index) => (
                                    <div key={index} style={{display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '12px'}}>
                                        <img src={url + "/images/" + item.image} alt="" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px'}} />
                                        <div>
                                            <p style={{fontSize: '0.8rem', fontWeight: 600}}>{item.name}</p>
                                            <span style={{fontSize: '0.75rem', color: 'var(--brand-color)'}}>₹{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dining;
