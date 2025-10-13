import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getUserTrades, getOffers } from "../../services/api";
import NotificationCenter from "../notifications/NotificationCenter";

const Dashboard = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const [trades, setTrades] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrades: 0,
    totalVolume: 0,
    activeOffers: 0,
    successRate: 0
  });

  useEffect(() => {
    if (connected && publicKey) {
      fetchDashboardData();
    }
  }, [connected, publicKey]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch SOL balance
      const connection = new Connection(clusterApiUrl('devnet'));
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9);

      // Fetch user trades
      const tradesResponse = await getUserTrades(publicKey.toString());
      if (tradesResponse.success) {
        setTrades(tradesResponse.trades);
        
        // Calculate stats
        const totalTrades = tradesResponse.trades.length;
        const completedTrades = tradesResponse.trades.filter(t => t.status === 'completed').length;
        const totalVolume = tradesResponse.trades.reduce((sum, trade) => 
          sum + (trade.amount * (trade.offer?.price || 0)), 0
        );
        
        setStats({
          totalTrades,
          totalVolume,
          activeOffers: 0, // Will be fetched separately
          successRate: totalTrades > 0 ? (completedTrades / totalTrades) * 100 : 0
        });
      }

      // Fetch active offers
      const offersResponse = await getOffers({ status: 'active' });
      if (offersResponse.success) {
        setOffers(offersResponse.offers);
        setStats(prev => ({
          ...prev,
          activeOffers: offersResponse.offers.filter(o => 
            o.seller_wallet === publicKey.toString()
          ).length
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentTrades = trades.slice(0, 5);
  const recentOffers = offers.slice(0, 5);

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <p className="text-gray-400">Please connect your wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm">
              {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-4)}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">SOL Balance</p>
                <p className="text-2xl font-bold">{balance.toFixed(4)} SOL</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Trades</p>
                <p className="text-2xl font-bold">{stats.totalTrades}</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Volume (SOL)</p>
                <p className="text-2xl font-bold">{stats.totalVolume.toFixed(2)}</p>
              </div>
              <div className="text-3xl">💎</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trades */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
            <div className="space-y-3">
              {recentTrades.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No recent trades</p>
              ) : (
                recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        trade.status === 'completed' ? 'bg-green-500' :
                        trade.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">
                          {trade.buyer?.wallet_address === publicKey.toString() ? 'Buy' : 'Sell'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {trade.amount} {trade.offer?.crypto}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(trade.amount * (trade.offer?.price || 0)).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400 capitalize">
                        {trade.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <NotificationCenter />
          </div>
        </div>

        {/* Active Offers */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Your Active Offers</h3>
          <div className="space-y-3">
            {offers.filter(o => o.seller_wallet === publicKey.toString()).length === 0 ? (
              <p className="text-gray-400 text-center py-4">No active offers</p>
            ) : (
              offers
                .filter(o => o.seller_wallet === publicKey.toString())
                .slice(0, 5)
                .map((offer) => (
                  <div key={offer._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      <p className="text-sm text-gray-400">
                        {offer.amount} {offer.crypto}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${offer.price}</p>
                      <p className="text-sm text-gray-400">
                        {offer.payment_method}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <p className="font-medium">Create P2P Offer</p>
            </div>
          </button>
          
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <p className="font-medium">Launch Token</p>
            </div>
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🎨</div>
              <p className="font-medium">Mint NFT</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
