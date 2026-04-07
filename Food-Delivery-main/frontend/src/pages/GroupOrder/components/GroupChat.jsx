import React, { useState, useEffect, useRef } from 'react';

const GroupChat = ({ messages, userId, userName, onSend }) => {
    const [msg, setMsg] = useState("");
    const messagesEndRef = useRef(null);

    const previousLengthRef = useRef(messages.length);
    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior, block: 'nearest' });
    };

    useEffect(() => {
        if (messages.length > previousLengthRef.current) {
            scrollToBottom();
        }
        previousLengthRef.current = messages.length;
    }, [messages]);

    const handleSend = () => {
        if (!msg.trim()) return;
        onSend(msg);
        setMsg("");
    };

    return (
        <div className="group-chat-section">
            <h3 className="section-title">💬 Live Chat</h3>
            <div className="chat-messages-container">
                {messages.length === 0 ? (
                    <div className="no-chat-msg">Say hi! Begin the chat... 👋</div>
                ) : (
                    messages.map((m, i) => (
                        <div key={i} className={`chat-bubble-wrapper ${m.userId === userId ? 'own' : ''}`}>
                            <span className="bubble-name">{m.name}</span>
                            <div className="bubble-text">{m.text}</div>
                            <span className="bubble-time">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-row">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="chat-send-btn" onClick={handleSend}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    );
};

export default GroupChat;
