import React from "react";
import OfferCard from "./offerCard";

const OfferList = ({ offers, onTrade }) => {
  return (
    <div className="grid gap-4 ">
      {offers.length > 0 ? (
        offers.map((offer, idx) => (
          <OfferCard key={idx} offer={offer} onTrade={onTrade} />
        ))
      ) : (
        <p className="text-gray-400">No offers available yet.</p>
      )}
    </div>
  );
};

export default OfferList;
