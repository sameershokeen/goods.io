import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const slides = [
  {
    title: "Discover Digital Treasures",
    subtitle: "Explore the decentralized NFT marketplace",
    bg: "bg-gradient-to-r from-purple-600 to-pink-500",
  },
  {
    title: "Trending Collections",
    subtitle: "The most active NFT drops",
    bg: "bg-gradient-to-r from-blue-600 to-cyan-500",
  },
  {
    title: "Mint & Own NFTs",
    subtitle: "Secure, fast, and transparent",
    bg: "bg-gradient-to-r from-orange-500 to-yellow-400",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto Slide
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  // GSAP Animation
  useEffect(() => {
    if (slideRef.current) {
      gsap.fromTo(
        slideRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, [current]);

  return (
    <div
      className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl mt-4 relative"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <div
        ref={slideRef}
        className={`w-full h-full flex flex-col items-center justify-center text-white transition-all duration-700 ${slides[current].bg}`}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center">
          {slides[current].title}
        </h1>
        <p className="text-lg md:text-xl opacity-90 text-center">
          {slides[current].subtitle}
        </p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              current === index ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
