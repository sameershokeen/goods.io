import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

const CoinMarketplace = () => {
  const { publicKey, connected } = useWallet();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'gainers' && coin.price_change_percentage_24h > 0) ||
                         (filterBy === 'losers' && coin.price_change_percentage_24h < 0);
    return matchesSearch && matchesFilter;
  });

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.current_price - a.current_price;
      case 'change':
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      case 'volume':
        return b.total_volume - a.total_volume;
      default:
        return b.market_cap - a.market_cap;
    }
  });

  const handleTrade = (coin, type) => {
    if (!connected) {
      alert('Please connect your wallet to trade');
      return;
    }
    alert(`${type} ${coin.symbol.toUpperCase()} - This would initiate a trade`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2 text-gray-400">Loading coins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Coin Marketplace</h1>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search coins..."
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
                <option value="all">All Coins</option>
                <option value="gainers">Gainers</option>
                <option value="losers">Losers</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="market_cap">Market Cap</option>
                <option value="price">Price</option>
                <option value="change">24h Change</option>
                <option value="volume">Volume</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wallet Status */}
        {!connected && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6">
            Connect your wallet to start trading cryptocurrencies
          </div>
        )}

        {/* Coins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCoins.map((coin) => (
            <div key={coin.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <h3 className="font-semibold">{coin.name}</h3>
                    <p className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">#{coin.market_cap_rank}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="font-semibold">${coin.current_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Change:</span>
                  <span className={`font-semibold ${
                    coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="font-semibold">${(coin.market_cap / 1e9).toFixed(2)}B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume:</span>
                  <span className="font-semibold">${(coin.total_volume / 1e6).toFixed(2)}M</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleTrade(coin, 'Buy')}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Buy
                </button>
                <button
                  onClick={() => handleTrade(coin, 'Sell')}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedCoins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No coins found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinMarketplace;