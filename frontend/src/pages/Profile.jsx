import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { getUser } from "../services/api";
import Dashboard from '../components/dashboard/Dashboard';

const badgeColor = (status) => {
  switch (status) {
    case 'verified': return 'bg-green-600 text-green-100';
    case 'pending': return 'bg-yellow-600 text-yellow-100';
    case 'rejected': return 'bg-red-600 text-red-100';
    default: return 'bg-gray-500 text-white';
  }
};

const Profile = () => {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [kycUploading, setKycUploading] = useState(false);

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
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStartKYC = async (e) => {
    e.preventDefault();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,image/*';
    fileInput.onchange = async (e) => {
      if (!e.target.files[0]) return;
      setKycUploading(true);
      const formData = new FormData();
      formData.append('wallet_address', publicKey.toString());
      formData.append('kyc_file', e.target.files[0]);
      try {
        const res = await fetch(`/api/users/kyc`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setSuccess('KYC submitted!');
          fetchUserProfile();
        } else {
          setError(data.message || 'KYC failed');
        }
      } catch (err) {
        setError('Error uploading KYC');
      } finally {
        setKycUploading(false);
      }
    };
    fileInput.click();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#151227] to-[#272940] text-white px-6 py-20 pl-22 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 tracking-tight">Profile</h1>
          <p className="text-gray-300 text-lg">Please connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#151227] to-[#272940] text-white px-6 py-20 pl-22 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-purple-400"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151227] to-[#272940] text-white px-6 py-20 pl-22">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-center">Profile</h1>
        {error && <div className="bg-red-700/80 p-3 rounded text-center text-white mb-4 animate-pulse">{error}</div>}
        {success && <div className="bg-green-700/80 p-3 rounded text-center text-white mb-4 animate-pulse">{success}</div>}
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[#373063] to-[#1d1c3d] rounded-xl p-8 shadow-lg border border-purple-700/[.2] transition-all animate-fade-in">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              <div className="text-lg md:text-2xl font-bold mb-1">{user?.username || '-'}</div>
              <div className="font-mono text-purple-300 break-all text-sm">{user?.wallet_address || '-'}</div>
            </div>
            <div className="text-right">
              <span className="text-base text-gray-300">KYC Status:</span><br />
              <span className={`inline-block rounded-full px-3 py-1 mt-1 text-sm font-semibold ${badgeColor(user?.kyc_status)}`}>
                {user?.kyc_status || 'N/A'}
              </span>
            </div>
          </div>
          <div className="mt-7 border-t border-purple-900/30 pt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div><span className="block text-xs text-gray-400">Email</span><span className="text-base">{user?.contact?.email || '-'}</span></div>
            <div><span className="block text-xs text-gray-400">Phone</span><span className="text-base">{user?.contact?.phone || '-'}</span></div>
            <div><span className="block text-xs text-gray-400">Telegram</span><span className="text-base">{user?.telegram?.username || '-'}</span></div>
          </div>
        </div>
        {/* KYC Section */}
        <div className="bg-gradient-to-br from-[#332b53] to-[#281f42] rounded-xl p-8 shadow-lg border border-purple-800/[.22] mt-8 flex flex-col items-center transition-all animate-fade-in">
          <h2 className="text-2xl font-semibold mb-3 tracking-tight">Verify your Identity (KYC)</h2>
          <div className="mb-4">
            <span className={`inline-block rounded-full px-4 py-1 text-base font-medium ${badgeColor(user?.kyc_status)}`}>{user?.kyc_status}</span>
          </div>
          {user?.kyc_status !== 'verified' && (
            <button
              disabled={kycUploading}
              onClick={handleStartKYC}
              className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 disabled:opacity-60 px-6 py-3 rounded-lg text-lg font-bold shadow-lg mt-4 transition"
            >
              {kycUploading ? 'Uploading KYC...' : 'Upload KYC Document'}
            </button>
          )}
          {user?.kyc_file_url && (
            <div className="mt-5 text-center text-xs text-gray-400">
              KYC file uploaded: <span className="underline break-all">{user.kyc_file_url}</span>
            </div>
          )}
        </div>
      </div>
      <Dashboard />
    </div>
    

  );
};

export default Profile;