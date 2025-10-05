import React, { useEffect, useState, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
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
          const connection = new Connection(
            clusterApiUrl(WalletAdapterNetwork.Devnet)
          );
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
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Wallet;
