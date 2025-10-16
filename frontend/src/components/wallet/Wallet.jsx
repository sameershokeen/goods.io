import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

// --- Component to show wallet button + balance ---
const WalletContent = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(clusterApiUrl('devnet'));
          const bal = await connection.getBalance(new PublicKey(publicKey));
          setBalance(bal / 1e9); // Lamports → SOL
        } catch (err) {
          console.error("Error fetching balance:", err);
        }
      }
    };
    fetchBalance();
  }, [publicKey]);

  return (
    <div className="flex items-center gap-3">
      <WalletMultiButton />
      {publicKey && (
        <span className="text-white text-sm bg-gray-700 px-3 py-1 rounded-lg">
          {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
        </span>
      )}
    </div>
  );
};

// --- Main Wallet Provider Component ---
const Wallet = () => {
  return (
    <WalletContent />
  );
};

export default Wallet;
