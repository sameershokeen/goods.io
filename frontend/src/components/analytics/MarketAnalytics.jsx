import React, { useState, useEffect } from 'react';

const MarketAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalVolume: 0,
    activeUsers: 0,
    totalTrades: 0,
    averagePrice: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalytics({
          totalVolume: 1250000,
          activeUsers: 2450,
          totalTrades: 15420,
          averagePrice: 25.67
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Market Analytics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {formatNumber(analytics.totalVolume)}
          </div>
          <div className="text-sm text-gray-400">Total Volume (SOL)</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {formatNumber(analytics.activeUsers)}
          </div>
          <div className="text-sm text-gray-400">Active Users</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {formatNumber(analytics.totalTrades)}
          </div>
          <div className="text-sm text-gray-400">Total Trades</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            ${analytics.averagePrice.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Avg Price</div>
        </div>
      </div>

      {/* Price Chart Placeholder */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Price Trend (24h)</h4>
        <div className="bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
          <div className="text-gray-400 text-sm">
            📈 Price chart would be displayed here
          </div>
        </div>
      </div>

      {/* Top Traders */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Top Traders</h4>
        <div className="space-y-2">
          {[
            { rank: 1, name: 'CryptoKing', volume: '12.5K SOL', trades: 156 },
            { rank: 2, name: 'DeFiMaster', volume: '8.9K SOL', trades: 134 },
            { rank: 3, name: 'NFTCollector', volume: '7.2K SOL', trades: 98 }
          ].map((trader) => (
            <div key={trader.rank} className="flex items-center justify-between p-2 bg-gray-700 rounded">
              <div className="flex items-center gap-3">
                <span className="text-lg">#{trader.rank}</span>
                <span className="font-medium">{trader.name}</span>
              </div>
              <div className="text-right text-sm">
                <div className="text-gray-300">{trader.volume}</div>
                <div className="text-gray-400">{trader.trades} trades</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalytics;
