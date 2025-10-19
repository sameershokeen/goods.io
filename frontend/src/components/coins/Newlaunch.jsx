import React from "react";

const newLaunches = [
  {
    id: 1,
    name: "Pixel Apes",
    img: "https://i.seadn.io/gae/jx7Vdc0p4r9G5PiPLYZRd_YVEhqgUhBtIkIGenT8FjP9FhOXNIb5CKEM5Qn2ATmObRIjftWmHH7uFlWSr6g0hJZ7BaWiclcaybGycw?auto=format&w=500",
    price: "0.8 ETH",
  },
  {
    id: 2,
    name: "Mystic Wolves",
    img: "https://i.seadn.io/gae/DKQhuKS3bZHlKlV1jijyPLaRKqzZo4PMBVXgS5aXoaZySUdkGFUTkOcJCIZy9FHn5-PP3LXYhIwrKyYVJZZzKzb6daqyLVCvwhP5?auto=format&w=500",
    price: "1.2 ETH",
  },
  {
    id: 3,
    name: "Samurai Souls",
    img: "https://i.seadn.io/gae/7X6-pbZux41DmvNmOZDVmhO3yiB9vSg6u40qCMgfHdCqkfNNpJBWlAbIYWq2PASi6DPd7OJbRRqtD9h5pz50jdVI?auto=format&w=500",
    price: "0.6 ETH",
  },
  {
    id: 4,
    name: "Ethereal Queens",
    img: "https://i.seadn.io/gae/X0iAfDdc_1Ji4VluWGINuDhcE7UZ5EONosFVJeFt3PcTJS3BM4tiTqcKoy0eZZ_-9RnBbTK1Z4VBPaki-MP6KyQ?auto=format&w=500",
    price: "2.1 ETH",
  },
];

const NewLaunches = () => {
  return (
    <div className="mt-14">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        🆕 New Launches
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {newLaunches.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-tr from-purple-700 via-pink-600 to-yellow-500 p-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-40 rounded-lg object-cover"
            />
            <h3 className="mt-3 text-lg font-semibold text-white">
              {item.name}
            </h3>
            <p className="text-sm text-white">Price: {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewLaunches;
