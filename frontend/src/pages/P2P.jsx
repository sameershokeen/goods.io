import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import OfferList from "../components/p2p/OfferList";
import CreateOfferForm from "../components/p2p/CreateOfferForm";
import SearchFilter from "../components/p2p/SearchFilter";
import { getOffers, createOffer, createTrade } from "../services/api";
import ChatSystem from "../components/chat/ChatSystem";

const P2P = () => {
  const { publicKey, connected } = useWallet();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    asset: "",
    type: "",
    sort: "",
  });

  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const loaderRef = useRef(null);

  // Fetch offers from backend
  useEffect(() => {
    fetchOffers();
  }, [filters.asset]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOffers({ 
        crypto: filters.asset || undefined,
        status: "active" 
      });
      
      if (response.success) {
        // Transform backend data to match frontend format
        const transformedOffers = response.offers.map(offer => ({
          id: offer._id,
          type: "Sell", // All backend offers are sell orders for now
          asset: offer.crypto,
          amount: offer.amount.toString(),
          price: offer.price.toString(),
          user: offer.seller_wallet.slice(0, 8) + "...",
          seller_wallet: offer.seller_wallet,
          payment_method: offer.payment_method,
          title: offer.title,
          created_at: offer.created_at
        }));
        setOffers(transformedOffers);
      } else {
        setError("Failed to fetch offers");
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Error loading offers");
    } finally {
      setLoading(false);
    }
  };

  const addOffer = async (offerData) => {
    try {
      if (!connected || !publicKey) {
        setError("Please connect your wallet to create an offer");
        return;
      }

      const userWallet = publicKey.toString();
      
      const newOffer = {
        title: offerData.title || `Sell ${offerData.amount} ${offerData.asset}`,
        crypto: offerData.asset,
        price: parseFloat(offerData.price),
        amount: parseFloat(offerData.amount),
        seller_wallet: userWallet,
        payment_method: offerData.payment_method || "Bank Transfer"
      };

      const response = await createOffer(newOffer);
      
      if (response.success) {
        // Transform and add to local state
        const transformedOffer = {
          id: response.offer._id,
          type: "Sell",
          asset: response.offer.crypto,
          amount: response.offer.amount.toString(),
          price: response.offer.price.toString(),
          user: response.offer.seller_wallet.slice(0, 8) + "...",
          seller_wallet: response.offer.seller_wallet,
          payment_method: response.offer.payment_method,
          title: response.offer.title,
          created_at: response.offer.created_at
        };
        setOffers([transformedOffer, ...offers]);
      } else {
        setError("Failed to create offer");
      }
    } catch (err) {
      console.error("Error creating offer:", err);
      setError("Error creating offer");
    }
  };

  const handleTrade = async (offer) => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet to start a trade");
      return;
    }

    if (offer.seller_wallet === publicKey.toString()) {
      setError("Cannot trade with yourself");
      return;
    }

    try {
      const tradeData = {
        offerId: offer.id,
        buyer_wallet: publicKey.toString()
      };

      const response = await createTrade(tradeData);
      
      if (response.success) {
        setError(null);
        setSelectedTrade({
          id: response.trade._id,
          offer: offer,
          otherUser: { 
            wallet_address: offer.seller_wallet,
            username: offer.user 
          }
        });
        alert(`Trade started successfully! Trade ID: ${response.trade._id}`);
        // Refresh offers to show updated status
        fetchOffers();
      } else {
        setError(response.message || "Failed to start trade");
      }
    } catch (err) {
      console.error("Error starting trade:", err);
      setError("Error starting trade");
    }
  };

  // ✅ Filtering
  let filteredOffers = offers.filter((offer) => {
    return (
      (filters.asset ? offer.asset === filters.asset : true) &&
      (filters.type ? offer.type === filters.type : true) &&
      (filters.search
        ? offer.user.toLowerCase().includes(filters.search.toLowerCase())
        : true)
    );
  });

  // ✅ Sorting
  if (filters.sort === "priceLow") {
    filteredOffers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (filters.sort === "priceHigh") {
    filteredOffers.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (filters.sort === "amountHigh") {
    filteredOffers.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  } else if (filters.sort === "amountLow") {
    filteredOffers.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
  }

  // ✅ Offers visible on screen
  const currentOffers = filteredOffers.slice(0, visibleCount);

  // ✅ Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 4); // load next 4
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151227] to-[#272940] text-white px-6 py-20 pl-22">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">P2P Trading</h1>
        <div className="flex items-center gap-4">
          {connected ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-md font-mono text-green-200">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-4)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-md text-gray-400">Wallet not connected</span>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="bg-red-700/80 p-3 rounded text-center text-white mb-4 animate-pulse border border-red-900">{error}</div>
      )}
      <div className="mb-8">
        <SearchFilter filters={filters} setFilters={setFilters}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-purple-400"></div>
              <p className="mt-4 text-gray-400 text-lg">Loading offers...</p>
            </div>
          ) : (
            <>
              <OfferList offers={currentOffers} onTrade={handleTrade} modern/>
              <div ref={loaderRef} className="flex justify-center py-8">
                {visibleCount < filteredOffers.length ? (
                  <span className="text-purple-400/80">Loading more offers...</span>
                ) : (
                  <span className="text-gray-500">No more offers</span>
                )}
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <CreateOfferForm addOffer={addOffer} modern/>
          </div>
        </div>
      </div>
      {selectedTrade && (
        <ChatSystem tradeId={selectedTrade.id} otherUser={selectedTrade.otherUser} />
      )}
    </div>
  );
};
export default P2P;
