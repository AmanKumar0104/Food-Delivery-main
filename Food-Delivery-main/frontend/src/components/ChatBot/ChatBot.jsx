import React, { useState, useRef, useEffect, useContext } from "react";
import "./ChatBot.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "model",
            text: "Hey there! 🍅 I'm Tomato AI, your food assistant! Ask me anything about our menu, or let me help you pick the perfect meal!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { url } = useContext(StoreContext);

    const quickActions = [
        "🔥 What's popular?",
        "🌶️ Something spicy",
        "🥗 Healthy options",
        "💰 Best value deals",
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (messageText) => {
        const text = messageText || input.trim();
        if (!text) return;

        const userMessage = { role: "user", text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsTyping(true);

        try {
            // Build chat history (skip system greeting)
            const chatHistory = updatedMessages.slice(1).map((m) => ({
                role: m.role,
                text: m.text,
            }));

            const response = await axios.post(url + "/api/ai/chat", {
                message: text,
                chatHistory: chatHistory.slice(0, -1), // exclude current message
            });

            if (response.data.success) {
                setMessages((prev) => [
                    ...prev,
                    { role: "model", text: response.data.reply },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        text: "Oops! I'm having trouble right now. Try again in a moment! 😊",
                    },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    text: "Sorry, I couldn't connect. Please check your internet and try again! 🔌",
                },
            ]);
        }
        setIsTyping(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chatbot-wrapper">
            {/* Floating Button */}
            <button
                className={`chatbot-fab ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat with AI"
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        <circle cx="8" cy="10" r="1.2" />
                        <circle cx="12" cy="10" r="1.2" />
                        <circle cx="16" cy="10" r="1.2" />
                    </svg>
                )}
                <span className="chatbot-fab-pulse"></span>
            </button>

            {/* Chat Panel */}
            <div className={`chatbot-panel ${isOpen ? "open" : ""}`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">🍅</div>
                        <div>
                            <h4>Tomato AI</h4>
                            <span className="chatbot-status">● Online</span>
                        </div>
                    </div>
                    <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                        ✕
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chatbot-msg ${msg.role}`}>
                            {msg.role === "model" && <span className="chatbot-msg-avatar">🍅</span>}
                            <div className="chatbot-msg-bubble">
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chatbot-msg model">
                            <span className="chatbot-msg-avatar">🍅</span>
                            <div className="chatbot-msg-bubble typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {messages.length <= 1 && (
                    <div className="chatbot-quick-actions">
                        {quickActions.map((action, i) => (
                            <button key={i} onClick={() => sendMessage(action)}>
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                <div className="chatbot-input-area">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me about our menu..."
                        disabled={isTyping}
                    />
                    <button
                        className="chatbot-send"
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isTyping}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
