
import React, { useState, useEffect } from 'react';
import './InstallApp.css';
import { toast } from 'react-toastify';

const InstallApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsVisible(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            toast.info("To install: Click your browser's 'Add to Home Screen' or 'Install' option.");
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            toast.success("Thank you for installing Tomato! 🍅");
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    // For demonstration, we'll keep it visible if the user hasn't installed it
    // or just show it anyway for the "attractive look" the user requested.
    // If we want it always visible (as a simulated feature):
    const alwaysShow = true; 

    if (!isVisible && !alwaysShow) return null;

    return (
        <div className="install-app-container">
            <button className="install-btn" onClick={handleInstallClick}>
                <div className="install-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15L12 3M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L2 18C2 19.6569 3.34315 21 5 21L19 21C20.6569 21 22 19.6569 22 18L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span>Add to Home Screen</span>
            </button>
        </div>
    );
};

export default InstallApp;
