import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { registerUser, getUser } from "./api";
import OnboardModal from "../components/OnBoardModal"
import Wallet from "../components/wallet/Wallet";

const WalletConnect = () => {
const { publicKey, connected, disconnect } = useWallet();
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [showOnboard, setShowOnboard] = useState(false);

// Fetch user profile on wallet connect
useEffect(() => {
  const handleUser = async () => {
    setLoading(true);
    setError(null);
    try {
      if (publicKey) {
        const walletAddress = publicKey.toString();
        let existingUser = await getUser(walletAddress);
        if (!existingUser) {
          await registerUser(walletAddress);
          existingUser = await getUser(walletAddress); // Fetch again
        }
        setUser(existingUser || { wallet_address: walletAddress });

        // Show onboarding modal if profile is incomplete
        if (
          !existingUser ||
          !existingUser.username ||
          !existingUser.telegram
        ) {
          setShowOnboard(true);
        } else {
          setShowOnboard(false);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setError("Failed to connect or register user.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (connected) {
    handleUser();
  } else {
    setUser(null);
    setShowOnboard(false);
  }
}, [publicKey, connected]);

// Refetch user after onboarding completed


return (
  <div>
    {loading && <p>Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}

    {/* Show custom welcome (with disconnect) when connected and user fetched */}
    {!loading && !error && connected && user && (
      <div className="flex flex-col items-center gap-2 bg-gray-900 px-4 py-3 rounded-lg">
      
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    )}

    {/* Show connect button (default) if NOT connected */}
    {!loading && !error && !connected && (
      <Wallet/>
    )}
    {/* (Optionally) fallback: show connect again if no user */}
    {/* {!loading && !error && !user && !connected && (
      <Wallet/>
    )} */}

    {showOnboard && user && (
      <OnboardModal
        walletAddress={user.wallet_address}
        onComplete={handleOnboardComplete}
      />
    )}
  </div>
);
};

export default WalletConnect;
 