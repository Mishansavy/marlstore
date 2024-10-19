import React, { useState, useEffect } from "react";
import "./Carousel.css"; // Importing CSS for styles
import ProductList from "../ProductList";

const images = [
  "http://127.0.0.1:8000/media/slider/slider1-img.jpg",
  "http://127.0.0.1:8000/media/slider/slider2-img.jpg",
  "http://127.0.0.1:8000/media/slider/slider3-img.jpg",
  "http://127.0.0.1:8000/media/slider/slider4-img.jpg",
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Autoplay effect
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
      return () => clearInterval(interval); // Cleanup on unmount or when hovered
    }
  }, [currentIndex, isHovered]);

  return (
    <>
      <div
        className="carousel"
        onMouseEnter={() => setIsHovered(true)} // Pause on Hover
        onMouseLeave={() => setIsHovered(false)} // Resume on mouse leave
      >
        <button className="carousel__button left" onClick={prevSlide}>
          ❮
        </button>
        <div className="carousel__image-wrapper">
          <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
        </div>
        <button className="carousel__button right" onClick={nextSlide}>
          ❯
        </button>
      </div>
      <ProductList />
    </>
  );
};
