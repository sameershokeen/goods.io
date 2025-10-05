import React, { useState, useEffect, useRef } from "react";
import OfferList from "../components/p2p/OfferList";
import CreateOfferForm from "../components/p2p/CreateOfferForm";
import SearchFilter from "../components/p2p/SearchFilter";

const P2P = () => {
  const [offers, setOffers] = useState([
    { type: "Sell", asset: "SOL", amount: "5", price: "25", user: "Alice" },
    { type: "Buy", asset: "ETH", amount: "2", price: "1800", user: "Bob" },
    { type: "Sell", asset: "USDT", amount: "100", price: "1", user: "Charlie" },
    { type: "Buy", asset: "SOL", amount: "10", price: "24", user: "David" },
    { type: "Sell", asset: "SOL", amount: "20", price: "23", user: "Eve" },
    { type: "Buy", asset: "ETH", amount: "5", price: "1850", user: "Frank" },
    { type: "Sell", asset: "USDT", amount: "250", price: "1", user: "Grace" },
    { type: "Buy", asset: "SOL", amount: "15", price: "22", user: "Hannah" },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    asset: "",
    type: "",
    sort: "",
  });

  const [visibleCount, setVisibleCount] = useState(4);
  const loaderRef = useRef(null);

  const addOffer = (offer) => {
    setOffers([...offers, offer]);
  };

  const handleTrade = (offer) => {
    alert(
      `Trading with ${offer.user} - ${offer.amount} ${offer.asset} @ ${offer.price} USDT`
    );
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
    <div className="min-h-screen bg-[#0F0F10] text-white px-6 py-20 pl-22">
      <h1 className="text-3xl font-bold mb-6">P2P Trading</h1>

      {/* Filters + Sorting */}
      <SearchFilter filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Offers */}
        <div className="lg:col-span-2">
          <OfferList offers={currentOffers} onTrade={handleTrade} />

          {/* Loader for Infinite Scroll */}
          <div ref={loaderRef} className="flex justify-center py-6">
            {visibleCount < filteredOffers.length ? (
              <span className="text-gray-400">Loading more offers...</span>
            ) : (
              <span className="text-gray-500">No more offers</span>
            )}
          </div>
        </div>

        {/* Right: Create Offer */}
        <div className="lg:col-span-1">
          <CreateOfferForm addOffer={addOffer} />
        </div>
      </div>
    </div>
  );
};

export default P2P;
