import React from "react";

const SearchFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#1A1B1F] border border-gray-700 rounded-xl p-4 flex flex-col lg:flex-row items-center gap-4 mb-6">
      {/* Search by Username */}
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by username..."
        className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white flex-1"
      />

      {/* Filter by Asset */}
      <select
        name="asset"
        value={filters.asset}
        onChange={handleChange}
        className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white"
      >
        <option value="">All Assets</option>
        <option value="SOL">SOL</option>
        <option value="USDT">USDT</option>
        <option value="ETH">ETH</option>
      </select>

      {/* Filter by Type */}
      <select
        name="type"
        value={filters.type}
        onChange={handleChange}
        className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white"
      >
        <option value="">All Types</option>
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
      </select>

      {/* Sort Dropdown */}
      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white"
      >
        <option value="">Sort By</option>
        <option value="priceLow">Price: Low → High</option>
        <option value="priceHigh">Price: High → Low</option>
        <option value="amountHigh">Amount: High → Low</option>
        <option value="amountLow">Amount: Low → High</option>
      </select>
    </div>
  );
};

export default SearchFilter;
