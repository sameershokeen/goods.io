import Offer from "../models/offerModel.js";
import User from "../models/userModel.js";

// Create a new offer
export const createOffer = async (req, res) => {
  try {
    const { title, crypto, price, amount, seller_wallet, payment_method } = req.body;

    // Validate required fields
    if (!title || !crypto || !price || !amount || !seller_wallet) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: title, crypto, price, amount, seller_wallet" 
      });
    }

    const newOffer = await Offer.create({
      title,
      crypto,
      price,
      amount,
      seller_wallet,
      payment_method: payment_method || "Bank Transfer",
      status: "active"
    });

    res.status(201).json({ success: true, offer: newOffer });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active offers with filters
export const getOffers = async (req, res) => {
  try {
    const { crypto, status } = req.query;
    const query = {
      ...(crypto ? { crypto } : {}),
      ...(status ? { status } : { status: "active" }),
    };
    
    const offers = await Offer.find(query).sort({ created_at: -1 });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get offers by user (wallet address)
export const getUserOffers = async (req, res) => {
  try {
    const { publicKey } = req.params;

    const offers = await Offer.find({ seller_wallet: publicKey });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching user offers:", error);
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
    console.error("Error updating offer status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
