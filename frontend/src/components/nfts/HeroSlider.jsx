import React, { useState, useEffect, useRef } from "react";

const slides = [
  {
    title: "Discover Digital Treasures",
    subtitle: "Explore the NFT marketplace",
    bg: "bg-gradient-to-r from-purple-600 to-pink-500",
  },
  {
    title: "Trending Collections",
    subtitle: "The most active NFT drops",
    bg: "bg-gradient-to-r from-blue-600 to-cyan-500",
  },
  {
    title: "Mint & Own NFTs",
    subtitle: "Secure, fast & transparent",
    bg: "bg-gradient-to-r from-orange-500 to-yellow-400",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg mt-4">
      <div
        ref={slideRef}
        className={`w-full h-full flex flex-col items-center justify-center text-white transition-all duration-700 ${slides[current].bg}`}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
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
