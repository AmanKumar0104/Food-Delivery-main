import React, { useContext, useState, useEffect, useCallback } from 'react';
import './GroupOrder.css';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from "../../assets/frontend_assets/assets";

// Sub-components
import FoodCard from './components/FoodCard';
import GroupCart from './components/GroupCart';
import GroupChat from './components/GroupChat';
import GroupParticipants from './components/GroupParticipants';
import GroupCheckout from './components/GroupCheckout';

const GroupOrder = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { url, token, food_list } = useContext(StoreContext);
    
    const [loading, setLoading] = useState(true);
    const [groupId, setGroupId] = useState(sessionId || null);
    const [groupData, setGroupData] = useState(null);
    const [userName, setUserName] = useState(localStorage.getItem('group_user_name') || "");
    const [isJoining, setIsJoining] = useState(!!sessionId && !localStorage.getItem('group_user_name'));
    const [userId] = useState(localStorage.getItem('group_user_id') || Math.random().toString(36).substring(7));
    const [showStartModal, setShowStartModal] = useState(false);
    const [adminNameInput, setAdminNameInput] = useState("");
    const [isCheckout, setIsCheckout] = useState(false);

    // Persist session and Sync with URL
    useEffect(() => {
        localStorage.setItem('group_user_id', userId);
    }, [userId]);

    useEffect(() => {
        if (sessionId) {
            setGroupId(sessionId);
            // If we have a URL session but no local name, we must be joining
            if (!localStorage.getItem('group_user_name')) {
                setIsJoining(true);
            } else {
                setIsJoining(false);
                setUserName(localStorage.getItem('group_user_name'));
            }
        } else {
            setGroupId(null);
            setIsJoining(false);
        }
    }, [sessionId]);

    const fetchGroupData = useCallback(async (id) => {
        try {
            const response = await axios.get(`${url}/api/group-order/data/${id}`);
            if (response.data.success) {
                setGroupData(response.data.group);
            } else {
                console.warn("Group not found or error:", response.data.message);
                if (id === sessionId) toast.error("Session data could not be retrieved.");
            }
        } catch (error) {
            console.error("Polling error:", error);
        } finally {
            setLoading(false); // ALWAYS stop loading screen on finish
        }
    }, [url, sessionId]);

    // Polling Logic (Cart + Chat)
    useEffect(() => {
        if (groupId) {
            fetchGroupData(groupId);
            const interval = setInterval(() => fetchGroupData(groupId), 3000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [groupId, fetchGroupData]);

    const handleStartGroup = async () => {
        if (!adminNameInput.trim()) {
            toast.warn("Please enter your name to start ✍️");
            return;
        }
        
        setUserName(adminNameInput);
        localStorage.setItem('group_user_name', adminNameInput);

        try {
            setLoading(true);
            const response = await axios.post(`${url}/api/group-order/start`, {
                adminName: adminNameInput,
                adminId: userId
            });
            if (response.data.success) {
                setGroupId(response.data.groupId);
                setShowStartModal(false);
                navigate(`/group-order/${response.data.groupId}`);
                toast.success("✨ Your Group Session is Live! 🎉", {
                    position: "top-center",
                    autoClose: 3500,
                    icon: "🚀"
                });
            } else {
                toast.error(`Could not create session: ${response.data.message || 'Server returned failure'}`);
            }
        } catch (error) {
            console.error("Session creation error:", error);
            toast.error(`Network Error: ${error.message}. Please check if the server is running on port 4000. 📡`);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        if (!userName.trim()) {
            toast.warn("Please enter your name ✍️");
            return;
        }
        localStorage.setItem('group_user_name', userName);
        
        try {
            setLoading(true);
            const response = await axios.post(`${url}/api/group-order/join`, {
                groupId: sessionId,
                name: userName,
                userId: userId
            });
            if (response.data.success) {
                setGroupId(sessionId);
                setGroupData(response.data.group);
                setIsJoining(false);
                toast.success(`Welcome to the group, ${userName}! 👋`);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Join error:", error);
            toast.error("Group not found or joining error. Please check the link. 🔗");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (item) => {
        if (!groupId) return;
        try {
            const response = await axios.post(`${url}/api/group-order/add`, {
                groupId, item, userName, userId
            });
            if (response.data.success) {
                toast.info(`Added ${item.name} to group cart`);
                fetchGroupData(groupId);
            }
        } catch (error) {
            toast.error("Error adding item");
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.post(`${url}/api/group-order/remove`, {
                groupId, itemId
            });
            if (response.data.success) {
                fetchGroupData(groupId);
            }
        } catch (error) {
            toast.error("Error removing item");
        }
    };

    const handleSendMessage = async (text) => {
        try {
            await axios.post(`${url}/api/group-order/message`, {
                groupId, userId, name: userName, text
            });
            fetchGroupData(groupId);
        } catch (error) {
            console.error("Chat error:", error);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.info("Link copied! Share it with your friends. 🔗");
    };

    const totalAmount = groupData ? groupData.items.reduce((sum, item) => sum + item.price, 0) : 0;

    if (loading && groupId) {
        return (
            <div className='group-order-container' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a'}}>
                <div className='spinner-reset' style={{width: '60px', height: '60px', borderTopColor: '#ff4d2d'}}></div>
            </div>
        );
    }

    if (isJoining) {
        return (
            <div className='join-prompt-overlay' style={{background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className='go-join-card-dark animate-slide-in'>
                    <h2 style={{fontSize: '1.8rem', color: '#ff4d2d'}}>Join the Feast! 🥘</h2>
                    <p style={{marginTop: '10px', opacity: 0.8}}>Your friends are waiting for you to order together.</p>
                    <input 
                        type="text" 
                        placeholder="Enter your nickname" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinGroup()}
                    />
                    <button className='final-checkout-btn' style={{width: '100%', marginBottom: '15px'}} onClick={handleJoinGroup}>Join Group</button>
                    <button style={{background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem'}} onClick={() => navigate('/customize')}>← Back to individual menu</button>
                </div>
            </div>
        );
    }

    return (
        <div className='group-order-container'>
            <div className='go-header'>
                <h1>Social <span>Group Ordering</span></h1>
                {userName && <div className='welcome-badge animate-pop-in'>Welcome, <span>{userName} 👋</span></div>}
                <p>Chat, collaborate, and order your favorites together in real-time.</p>
            </div>

            {isCheckout ? (
                <GroupCheckout 
                    groupData={groupData} 
                    url={url} 
                    userId={userId} 
                    onBack={() => setIsCheckout(false)} 
                />
            ) : !groupId ? (
                <div className="landing-view">
                    <div className='no-group-card animate-slide-in'>
                        <div className='card-icon'>🍕</div>
                        <h2>Invite Friends & Order!</h2>
                        <p>Start a group session and invite your squad to add their favorites. Perfect for parties, meetings, and families!</p>
                        <button className='start-lobby-main-btn' onClick={() => setShowStartModal(true)}>
                            🚀 Start Group Lobby
                        </button>
                    </div>

                    {showStartModal && (
                        <div className='modal-overlay fade-in'>
                            <div className='premium-modal animate-pop-in'>
                                <button className='close-modal' onClick={() => setShowStartModal(false)}>×</button>
                                <h3>Create Group Session 🥘</h3>
                                <p>Set your display name to start inviting friends</p>
                                <input 
                                    type="text" 
                                    placeholder="Enter your name (e.g., Alex)" 
                                    value={adminNameInput}
                                    onChange={(e) => setAdminNameInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleStartGroup()}
                                    autoFocus
                                />
                                <button className='final-checkout-btn' onClick={handleStartGroup}>
                                    Create Session ✨
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className='invite-glass-panel'>
                        <h3 style={{fontSize: '1.2rem'}}>Invite Your Squad 👥</h3>
                        <div className='invite-flex'>
                            <input className='invite-input-alt' type="text" readOnly value={window.location.href} />
                            <button className='invite-copy-btn' onClick={copyLink}>Copy Link</button>
                            <a 
                                href={`https://wa.me/?text=Join%20our%20food%20group%20order%20here:%20${window.location.href}`} 
                                target="_blank" 
                                className='invite-copy-btn' 
                                style={{background: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}
                                rel="noreferrer"
                            >
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                                WhatsApp
                            </a>
                        </div>
                        <p style={{marginTop: '15px', color: '#94a3b8', fontSize: '0.85rem'}}>Session Members: <span style={{color: '#ff4d2d', fontWeight: 700}}>{groupData?.members.length}</span> Active</p>
                    </div>

                    <div className='go-grid-layout'>
                        {/* Main Menu Panel */}
                        <div className='menu-section'>
                            <h2>Explore Menu</h2>
                            <div className='go-food-grid-dark'>
                                {food_list.slice(0, 50).map((item) => (
                                    <FoodCard key={item._id} item={item} url={url} onAdd={handleAddItem} />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Group Interaction */}
                        <div className='go-sidebar'>
                            <GroupParticipants 
                                members={groupData?.members} 
                                adminId={groupData?.adminId} 
                            />

                            <GroupCart 
                                groupData={groupData} 
                                userId={userId} 
                                url={url} 
                                onRemove={handleRemoveItem} 
                                onCheckout={() => {
                                    if(groupData.adminId === userId) setIsCheckout(true);
                                    else toast.info("Waiting for the host to start checkout... ⌛");
                                }}
                            />
                            
                            <GroupChat 
                                messages={groupData?.messages || []} 
                                userId={userId} 
                                userName={userName} 
                                onSend={handleSendMessage} 
                            />
                        </div>
                    </div>

                    {/* Final Checkout Bar */}
                    <div className='go-final-checkout-bar'>
                        <div className='checkout-text'>
                            <p style={{color: '#94a3b8', fontSize: '0.8rem'}}>Subtotal ({groupData?.items.length} items)</p>
                            <h2 style={{color: '#fff', fontSize: '1.4rem'}}>₹{totalAmount}</h2>
                        </div>
                        <div className='checkout-actions'>
                             <button 
                                className='final-checkout-btn pulse' 
                                disabled={!groupData || groupData.items.length === 0}
                                onClick={() => {
                                    if(groupData.adminId === userId) setIsCheckout(true);
                                    else toast.info("Waiting for the host to start checkout... ⌛");
                                }}
                            >
                                {groupData?.adminId === userId ? "✨ Proceed to Checkout" : "Waiting for Host..."}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default GroupOrder;
