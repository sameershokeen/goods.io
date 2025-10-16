import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getUserTrades } from "../services/api";
import Wallet from "../components/wallet/Wallet";

const statusBadge = (st) => {
  if (st === 'completed') return 'bg-green-600 text-green-100';
  if (st === 'pending') return 'bg-yellow-600 text-yellow-100';
  return 'bg-red-600 text-red-100';
};

const WalletPage = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-[#151227] to-[#272940] text-white px-6 py-20 pl-22 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Wallet</h1>
          <p className="text-gray-300 text-lg mb-6">Please connect your wallet to view your balance and transactions.</p>
          <div className="flex justify-center mt-6">
            <Wallet />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#151227] to-[#272940] text-white px-6 py-20 pl-22 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-purple-400"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151227] to-[#272940] text-white px-6 py-20 pl-22">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-center">Wallet</h1>
        {/* Wallet Address */}
        <div className="bg-gradient-to-br from-[#373063] to-[#1d1c3d] rounded-xl p-7 shadow-lg border border-purple-700/[.2] flex flex-wrap items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-xl font-semibold mb-2">Wallet Address</h2>
            <p className="text-purple-300 font-mono text-base break-all">{publicKey?.toString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-300 font-semibold">Connected</span>
          </div>
        </div>
        {/* Balance + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-gradient-to-r from-blue-800 via-blue-600 to-purple-800 rounded-xl p-7 shadow-xl animate-fade-in">
            <h3 className="text-gray-300 text-sm mb-1 font-semibold">SOL Balance</h3>
            <p className="text-3xl font-extrabold">{balance.toFixed(4)} <span className="text-purple-200">SOL</span></p>
          </div>
          <div className="bg-gradient-to-r from-green-800 via-green-600 to-teal-800 rounded-xl p-7 shadow-xl animate-fade-in">
            <h3 className="text-gray-300 text-sm mb-1 font-semibold">USD Approx</h3>
            <p className="text-3xl font-bold">${(balance * 25).toFixed(2)}</p>
            <p className="text-xs text-gray-300 mt-1">*Approximate at $25/SOL</p>
          </div>
          <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-yellow-700 rounded-xl p-7 shadow-xl animate-fade-in">
            <h3 className="text-gray-300 text-sm mb-1 font-semibold">Total Trades</h3>
            <p className="text-3xl font-extrabold">{trades.length}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-purple-900/30 mb-8 animate-fade-in">
          <nav className="flex space-x-8">
            {['overview', 'trades', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-4 font-medium text-lg capitalize transition-all duration-150 "
                  ${activeTab === tab
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-purple-300'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        {/* Tab Content */}
        <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#292541] to-[#191724] rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {trades.slice(0, 5).map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg shadow-sm mb-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full "
                        ${statusBadge(trade.status)}`}></div>
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
                      <p className="font-bold">
                        {trade.amount} {trade.offer?.crypto}
                      </p>
                      <p className="text-xs text-gray-400">
                        ${(trade.amount * trade.offer?.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {trades.length === 0 && (
                  <p className="text-gray-400 text-center py-6">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'trades' && (
          <div className="bg-gradient-to-br from-[#292541] to-[#191724] rounded-xl p-7 shadow-lg">
            <h3 className="text-lg font-bold mb-5">Trade History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-purple-600">
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
                      <td className="py-3 px-4 text-sm">{formatDate(trade.createdAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded text-xs font-bold "+
                          ${trade.buyer?.wallet_address === publicKey.toString()
                            ? 'bg-blue-700 text-blue-100'
                            : 'bg-green-700 text-green-100'}`}>{trade.buyer?.wallet_address === publicKey.toString() ? 'Buy' : 'Sell'}</span>
                      </td>
                      <td className="py-3 px-4 font-bold">
                        {trade.amount} {trade.offer?.crypto}
                      </td>
                      <td className="py-3 px-4">${trade.offer?.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(trade.status)}`}>
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
          <div className="bg-gradient-to-br from-[#292541] to-[#191724] rounded-xl p-7 shadow-lg">
            <h3 className="text-lg font-bold mb-5">Transaction Activity</h3>
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
    </div>
  );
};

export default WalletPage;