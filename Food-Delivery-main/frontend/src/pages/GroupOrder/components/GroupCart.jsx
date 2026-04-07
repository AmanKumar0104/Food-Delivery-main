import React from 'react';

const GroupCart = ({ groupData, userId, onRemove, url, onCheckout }) => {
    const totalAmount = groupData ? groupData.items.reduce((sum, item) => sum + item.price, 0) : 0;

    return (
        <div className="group-cart-section">
            <h3 className="section-title">🛒 Group Cart</h3>

            <div className="cart-list">
                {groupData?.items.length === 0 ? (
                    <div className="empty-cart-info">
                        <span className="emoji">🥘</span>
                        <p>No favorites added yet!</p>
                    </div>
                ) : (
                    groupData?.items.map((item) => (
                        <div key={item._id} className="cart-item-modern animate-slide-in">
                            <img src={url + "/images/" + item.image} alt={item.name} />
                            <div className="item-details">
                                <h5>{item.name}</h5>
                                <p className="added-by-tag">
                                    <span className="dot"></span>
                                    {item.addedByUserId === userId ? "You" : item.addedBy}
                                </p>
                            </div>
                            <div className="item-action">
                                <span className="item-price">₹{item.price}</span>
                                {item.addedByUserId === userId || groupData.adminId === userId ? (
                                    <button className="remove-item-icon" onClick={() => onRemove(item._id)}>×</button>
                                ) : null}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-total-summary">
                <div className="total-row">
                    <span>Group Total:</span>
                    <span>₹{totalAmount}</span>
                </div>
                {groupData?.members.length > 1 && (
                    <p className="split-hint">Estimated split: ₹{(totalAmount / groupData.members.length).toFixed(0)} / person</p>
                )}
                
                <button 
                    className={`cart-buy-now-btn ${groupData?.items.length > 0 ? 'active' : ''}`}
                    disabled={!groupData || groupData.items.length === 0}
                    onClick={onCheckout}
                >
                    {groupData?.adminId === userId ? "🚀 Buy Now / Checkout" : "⌛ Waiting for Host..."}
                </button>
                {!groupData || groupData.items.length === 0 ? <p className="empty-warn">Add items to proceed</p> : null}
            </div>
        </div>
    );
};

export default GroupCart;
