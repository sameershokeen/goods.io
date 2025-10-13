import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { getUser, updateUserProfile } from "../services/api";

const Profile = () => {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    contact: {
      email: '',
      phone: ''
    },
    telegram: {
      username: ''
    }
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserProfile();
    }
  }, [connected, publicKey]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUser(publicKey.toString());
      if (response) {
        setUser(response);
        setFormData({
          username: response.username || '',
          contact: {
            email: response.contact?.email || '',
            phone: response.contact?.phone || ''
          },
          telegram: {
            username: response.telegram?.username || ''
          }
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await updateUserProfile(publicKey.toString(), formData);
      
      if (response.success) {
        setUser(response.user);
        setEditing(false);
        setSuccess('Profile updated successfully!');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <p className="text-gray-400">Please connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Wallet Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Address:</span>
              <span className="ml-2 font-mono">{publicKey?.toString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="ml-2 text-green-400">Connected</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      username: user.username || '',
                      contact: {
                        email: user.contact?.email || '',
                        phone: user.contact?.phone || ''
                      },
                      telegram: {
                        username: user.telegram?.username || ''
                      }
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-400 mb-2">Username</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter username"
                />
              ) : (
                <p className="text-white">{user?.username || 'Not set'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter email"
                />
              ) : (
                <p className="text-white">{user?.contact?.email || 'Not set'}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-400 mb-2">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-white">{user?.contact?.phone || 'Not set'}</p>
              )}
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-gray-400 mb-2">Telegram Username</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.telegram.username}
                  onChange={(e) => handleInputChange('telegram.username', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter Telegram username"
                />
              ) : (
                <p className="text-white">{user?.telegram?.username || 'Not set'}</p>
              )}
            </div>

            {/* KYC Status */}
            <div>
              <label className="block text-gray-400 mb-2">KYC Status</label>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user?.kyc_status === 'verified' ? 'bg-green-600 text-green-100' :
                  user?.kyc_status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-red-600 text-red-100'
                }`}>
                  {user?.kyc_status || 'pending'}
                </span>
                {user?.kyc_status !== 'verified' && (
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Complete KYC
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;