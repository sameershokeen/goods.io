import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  crypto: { type: String, required: true }, // e.g., SOL, USDT
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  seller_wallet: { type: String, required: true }, // wallet address
  payment_method: { type: String }, // UPI, Bank, Paypal, etc.
  status: { type: String, default: "active" }, // active, pending, completed, cancelled
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Offer", OfferSchema);
