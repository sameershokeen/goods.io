import React from "react";

const categories = [
  { id: 1, name: "🎨 Art" },
  { id: 2, name: "🕹️ Gaming" },
  { id: 3, name: "🐵 PFP" },
  { id: 4, name: "🎶 Music" },
  { id: 5, name: "🌌 Metaverse" },
];

const CategorySlider = () => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        🔥 Categories
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="min-w-[140px] bg-gray-700 rounded-xl shadow-lg p-3 hover:scale-105 transition-transform cursor-pointer text-center"
          >
            <div className="text-white text-lg font-bold">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
