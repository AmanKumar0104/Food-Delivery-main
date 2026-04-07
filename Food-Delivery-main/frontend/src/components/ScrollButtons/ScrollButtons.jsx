import React, { useState, useEffect, useCallback } from "react";
import "./ScrollButtons.css";

const ScrollButtons = ({ isChatOpen }) => {
  const [scrollState, setScrollState] = useState({
    showUp: false,
    showDown: true,
    atBottom: false,
  });

  const SHOW_THRESHOLD = 200; // px from top before "scroll up" appears

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    // Cross-browser height calculation
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const winHeight = window.innerHeight;
    
    const atBottom = scrollY + winHeight >= docHeight - 100;

    setScrollState({
      showUp: scrollY > SHOW_THRESHOLD,
      showDown: !atBottom,
      atBottom,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  if (isChatOpen) return null;

  return (
    <div className={`scroll-btn-group ${isChatOpen ? "chat-open-hide" : ""}`} aria-label="Page navigation">
      {/* Scroll Up */}
      <button
        className={`scroll-btn scroll-up-btn ${scrollState.showUp ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <span className="scroll-btn-tooltip">Top</span>
      </button>

      {/* Scroll Down */}
      <button
        className={`scroll-btn scroll-down-btn ${scrollState.showDown ? "visible" : ""}`}
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span className="scroll-btn-tooltip">Bottom</span>
      </button>
    </div>
  );
};

export default ScrollButtons;
