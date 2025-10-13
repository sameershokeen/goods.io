import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

const NFTLaunchpad = () => {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState('launch');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    supply: '',
    category: '',
    image: null
  });

  const upcomingLaunches = [
    {
      id: 1,
      name: "CyberPunk Warriors",
      description: "Futuristic NFT collection with unique traits",
      price: "0.5",
      supply: "1000",
      launchDate: "2024-01-15",
      image: "https://picsum.photos/300/300?random=1",
      category: "Gaming"
    },
    {
      id: 2,
      name: "Digital Art Masters",
      description: "Exclusive art collection by renowned artists",
      price: "2.0",
      supply: "500",
      launchDate: "2024-01-20",
      image: "https://picsum.photos/300/300?random=2",
      category: "Art"
    },
    {
      id: 3,
      name: "Music Legends",
      description: "NFTs featuring iconic music moments",
      price: "1.5",
      supply: "750",
      launchDate: "2024-01-25",
      image: "https://picsum.photos/300/300?random=3",
      category: "Music"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLaunch = (e) => {
    e.preventDefault();
    if (!connected) {
      alert('Please connect your wallet to launch an NFT collection');
      return;
    }
    alert('NFT Collection launched successfully! (This would integrate with blockchain)');
    setFormData({
      name: '',
      description: '',
      price: '',
      supply: '',
      category: '',
      image: null
    });
  };

  const handleJoinLaunch = (launch) => {
    if (!connected) {
      alert('Please connect your wallet to join the launch');
      return;
    }
    alert(`Joined launch for ${launch.name}!`);
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">NFT Launchpad</h1>

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
            <h2 className="text-2xl font-bold mb-6">Launch Your NFT Collection</h2>
            
            {!connected && (
              <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6">
                Connect your wallet to launch an NFT collection
              </div>
            )}

            <form onSubmit={handleLaunch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Collection Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter collection name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Art">Art</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Utility">Utility</option>
                  </select>
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
                  placeholder="Describe your NFT collection"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Price per NFT (SOL)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Total Supply</label>
                  <input
                    type="number"
                    name="supply"
                    value={formData.supply}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="1000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Collection Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Launch Collection
              </button>
            </form>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Upcoming Launches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingLaunches.map((launch) => (
                <div key={launch.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <img src={launch.image} alt={launch.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{launch.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{launch.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="font-semibold">{launch.price} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Supply:</span>
                        <span className="font-semibold">{launch.supply}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Launch:</span>
                        <span className="font-semibold">{launch.launchDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinLaunch(launch)}
                      className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Join Launch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'launched' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Successfully Launched Collections</h2>
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No launched collections yet</p>
              <p className="text-gray-500 text-sm mt-2">Launch your first collection to see it here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTLaunchpad;