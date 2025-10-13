// backend/controllers/userController.js

import User from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    let user = await User.findOne({ wallet_address });
    if (!user) {
      // Generate a default username from wallet address (first 8 chars + last 4 chars)
      const defaultUsername = `user_${wallet_address.slice(0, 8)}${wallet_address.slice(-4)}`;
      user = new User({ 
        wallet_address, 
        username: defaultUsername 
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { wallet_address } = req.params;
    const user = await User.findOne({ wallet_address });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
