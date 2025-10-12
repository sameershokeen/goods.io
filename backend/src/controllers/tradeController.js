import Trade from "../models/tradeModel.js";
import Offer from "../models/offerModel.js";
import User from "../models/userModel.js";

// Create a trade session when buyer accepts an offer
export const createTrade = async (req, res) => {
  try {
    const { offerId, buyerPublicKey } = req.body;

    const offer = await Offer.findById(offerId).populate("seller");
    if (!offer)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });

    let buyer = await User.findOne({ publicKey: buyerPublicKey });
    if (!buyer) buyer = await User.create({ publicKey: buyerPublicKey });

    const newTrade = await Trade.create({
      offer: offer._id,
      seller: offer.seller._id,
      buyer: buyer._id,
      amount: offer.price,
    });

    // Update offer status → "pending"
    offer.status = "pending";
    await offer.save();

    res.status(201).json({ success: true, trade: newTrade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all trades for a user
export const getUserTrades = async (req, res) => {
  try {
    const { publicKey } = req.params;
    const user = await User.findOne({ publicKey });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const trades = await Trade.find({
      $or: [{ buyer: user._id }, { seller: user._id }],
    }).populate("offer seller buyer");

    res.status(200).json({ success: true, trades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
