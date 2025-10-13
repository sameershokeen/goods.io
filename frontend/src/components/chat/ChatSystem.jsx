import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

const ChatSystem = ({ tradeId, otherUser }) => {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Demo messages
  useEffect(() => {
    if (tradeId) {
      const demoMessages = [
        {
          id: 1,
          sender: otherUser?.wallet_address || 'other_user',
          message: 'Hi! I\'m interested in your offer. Is it still available?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isOwn: false
        },
        {
          id: 2,
          sender: publicKey?.toString() || 'current_user',
          message: 'Yes, it\'s still available. How many would you like to buy?',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          isOwn: true
        },
        {
          id: 3,
          sender: otherUser?.wallet_address || 'other_user',
          message: 'I\'d like to buy 5 SOL worth. Can we negotiate the price?',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          isOwn: false
        },
        {
          id: 4,
          sender: publicKey?.toString() || 'current_user',
          message: 'Sure! I can offer you a 2% discount for that amount. Does $24.50 per SOL work?',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          isOwn: true
        },
        {
          id: 5,
          sender: otherUser?.wallet_address || 'other_user',
          message: 'That sounds fair. How do you prefer payment?',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          isOwn: false
        }
      ];
      setMessages(demoMessages);
    }
  }, [tradeId, otherUser, publicKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: publicKey?.toString() || 'current_user',
      message: newMessage.trim(),
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        'That sounds good to me!',
        'Let me think about that offer.',
        'Can you provide more details?',
        'I\'m ready to proceed with the trade.',
        'What payment method do you prefer?'
      ];
      
      const response = {
        id: messages.length + 2,
        sender: otherUser?.wallet_address || 'other_user',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isOwn: false
      };

      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">
              {otherUser?.username?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">
              {otherUser?.username || 'Trader'}
            </p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.isOwn ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSystem;
