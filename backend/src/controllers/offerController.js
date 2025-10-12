import Offer from "../models/Offer.js";
import User from "../models/User.js";

// Create a new offer
export const createOffer = async (req, res) => {
  try {
    const { title, description, price, publicKey } = req.body;

    let user = await User.findOne({ publicKey });
    if (!user) {
      user = await User.create({ publicKey });
    }

    const newOffer = await Offer.create({
      title,
      description,
      price,
      seller: user._id,
    });

    res.status(201).json({ success: true, offer: newOffer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ status: "active" }).populate("seller");
    res.status(200).json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get offers by user (publicKey)
export const getUserOffers = async (req, res) => {
  try {
    const { publicKey } = req.params;
    const user = await User.findOne({ publicKey });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const offers = await Offer.find({ seller: user._id });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update offer status (cancel/complete)
export const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const offer = await Offer.findByIdAndUpdate(id, { status }, { new: true });

    if (!offer)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });

    res.status(200).json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
