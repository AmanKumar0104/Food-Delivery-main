import React, { useContext } from "react";
import "./Header.css";
import BannerCarousel from "../BannerCarousel/BannerCarousel";
import { StoreContext } from "../../context/StoreContext";

const Header = () => {
    const { timeGreeting, timeTheme } = useContext(StoreContext);

    const getThemeImage = () => {
        switch(timeTheme) {
            case 'morning-theme': return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1600";
            case 'warm-theme': return "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1600";
            case 'evening-theme': return "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1600";
            case 'dark-theme': return "https://images.unsplash.com/photo-1513267048331-5611cad82e41?auto=format&fit=crop&q=80&w=1600";
            default: return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600";
        }
    }

    const slides = [
        {
            title: timeGreeting,
            subtitle: "Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.",
            image: getThemeImage(),
            btnText: "View Menu",
            btnAction: () => document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            title: "Experience Gourmet at Home",
            subtitle: "Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time. Fresh, Hot, and Fast.",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600",
            btnText: "Order Now",
            btnAction: () => document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            title: "Flavors that tell a Story",
            subtitle: "From traditional spices to modern fusion, explore a menu that brings the world to your doorstep. Quality you can taste.",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600",
            btnText: "Explore Menu",
            btnAction: () => document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' })
        }
    ];

    return (
        <div className="header">
            <BannerCarousel slides={slides} />
        </div>
    );
};

export default Header;
