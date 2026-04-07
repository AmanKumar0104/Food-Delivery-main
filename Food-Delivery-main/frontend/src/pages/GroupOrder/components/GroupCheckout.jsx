import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const GroupCheckout = ({ groupData, url, userId, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipcode: "", country: "", phone: ""
    });

    const subtotal = groupData.items.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    // Group items by user for the breakdown
    const userBreakdown = groupData.members.map(member => {
        const userItems = groupData.items.filter(item => item.addedByUserId === member.userId);
        const userTotal = userItems.reduce((sum, item) => sum + item.price, 0);
        return { ...member, items: userItems, total: userTotal };
    }).filter(u => u.total > 0);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAddress(data => ({ ...data, [name]: value }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        
        if (Object.values(address).some(v => v === "")) {
            toast.warn("Please fill in all delivery details 🏠");
            return;
        }

        setLoading(true);
        try {
            // Standardizing items for the main order model
            const orderItems = groupData.items.map(item => ({
                name: `${item.name} (${item.addedBy})`,
                price: item.price,
                quantity: 1, // Currently items are added individually
                image: item.image
            }));

            const response = await axios.post(`${url}/api/order/place`, {
                userId,
                items: orderItems,
                amount: total,
                address: address,
                isGroupOrder: true,
                groupId: groupData._id
            });

            if (response.data.success) {
                const { session_url } = response.data;
                // Before redirecting, we would ideally mark the group session as completed
                // But for now, we follow the standard Stripe flow
                window.location.replace(session_url);
            } else {
                toast.error("Error placing order");
            }
        } catch (error) {
            toast.error("Checkout failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group-checkout-container animate-slide-in">
            <div className="checkout-header">
                <button className="back-btn" onClick={onBack}>← Back to Group Menu</button>
                <h2>Ready to checkout 🚀</h2>
                <p>Host: {groupData.adminName} | Session ID: {groupData._id.substring(groupData._id.length - 6)}</p>
            </div>

            <div className="checkout-grid">
                {/* Left: Delivery Details Form */}
                <form className="delivery-details" onSubmit={placeOrder}>
                    <h3 className="section-title">📍 Delivery Information</h3>
                    <div className="multi-field">
                        <input required name='firstName' onChange={onChangeHandler} value={address.firstName} type="text" placeholder='First Name' />
                        <input required name='lastName' onChange={onChangeHandler} value={address.lastName} type="text" placeholder='Last Name' />
                    </div>
                    <input required name='email' onChange={onChangeHandler} value={address.email} type="email" placeholder='Email address' />
                    <input required name='street' onChange={onChangeHandler} value={address.street} type="text" placeholder='Street' />
                    <div className="multi-field">
                        <input required name='city' onChange={onChangeHandler} value={address.city} type="text" placeholder='City' />
                        <input required name='state' onChange={onChangeHandler} value={address.state} type="text" placeholder='State' />
                    </div>
                    <div className="multi-field">
                        <input required name='zipcode' onChange={onChangeHandler} value={address.zipcode} type="text" placeholder='Zip code' />
                        <input required name='country' onChange={onChangeHandler} value={address.country} type="text" placeholder='Country' />
                    </div>
                    <input required name='phone' onChange={onChangeHandler} value={address.phone} type="text" placeholder='Phone' />
                    
                    <button type="submit" className="place-order-btn" disabled={loading}>
                        {loading ? "Processing..." : "Complete Payment with Stripe"}
                    </button>
                </form>

                {/* Right: Summary & Breakdown */}
                <div className="order-summary-card">
                    <h3 className="section-title">📄 Order Summary</h3>
                    
                    <div className="user-breakdown-list">
                        {userBreakdown.map(user => (
                            <div key={user.userId} className="user-item-group">
                                <div className="user-header">
                                    <span className="user-name">{user.name === groupData.adminName ? "Host (You)" : user.name}</span>
                                    <span className="user-sum">₹{user.total}</span>
                                </div>
                                <ul className="item-list-mini">
                                    {user.items.map((item, i) => (
                                        <li key={i}>{item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="price-totals">
                        <div className="price-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="price-row">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className="price-row total">
                            <span>Grand Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                    
                    <p className="summary-note">Total items in group bag: {groupData.items.length}</p>
                </div>
            </div>

            <style jsx>{`
                .group-checkout-container {
                    padding: 40px 0;
                }
                .checkout-header {
                    margin-bottom: 30px;
                    border-bottom: 1px solid var(--go-border);
                    padding-bottom: 20px;
                }
                .back-btn {
                    background: none; border: none; color: var(--go-brand);
                    font-weight: 700; cursor: pointer; margin-bottom: 15px;
                }
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 40px;
                    align-items: start;
                }
                .delivery-details {
                    background: white; padding: 30px; border-radius: 24px;
                    border: 1px solid var(--go-border); box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                }
                .multi-field { display: flex; gap: 10px; }
                input {
                    margin-bottom: 15px; padding: 12px 18px; border-radius: 12px;
                    border: 1.5px solid var(--go-border); width: 100%; outline: none;
                }
                input:focus { border-color: var(--go-brand); }
                .place-order-btn {
                    width: 100%; background: var(--go-brand); color: white;
                    border: none; padding: 16px; border-radius: 14px;
                    font-weight: 800; font-size: 1.1rem; cursor: pointer; margin-top: 10px;
                }
                .order-summary-card {
                    background: white; padding: 30px; border-radius: 24px;
                    border: 1px solid var(--go-border); position: sticky; top: 100px;
                }
                .user-breakdown-list { margin: 20px 0; max-height: 300px; overflow-y: auto; }
                .user-item-group {
                    background: #f8fafc; padding: 15px; border-radius: 14px;
                    margin-bottom: 12px; border: 1px solid #e2e8f0;
                }
                .user-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 700; }
                .item-list-mini { list-style: none; padding: 0; font-size: 0.85rem; color: #64748b; }
                .price-totals { border-top: 1.5px dashed #cbd5e1; padding-top: 20px; }
                .price-row { display: flex; justify-content: space-between; margin-bottom: 10px; color: #475569; }
                .price-row.total { font-size: 1.5rem; color: #000; font-weight: 900; margin-top: 10px; }
                .summary-note { font-size: 0.8rem; text-align: center; color: #94a3b8; margin-top: 15px; }

                @media (max-width: 900px) {
                    .checkout-grid { grid-template-columns: 1fr; }
                    .order-summary-card { position: static; }
                }
            `}</style>
        </div>
    );
};

export default GroupCheckout;
