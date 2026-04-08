import React from 'react';

const NewHero = () => {
    return (
        <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-[32px] my-4 mx-auto max-w-7xl">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col items-start justify-center px-12 md:px-24 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in leading-tight">
                    Order your <br />
                    favourite food here
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl font-medium leading-relaxed">
                    Choose from a diverse menu featuring a delectable array of dishes 
                    crafted with the finest ingredients and culinary expertise.
                </p>
                <button className="bg-white text-gray-800 px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-lg">
                    View Menu
                </button>
            </div>
            
            {/* Pagination Indicators (Visual Only to match reference) */}
            <div className="absolute bottom-8 left-12 flex gap-2">
                <span className="w-3 h-3 rounded-full bg-white"></span>
                <span className="w-3 h-3 rounded-full bg-white/40"></span>
                <span className="w-3 h-3 rounded-full bg-white/40"></span>
            </div>
        </div>
    );
};

export default NewHero;
