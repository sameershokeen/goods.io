import React, { useEffect, useRef } from "react";

const categories = [
  { id: 1, name: "🎨 Art", img: "https://i.seadn.io/gae/v9iV4T4i0u6J6P8Gx5R?auto=format&w=500" },
  { id: 2, name: "🕹️ Gaming", img: "https://i.seadn.io/gae/5h8Q1kT9F6g7L1Kx2P8?auto=format&w=500" },
  { id: 3, name: "🐵 PFP", img: "https://i.seadn.io/gae/7P6rJ3X9K0L2B5Y3C?auto=format&w=500" },
  { id: 4, name: "🎶 Music", img: "https://i.seadn.io/gae/2K6Q4P5H7G9F1C3A?auto=format&w=500" },
  { id: 5, name: "🌌 Metaverse", img: "https://i.seadn.io/gae/1M8N6K4J3L2F7P5X?auto=format&w=500" },
];

const CategorySlider = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    // Auto scroll effect
    const slider = sliderRef.current;
    let scrollAmount = 0;

    const autoScroll = setInterval(() => {
      if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
        scrollAmount = 0;
      } else {
        scrollAmount += 1; // Adjust speed here
      }
      slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 20); // Adjust speed timing here

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="mt-14">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        🔥 Categories
      </h2>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-3"
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex-shrink-0 w-36 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 rounded-xl shadow-lg p-2 cursor-pointer hover:scale-105 transition-transform duration-300 snap-start"
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-24 object-cover rounded-lg mb-2"
            />
            <h3 className="text-sm font-semibold text-white text-center">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
