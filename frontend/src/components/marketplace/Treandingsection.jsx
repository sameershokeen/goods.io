import React from "react";

const trendingItems = [
  {
    id: 1,
    name: "Cyber Apes",
    img: "https://i.seadn.io/gae/jx7Vdc0p4r9G5PiPLYZRd_YVEhqgUhBtIkIGenT8FjP9FhOXNIb5CKEM5Qn2ATmObRIjftWmHH7uFlWSr6g0hJZ7BaWiclcaybGycw?auto=format&w=500",
    price: "2.5 ETH",
  },
  {
    id: 2,
    name: "Galaxy Wolves",
    img: "https://i.seadn.io/gae/DKQhuKS3bZHlKlV1jijyPLaRKqzZo4PMBVXgS5aXoaZySUdkGFUTkOcJCIZy9FHn5-PP3LXYhIwrKyYVJZZzKzb6daqyLVCvwhP5?auto=format&w=500",
    price: "1.8 ETH",
  },
  {
    id: 3,
    name: "Neon Realm",
    img: "https://i.seadn.io/gae/7X6-pbZux41DmvNmOZDVmhO3yiB9vSg6u40qCMgfHdCqkfNNpJBWlAbIYWq2PASi6DPd7OJbRRqtD9h5pz50jdVI?auto=format&w=500",
    price: "3.1 ETH",
  },
  {
    id: 4,
    name: "Mystic Dragons",
    img: "https://i.seadn.io/gae/X0iAfDdc_1Ji4VluWGINuDhcE7UZ5EONosFVJeFt3PcTJS3BM4ti4f4ogN6SZdlG5t0GhGgcbE87j9?auto=format&w=500",
    price: "4.2 ETH",
  },
];

const TrendingSection = () => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
        🔥 Trending Collections
      </h2>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide py-3">
        {trendingItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[220px] bg-gradient-to-tr from-purple-700 via-pink-600 to-yellow-500 rounded-xl shadow-xl p-4 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-44 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-bold text-white">{item.name}</h3>
            <p className="text-sm text-white/80">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
