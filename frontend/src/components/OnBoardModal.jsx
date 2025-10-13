import React, { useState } from "react";
import { updateUserProfile } from "../services/api";

const OnboardModal = ({ walletAddress, onComplete }) => {
  const [username, setUsername] = useState("");
  const [telegram, setTelegram] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(walletAddress, {
      username,
      telegram: { username: telegram, verified: false },
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-[#1A1B1E] p-6 rounded-lg text-white">
        <h2 className="text-xl mb-4">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="bg-[#2B2C30] px-3 py-2 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="bg-[#2B2C30] px-3 py-2 rounded"
            placeholder="Telegram Username"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
          <button className="bg-purple-600 px-3 py-2 rounded mt-2">Save</button>
        </form>
      </div>
    </div>
  );
};

export default OnboardModal;
