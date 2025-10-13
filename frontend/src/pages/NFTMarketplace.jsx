import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import HeroSlider from "../components/nfts/Heroslider";
import TrendingNFTs from "../components/nfts/TrendingNFTs";
import NewLaunches from "../components/nfts/NewLanunches";
import CategorySlider from "../components/nfts/CategorySlider";
import NFTDisplay from "../components/nfts/NFTDisplay";

const NFTMarketplace = () => {
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const apiKey = "CG-9rkGCe7k2CjukH443SjLY9zz";
      const res = await fetch("https://api.coingecko.com/api/v3/nfts/list", {
        headers: { "x-cg-demo-api-key": apiKey },
      });
      const data = await res.json();
      const first20 = data.slice(0, 20);
      const mapped = first20.map((nft) => ({
        id: nft.id,
        name: nft.name || "Unknown NFT",
        image: `https://picsum.photos/300/300?random=${Math.floor(
          Math.random() * 1000
        )}`,
        price: (Math.random() * 5 + 0.1).toFixed(2),
        supply: Math.floor(Math.random() * 1000) + 1,
        hype: Math.floor(Math.random() * 100),
        owner: `Owner_${Math.floor(Math.random() * 1000)}`,
        description: "A unique digital collectible with special properties",
        rarity: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)],
        category: ['Art', 'Gaming', 'Music', 'Sports'][Math.floor(Math.random() * 4)]
      }));
      setNfts(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || nft.category === filterBy;
    return matchesSearch && matchesFilter;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'hype':
        return b.hype - a.hype;
      case 'supply':
        return a.supply - b.supply;
      default:
        return parseFloat(a.price) - parseFloat(b.price);
    }
  });

  const handleBuyNFT = (nft) => {
    if (!connected) {
      alert('Please connect your wallet to buy NFTs');
      return;
    }
    setSelectedNFT(nft);
    setShowBuyModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedNFT) return;
    
    // Simulate purchase
    alert(`Purchased ${selectedNFT.name} for ${selectedNFT.price} SOL!`);
    setShowBuyModal(false);
    setSelectedNFT(null);
  };

  const handleSellNFT = (nft) => {
    if (!connected) {
      alert('Please connect your wallet to sell NFTs');
      return;
    }
    alert(`List ${nft.name} for sale - This would open the sell modal`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2 text-gray-400">Loading NFTs...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">NFT Marketplace</h1>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Art">Art</option>
                <option value="Gaming">Gaming</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="price">Price (Low to High)</option>
                <option value="hype">Hype Score</option>
                <option value="supply">Supply</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wallet Status */}
        {!connected && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6">
            Connect your wallet to buy and sell NFTs
          </div>
        )}

        {/* Hero Section */}
        <HeroSlider />

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {sortedNFTs.map((nft) => (
            <div key={nft.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
              <div className="relative">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    nft.rarity === 'Legendary' ? 'bg-purple-600 text-purple-100' :
                    nft.rarity === 'Epic' ? 'bg-blue-600 text-blue-100' :
                    nft.rarity === 'Rare' ? 'bg-green-600 text-green-100' :
                    'bg-gray-600 text-gray-100'
                  }`}>
                    {nft.rarity}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {nft.hype}% hype
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-2 truncate">{nft.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{nft.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-gray-400 text-xs">Price</p>
                    <p className="font-bold text-lg">{nft.price} SOL</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Supply</p>
                    <p className="font-semibold">{nft.supply}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleBuyNFT(nft)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleSellNFT(nft)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Components */}
        <TrendingNFTs nfts={nfts} />
        <NewLaunches nfts={nfts} />
        <CategorySlider />
        <NFTDisplay nfts={nfts} />

        {/* Buy Modal */}
        {showBuyModal && selectedNFT && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
              <div className="space-y-4">
                <img src={selectedNFT.image} alt={selectedNFT.name} className="w-full h-48 object-cover rounded-lg" />
                <div>
                  <h4 className="font-semibold">{selectedNFT.name}</h4>
                  <p className="text-gray-400 text-sm">{selectedNFT.description}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span>Total Price:</span>
                  <span className="font-bold text-lg">{selectedNFT.price} SOL</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPurchase}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Confirm Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTMarketplace;
