import React from "react";

const OfferCard = ({ offer, onTrade }) => {
  return (
    <div className="bg-[#1A1B1F] border border-gray-700 rounded-xl p-4  flex flex-col gap-3 hover:shadow-lg transition ">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {offer.type} {offer.asset}
        </h2>
        <span className="text-sm text-gray-400">By {offer.user}</span>
      </div>

      <p className="text-sm">
        Price: <span className="font-bold">{offer.price} USDT</span>
      </p>
      <p className="text-sm">
        Amount:{" "}
        <span className="font-bold">
          {offer.amount} {offer.asset}
        </span>
      </p>

      <button
        onClick={() => onTrade(offer)}
        className="mt-2 bg-purple-600 hover:bg-purple-500 transition px-4 py-2 rounded-lg font-medium text-white"
      >
        {offer.type === "Buy" ? "Sell to Buyer" : "Buy from Seller"}
      </button>
    </div>
  );
};

export default OfferCard;
