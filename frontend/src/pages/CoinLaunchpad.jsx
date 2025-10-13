import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

const CoinLaunchpad = () => {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState('launch');
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    totalSupply: '',
    pricePerToken: '',
    softCap: '',
    hardCap: '',
    logo: null,
    whitepaper: null
  });

  const upcomingLaunches = [
    {
      id: 1,
      name: "DeFi Protocol Token",
      symbol: "DFP",
      description: "Revolutionary DeFi protocol for yield farming",
      price: "0.1",
      softCap: "100000",
      hardCap: "500000",
      progress: 65,
      launchDate: "2024-01-18",
      logo: "https://picsum.photos/100/100?random=10"
    },
    {
      id: 2,
      name: "Gaming Ecosystem Coin",
      symbol: "GEC",
      description: "Utility token for the next-gen gaming platform",
      price: "0.05",
      softCap: "200000",
      hardCap: "1000000",
      progress: 42,
      launchDate: "2024-01-22",
      logo: "https://picsum.photos/100/100?random=11"
    },
    {
      id: 3,
      name: "AI Trading Bot Token",
      symbol: "AIB",
      description: "Token for AI-powered trading automation",
      price: "0.25",
      softCap: "50000",
      hardCap: "250000",
      progress: 88,
      launchDate: "2024-01-28",
      logo: "https://picsum.photos/100/100?random=12"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' || name === 'whitepaper') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLaunch = (e) => {
    e.preventDefault();
    if (!connected) {
      alert('Please connect your wallet to launch a token');
      return;
    }
    alert('Token launch initiated successfully! (This would integrate with blockchain)');
    setFormData({
      name: '',
      symbol: '',
      description: '',
      totalSupply: '',
      pricePerToken: '',
      softCap: '',
      hardCap: '',
      logo: null,
      whitepaper: null
    });
  };

  const handleInvest = (launch) => {
    if (!connected) {
      alert('Please connect your wallet to invest');
      return;
    }
    alert(`Invest in ${launch.name} (${launch.symbol})`);
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Coin Launchpad</h1>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['launch', 'upcoming', 'launched'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'launch' && (
          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Launch Your Token</h2>
            
            {!connected && (
              <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6">
                Connect your wallet to launch a token
              </div>
            )}

            <form onSubmit={handleLaunch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Token Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter token name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Token Symbol</label>
                  <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g., BTC, ETH"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Describe your token and its utility"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Total Supply</label>
                  <input
                    type="number"
                    name="totalSupply"
                    value={formData.totalSupply}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="1000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Price per Token (SOL)</label>
                  <input
                    type="number"
                    name="pricePerToken"
                    value={formData.pricePerToken}
                    onChange={handleInputChange}
                    step="0.001"
                    min="0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Soft Cap (SOL)</label>
                  <input
                    type="number"
                    name="softCap"
                    value={formData.softCap}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Hard Cap (SOL)</label>
                <input
                  type="number"
                  name="hardCap"
                  value={formData.hardCap}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="1000"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Token Logo</label>
                  <input
                    type="file"
                    name="logo"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Whitepaper (PDF)</label>
                  <input
                    type="file"
                    name="whitepaper"
                    onChange={handleInputChange}
                    accept=".pdf"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Launch Token
              </button>
            </form>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Upcoming Token Launches</h2>
            <div className="space-y-6">
              {upcomingLaunches.map((launch) => (
                <div key={launch.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start gap-6">
                    <img src={launch.logo} alt={launch.name} className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl">{launch.name}</h3>
                        <span className="bg-blue-600 text-blue-100 px-2 py-1 rounded text-xs font-medium">
                          {launch.symbol}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">{launch.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Price</p>
                          <p className="font-semibold">{launch.price} SOL</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Soft Cap</p>
                          <p className="font-semibold">{launch.softCap} SOL</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Hard Cap</p>
                          <p className="font-semibold">{launch.hardCap} SOL</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Launch Date</p>
                          <p className="font-semibold">{launch.launchDate}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">Progress</span>
                          <span className="text-gray-400 text-sm">{launch.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${launch.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInvest(launch)}
                        className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors"
                      >
                        Invest Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'launched' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Successfully Launched Tokens</h2>
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No launched tokens yet</p>
              <p className="text-gray-500 text-sm mt-2">Launch your first token to see it here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinLaunchpad;