import React from "react";

const upcomingDrops = [
  {
    id: 1,
    name: "Meta Artifacts",
    img: "https://i.seadn.io/gae/7ZyM5aF2N7g6zK_R0C-3u6Xk0DdU5vRHN1m5Xq8lfTg2H0i5Xw0a0hY4Qf1eYx5Oq7Tkf7L1XgqD9Kk?auto=format&w=500",
    date: "Releasing: Jan 12, 2025",
  },
  {
    id: 2,
    name: "Alien Avatars",
    img: "https://i.seadn.io/gae/xp5iQFJXB1k0cLk4opkVx6qjYfP7w4G5O6h7jv2FZ_1uRj5XcP?auto=format&w=500",
    date: "Releasing: Jan 20, 2025",
  },
  {
    id: 3,
    name: "Crypto Knights",
    img: "https://i.seadn.io/gae/Z3Fj9qj7vLk0qF5tM7uFqjL2W1?auto=format&w=500",
    date: "Releasing: Feb 02, 2025",
  },
  {
    id: 4,
    name: "Space Punks",
    img: "https://i.seadn.io/gae/3P7w8Y6L4j0FvM7p3h6GqP?auto=format&w=500",
    date: "Releasing: Feb 10, 2025",
  },
];

const UpcomingLaunches = () => {
  return (
    <div className="mt-14">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
        🚀 Upcoming Launches
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {upcomingDrops.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 p-4 rounded-xl shadow-xl cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-44 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-bold text-white">{item.name}</h3>
            <p className="text-sm text-white/80">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingLaunches;
