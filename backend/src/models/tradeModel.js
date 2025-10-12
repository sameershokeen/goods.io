import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    escrowTransaction: {
      type: String, // Solana transaction signature
      default: null,
    },
    releaseTransaction: {
      type: String, // Final transfer signature
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trade", tradeSchema);
