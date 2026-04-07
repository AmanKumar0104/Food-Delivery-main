
import React, { useContext, useState } from 'react'
import './Customize.css'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'

const Customize = () => {
    const { food_list, url, addToCart } = useContext(StoreContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [customs, setCustoms] = useState({
        spice: "Medium",
        servings: "1 Person",
        toppings: []
    });

    const spiceLevels = ["Mild", "Medium", "Extra Spicy"];
    const portions = ["1 Person", "2 People", "Family Pack"];
    const availableToppings = ["Extra Cheese", "Onions", "Garlic Butter", "Fresh Herbs"];

    const toggleTopping = (topping) => {
        if (customs.toppings.includes(topping)) {
            setCustoms(prev => ({...prev, toppings: prev.toppings.filter(t => t !== topping)}));
        } else {
            setCustoms(prev => ({...prev, toppings: [...prev.toppings, topping]}));
        }
    }

    const handleAddToCart = (itemId) => {
        addToCart(itemId);
        // Since the actual cart storage doesn't support custom fields yet, 
        // we'll just show a special toast for now to simulate the custom experience.
        toast.info(`Customized "${food_list.find(i=>i._id===itemId).name}" added to cart!`);
        setSelectedItem(null);
    }

    return (
        <div className='customize-page'>
            <div className="bg-bubbles">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
            </div>
            <div className='customize-header'>
                <h1>Customize Your <span>Menu</span></h1>
                <p>Personalize your favorite dishes exactly how you like them. Choose your spice, portions, and toppings!</p>
                <div style={{marginTop: '20px'}}>
                    <a href="/group-order" className="group-order-btn-link" style={{textDecoration: 'none', background: '#6c5ce7', color: 'white', padding: '12px 25px', borderRadius: '50px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(108, 92, 231, 0.3)'}}>
                        👥 Start Group Order
                    </a>
                </div>
            </div>

            <div className='customize-content'>
                <div className='customize-grid'>
                    {food_list.slice(0, 50).map((item, index) => (
                        <div key={index} className='customize-item-card' onClick={() => setSelectedItem(item)}>
                            <img src={url + "/images/" + item.image} alt="" />
                            <div className='card-info'>
                                <h3>{item.name}</h3>
                                <p>₹{item.price}</p>
                            </div>
                            <button className='customize-btn'>Customize</button>
                        </div>
                    ))}
                </div>

                {selectedItem && (
                    <div className='customize-modal-overlay' onClick={() => setSelectedItem(null)}>
                        <div className='customize-modal' onClick={(e) => e.stopPropagation()}>
                            <div className='modal-header'>
                                <img src={url + "/images/" + selectedItem.image} alt="" />
                                <div>
                                    <h2>{selectedItem.name}</h2>
                                    <p>{selectedItem.description}</p>
                                </div>
                                <button className='close-btn' onClick={() => setSelectedItem(null)}>×</button>
                            </div>

                            <div className='modal-body'>
                                <div className='customize-section'>
                                    <h4>Spice Level</h4>
                                    <div className='option-group'>
                                        {spiceLevels.map(s => (
                                            <button key={s} className={customs.spice === s ? 'active' : ''} onClick={() => setCustoms(prev=>({...prev, spice: s}))}>{s}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className='customize-section'>
                                    <h4>Portion Size</h4>
                                    <div className='option-group'>
                                        {portions.map(p => (
                                            <button key={p} className={customs.servings === p ? 'active' : ''} onClick={() => setCustoms(prev=>({...prev, servings: p}))}>{p}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className='customize-section'>
                                    <h4>Add Toppings</h4>
                                    <div className='topping-group'>
                                        {availableToppings.map(t => (
                                            <div key={t} className={`topping-item ${customs.toppings.includes(t) ? 'selected' : ''}`} onClick={() => toggleTopping(t)}>
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className='customize-summary'>
                                    <div className='summary-text'>
                                        <span>Current Selection:</span>
                                        <p>{customs.spice} • {customs.servings} {customs.toppings.length > 0 ? `• With ${customs.toppings.join(', ')}` : ''}</p>
                                    </div>
                                    <button onClick={() => handleAddToCart(selectedItem._id)}>Add to Cart • ₹{selectedItem.price}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Customize
