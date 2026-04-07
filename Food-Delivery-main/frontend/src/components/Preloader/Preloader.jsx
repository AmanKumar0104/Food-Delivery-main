
import React, { useEffect, useState } from "react";
import "./Preloader.css";

const Preloader = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000); // 3 seconds splash
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="preloader">
            <div className="preloader-content text-focus-in">
                <h1>Tomato 🍅</h1>
                <div className="loading-bar"></div>
            </div>
        </div>
    );
};

export default Preloader;
