import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

const NotificationCenter = () => {
  const { publicKey, connected } = useWallet();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (connected && publicKey) {
      // Simulate notifications for demo
      const demoNotifications = [
        {
          id: 1,
          type: 'trade',
          title: 'Trade Completed',
          message: 'Your trade for 5 SOL has been completed successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          read: false
        },
        {
          id: 2,
          type: 'offer',
          title: 'New Offer Available',
          message: 'A new P2P offer for ETH is available at a great price',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false
        },
        {
          id: 3,
          type: 'launch',
          title: 'Token Launch',
          message: 'DeFi Protocol Token launch is starting in 1 hour',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          read: true
        },
        {
          id: 4,
          type: 'nft',
          title: 'NFT Purchase',
          message: 'You successfully purchased CyberPunk Warrior #1234',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true
        }
      ];
      setNotifications(demoNotifications);
      setUnreadCount(demoNotifications.filter(n => !n.read).length);
    }
  }, [connected, publicKey]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trade':
        return '💱';
      case 'offer':
        return '💰';
      case 'launch':
        return '🚀';
      case 'nft':
        return '🎨';
      default:
        return '🔔';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
            <button
              onClick={markAllAsRead}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Mark all read
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                notification.read 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-blue-900/30 hover:bg-blue-900/50 border-l-2 border-blue-500'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
