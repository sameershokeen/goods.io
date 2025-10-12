import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  wallet_address: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  contact: {
    email: { type: String },
    phone: { type: String },
  },
  telegram: {
    username: { type: String },
    chat_id: { type: String },
    verified: { type: Boolean, default: false },
  },
  kyc_status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
