import express from "express";
import { createOffer, getOffers, getUserOffers, updateOfferStatus } from "../controllers/offerController.js";
import Offer from "../models/offerModel.js";

const router = express.Router();

// Create an offer
router.post("/", createOffer);

// Get all active offers (with filters)
router.get("/", getOffers);

// Get offers by user
router.get("/user/:publicKey", getUserOffers);

// Update offer status
router.put("/:id/status", updateOfferStatus);

// Get a specific offer by ID
router.get("/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
