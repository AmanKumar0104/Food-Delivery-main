import React, { useState, useEffect, useCallback } from 'react';
import './BannerCarousel.css';

const BannerCarousel = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(nextSlide, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    if (!slides || slides.length === 0) return null;

    return (
        <div 
            className="banner-carousel" 
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div 
                        key={index} 
                        className="carousel-item" 
                        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${slide.image})` }}
                    >
                        <div className="carousel-content">
                            <h2 className="animate-up">{slide.title}</h2>
                            <p className="animate-up delay-1">{slide.subtitle}</p>
                            <button className="animate-up delay-2" onClick={() => slide.btnAction ? slide.btnAction() : null}>
                                {slide.btnText || 'Explore More'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className="carousel-control next" onClick={nextSlide} aria-label="Next slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>

            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <span 
                        key={index} 
                        className={`indicator ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
