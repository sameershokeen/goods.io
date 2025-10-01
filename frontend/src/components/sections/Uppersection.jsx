import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const slides = [
  {
    title: "Discover Digital Assets",
    subtitle: "Explore the decentralized marketplace",
    bg: "bg-gradient-to-r from-purple-600 to-pink-500",
  },
  {
    title: "Trade Securely",
    subtitle: "Powered by blockchain & Solana",
    bg: "bg-gradient-to-r from-blue-600 to-cyan-500",
  },
  {
    title: "Own Unique NFTs",
    subtitle: "Buy, sell, and showcase your creations",
    bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const slideRef = useRef(null);

  // Auto Slide Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Animation
  useEffect(() => {
    if (slideRef.current) {
      gsap.fromTo(
        slideRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      );
    }
  }, [current]);

  return (
    <div className=" overflow-hidden rounded-lg shadow-lg h-60 mt-4 ">
      <div
        ref={slideRef}
        className={`w-full h-full flex flex-col items-center justify-center text-white ${slides[current].bg} transition-all duration-500`}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {slides[current].title}
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          {slides[current].subtitle}
        </p>
      </div>
    </div>
  );
};

export default HeroSlider;
