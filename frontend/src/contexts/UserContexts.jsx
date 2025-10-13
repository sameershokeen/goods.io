import React, { createContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getUser, registerUser } from "../services/api";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      if (connected && publicKey) {
        const addr = publicKey.toString();
        let existing = await getUser(addr);
        if (!existing) {
          existing = await registerUser(addr);
        }
        setUser(existing);
      }
      setLoading(false);
    };
    initUser();
  }, [publicKey, connected]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
