import React from "react";

const NewLaunches = ({ nfts }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        🆕 New Launches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white font-semibold truncate">{nft.name}</h3>
              <p className="text-gray-300 text-sm mt-1">
                Price: {nft.price} ETH
              </p>
              <p className="text-gray-300 text-sm mt-1">Supply: {nft.supply}</p>
              <p className="text-green-400 text-sm mt-1">Hype: {nft.hype}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewLaunches;
