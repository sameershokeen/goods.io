import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getUserTrades } from "../services/api";

const Wallet = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (connected && publicKey) {
      fetchWalletData();
    }
  }, [connected, publicKey]);

  const fetchWalletData = async () => {
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
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Wallet</h1>
          <p className="text-gray-400">Please connect your wallet to view your balance and transactions.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2 text-gray-400">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wallet</h1>

        {/* Wallet Address */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Wallet Address</h2>
              <p className="text-gray-300 font-mono">{publicKey?.toString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6">
            <h3 className="text-gray-300 text-sm mb-2">SOL Balance</h3>
            <p className="text-3xl font-bold">{balance.toFixed(4)} SOL</p>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6">
            <h3 className="text-gray-300 text-sm mb-2">USD Value</h3>
            <p className="text-3xl font-bold">${(balance * 25).toFixed(2)}</p>
            <p className="text-xs text-gray-300 mt-1">*Approximate at $25/SOL</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6">
            <h3 className="text-gray-300 text-sm mb-2">Total Trades</h3>
            <p className="text-3xl font-bold">{trades.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {['overview', 'trades', 'activity'].map((tab) => (
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {trades.slice(0, 5).map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        trade.status === 'completed' ? 'bg-green-500' :
                        trade.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">
                          {trade.status === 'completed' ? 'Trade Completed' :
                           trade.status === 'pending' ? 'Trade Pending' :
                           'Trade Cancelled'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatDate(trade.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {trade.amount} {trade.offer?.crypto}
                      </p>
                      <p className="text-sm text-gray-400">
                        ${(trade.amount * trade.offer?.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {trades.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Trade History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-3 px-4 text-sm">
                        {formatDate(trade.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          trade.buyer?.wallet_address === publicKey.toString()
                            ? 'bg-blue-600 text-blue-100'
                            : 'bg-green-600 text-green-100'
                        }`}>
                          {trade.buyer?.wallet_address === publicKey.toString() ? 'Buy' : 'Sell'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {trade.amount} {trade.offer?.crypto}
                      </td>
                      <td className="py-3 px-4">
                        ${trade.offer?.price}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          trade.status === 'completed' ? 'bg-green-600 text-green-100' :
                          trade.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                          'bg-red-600 text-red-100'
                        }`}>
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {trades.length === 0 && (
                <p className="text-gray-400 text-center py-8">No trades found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Activity</h3>
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Transaction history will be displayed here</p>
              <p className="text-sm text-gray-500">
                This feature requires integration with Solana blockchain explorer
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;