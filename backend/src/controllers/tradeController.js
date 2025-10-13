import Trade from "../models/tradeModel.js";
import Offer from "../models/offerModel.js";
import User from "../models/userModel.js";

// Create a trade session when buyer accepts an offer
export const createTrade = async (req, res) => {
  try {
    const { offerId, buyer_wallet } = req.body;

    const offer = await Offer.findById(offerId);
    if (!offer)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });

    if (offer.seller_wallet === buyer_wallet) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot trade with yourself" });
    }

    let buyer = await User.findOne({ wallet_address: buyer_wallet });
    if (!buyer) {
      // Create user with default username
      const defaultUsername = `user_${buyer_wallet.slice(0, 8)}${buyer_wallet.slice(-4)}`;
      buyer = await User.create({ 
        wallet_address: buyer_wallet, 
        username: defaultUsername 
      });
    }

    let seller = await User.findOne({ wallet_address: offer.seller_wallet });
    if (!seller) {
      const defaultUsername = `user_${offer.seller_wallet.slice(0, 8)}${offer.seller_wallet.slice(-4)}`;
      seller = await User.create({ 
        wallet_address: offer.seller_wallet, 
        username: defaultUsername 
      });
    }

    const newTrade = await Trade.create({
      offer: offer._id,
      seller: seller._id,
      buyer: buyer._id,
      amount: offer.amount,
      status: "pending"
    });

    // Update offer status → "pending"
    offer.status = "pending";
    await offer.save();

    res.status(201).json({ success: true, trade: newTrade });
  } catch (error) {
    console.error("Error creating trade:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all trades for a user
export const getUserTrades = async (req, res) => {
  try {
    const { wallet_address } = req.params;
    const user = await User.findOne({ wallet_address });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const trades = await Trade.find({
      $or: [{ buyer: user._id }, { seller: user._id }],
    }).populate("offer seller buyer");

    res.status(200).json({ success: true, trades });
  } catch (error) {
    console.error("Error fetching user trades:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update trade status (for escrow system)
export const updateTradeStatus = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { status, escrowTransaction, releaseTransaction } = req.body;

    const updateData = { status };
    if (escrowTransaction) updateData.escrowTransaction = escrowTransaction;
    if (releaseTransaction) updateData.releaseTransaction = releaseTransaction;

    const trade = await Trade.findByIdAndUpdate(tradeId, updateData, { new: true })
      .populate("offer seller buyer");

    if (!trade)
      return res
        .status(404)
        .json({ success: false, message: "Trade not found" });

    // If trade is completed, update offer status
    if (status === "completed") {
      await Offer.findByIdAndUpdate(trade.offer._id, { status: "completed" });
    }

    res.status(200).json({ success: true, trade });
  } catch (error) {
    console.error("Error updating trade status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
