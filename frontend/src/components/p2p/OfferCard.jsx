import React from "react";

const OfferCard = ({ offer, onTrade }) => {
  const badgeColors = offer.type === "Buy"
    ? "bg-green-700 text-green-100"
    : "bg-purple-700 text-purple-100";
  return (
    <div className="bg-gradient-to-br from-[#232038] to-[#191724] border border-purple-800/[.40] rounded-2xl p-6 flex flex-col gap-2 shadow-lg hover:scale-[1.025] transition-all duration-200 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColors}`}>{offer.type}</span>
          <span>{offer.asset}</span>
        </h2>
        <span className="text-xs font-mono text-gray-400">By {offer.user}</span>
      </div>
      <div className="flex flex-wrap gap-4 items-center mt-1">
        <div>
          <div className="text-[13px] text-gray-400 uppercase">Price</div>
          <div className="text-lg font-extrabold text-purple-200">{offer.price} USDT</div>
        </div>
        <div>
          <div className="text-[13px] text-gray-400 uppercase">Amount</div>
          <div className="text-lg font-extrabold text-green-300">{offer.amount} {offer.asset}</div>
        </div>
      </div>
      <button
        onClick={() => onTrade(offer)}
        className="mt-4 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 px-5 py-2 rounded-lg font-bold text-white shadow-md transition-all"
      >
        {offer.type === "Buy" ? "Sell to Buyer" : "Buy from Seller"}
      </button>
    </div>
  );
};
export default OfferCard;
