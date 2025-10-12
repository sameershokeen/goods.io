// src/components/WalletConnect.js

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { registerUser, getUser } from "./api";

const WalletConnect = () => {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleUser = async () => {
      if (publicKey) {
        const walletAddress = publicKey.toString();
        const existingUser = await getUser(walletAddress);
        if (!existingUser) {
          await registerUser(walletAddress);
        }
        setUser(existingUser || { wallet_address: walletAddress });
      }
    };

    if (connected) {
      handleUser();
    }
  }, [publicKey, connected]);

  return (
    <div>
      {user ? (
        <p>Welcome, {user.username || "New User"}!</p>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
};

export default WalletConnect;
