import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import axios from 'axios';

const Chatbot = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const messagesEndRef = useRef(null);

  const quickResponses = [
    { id: 1, text: "Indian menu?", icon: "🍛" },
    { id: 2, text: "Recommendations?", icon: "🍴" },
    { id: 3, text: "Bestsellers?", icon: "🔥" },
    { id: 4, text: "Sweet treats?", icon: "🍦" }
  ];

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 1,
          text: "👋 Namaste! I'm Tomato AI. Hungry for something special? I can help you pick the best Indian dishes!",
          sender: 'bot',
          timestamp: new Date()
        }]);
      }, 500);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowQuickResponses(false);

    try {
      // Corrected route to match backend /api/ai/chat
      const response = await axios.post(`${url}/api/ai/chat`, {
        message: messageText,
        chatHistory: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }))
      });

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.reply,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "My apologies! 🍅 Tomato AI is feeling a bit under the weather. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'active' : ''}`}>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="chatbot-fab" onClick={() => setIsOpen(true)}>
          <div className="fab-icon">💬</div>
          <span className="fab-tooltip">AI 🍅</span>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-card">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-info">
              <div className="bot-avatar">
                <div className="avatar-pulse"></div>
                🍅
              </div>
              <div className="header-text">
                <h3>Tomato AI Assistant</h3>
                <span className="pulse-indicator"></span> <span>Online</span>
              </div>
            </div>
            <button aria-label="Close Chat" onClick={() => setIsOpen(false)} className="close-btn">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-body">
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.sender}`}>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                  <span className="message-meta">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="message-row bot">
                  <div className="typing-bubble">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Responses */}
          {showQuickResponses && !isLoading && (
            <div className="quick-chip-container">
              {quickResponses.map((qr) => (
                <button
                  key={qr.id}
                  className="quick-chip"
                  onClick={() => sendMessage(qr.text)}
                >
                  {qr.icon} {qr.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form className="chatbot-footer" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about Indian Food..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
