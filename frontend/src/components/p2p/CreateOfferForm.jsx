import React, { useState } from "react";

const CreateOfferForm = ({ addOffer }) => {
  const [form, setForm] = useState({
    type: "Sell",
    asset: "SOL",
    amount: "",
    price: "",
    user: "Anonymous",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.price) return;
    addOffer(form);
    setForm({ ...form, amount: "", price: "" }); // reset only numbers
  };

  return (
    <div className="bg-[#1A1B1F] border border-gray-700 rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-3">Create Offer</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white"
        >
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>

        <select
          name="asset"
          value={form.asset}
          onChange={handleChange}
          className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white"
        >
          <option value="SOL">SOL</option>
          <option value="USDT">USDT</option>
          <option value="ETH">ETH</option>
        </select>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price in USDT"
          className="bg-[#2d2e31] px-3 py-2 rounded-lg text-white"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 transition px-4 py-2 rounded-lg font-medium text-white"
        >
          Post Offer
        </button>
      </form>
    </div>
  );
};

export default CreateOfferForm;
