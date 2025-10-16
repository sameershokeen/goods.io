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
    setForm({ ...form, amount: "", price: "" });
  };

  return (
    <div className="bg-gradient-to-tr from-[#2b2446] to-[#151227] rounded-2xl shadow-2xl border border-purple-900/40 p-8 animate-fade-in">
      <h2 className="text-2xl font-extrabold mb-5 tracking-tight text-purple-100">Create Offer</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="bg-[#232038] px-4 py-3 rounded-lg text-white border-2 border-transparent focus:border-purple-500 transition-all"
        >
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
        <select
          name="asset"
          value={form.asset}
          onChange={handleChange}
          className="bg-[#232038] px-4 py-3 rounded-lg text-white border-2 border-transparent focus:border-purple-500 transition-all"
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
          className="bg-[#232038] px-4 py-3 rounded-lg text-white border-2 border-transparent focus:border-purple-500 transition-all"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price in USDT"
          className="bg-[#232038] px-4 py-3 rounded-lg text-white border-2 border-transparent focus:border-purple-500 transition-all"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-6 py-3 rounded-xl font-bold text-white shadow-lg text-lg transition-all"
        >
          Post Offer
        </button>
      </form>
    </div>
  );
};
export default CreateOfferForm;
