import React, { useEffect,  useRef } from "react";

const TrendingNFTs = ({ nfts }) => {
  const containerRef = useRef(null);

  // Auto-scroll horizontally
  useEffect(() => {
    let scrollInterval;
    if (containerRef.current) {
      scrollInterval = setInterval(() => {
        if (
          containerRef.current.scrollLeft + containerRef.current.clientWidth >=
          containerRef.current.scrollWidth
        ) {
          containerRef.current.scrollLeft = 0;
        } else {
          containerRef.current.scrollLeft += 2;
        }
      }, 20);
    }
    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        🔥 Trending NFTs
      </h2>
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2"
      >
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="min-w-[180px] bg-gray-800 rounded-xl shadow-lg p-3 hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <h3 className="text-white font-semibold mt-2 truncate">
              {nft.name}
            </h3>
            <p className="text-gray-300 text-sm mt-1">Price: {nft.price} ETH</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingNFTs;
