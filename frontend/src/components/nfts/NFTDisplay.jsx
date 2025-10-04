import React, { useEffect, useState } from "react";

const NFTMarketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate random price and hype for demo
  const generateRandomPrice = () => (Math.random() * 5).toFixed(2);
  const generateRandomHype = () => Math.floor(Math.random() * 100);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const apiKey = "CG-9rkGCe7k2CjukH443SjLY9zz";
        const res = await fetch("https://api.coingecko.com/api/v3/nfts/list", {
          headers: { "x-cg-demo-api-key": apiKey },
        });
        const data = await res.json();

        // Take first 12 NFTs for display
        const first12 = data.slice(0, 12);

        // Map to include demo data for price, hype, image
        const mappedNFTs = first12.map((nft) => ({
          id: nft.id,
          name: nft.name || "Unknown NFT",
          image:
            nft.image || // fallback if exists
            `https://picsum.photos/300/300?random=${Math.floor(
              Math.random() * 1000
            )}`,
          price: generateRandomPrice(),
          supply: Math.floor(Math.random() * 1000),
          hype: generateRandomHype(),
        }));

        setNfts(mappedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading)
    return (
      <p className="text-center text-white text-xl mt-10">Loading NFTs...</p>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        🔥 NFT Marketplace
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer"
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-white truncate">
                {nft.name}
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                Price: {nft.price} ETH
              </p>
              <p className="text-sm text-gray-300 mt-1">Supply: {nft.supply}</p>
              <p className="text-sm text-green-400 mt-1">Hype: {nft.hype}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTMarketplace;
