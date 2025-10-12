// backend/controllers/userController.js

import User from "../models/User";

export const registerUser = async (req, res) => {
  const { wallet_address } = req.body;
  if (!wallet_address) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  let user = await User.findOne({ wallet_address });
  if (!user) {
    user = new User({ wallet_address });
    await user.save();
  }

  res.json(user);
};

export const getUser = async (req, res) => {
  const { wallet_address } = req.params;
  const user = await User.findOne({ wallet_address });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};
