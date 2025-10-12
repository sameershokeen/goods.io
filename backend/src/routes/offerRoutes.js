import express from "express";
import Offer from "../models/offerModel.js";

const router = express.Router();

// Create an offer
router.post("/", async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, offer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all active offers (with simple filters query)
router.get("/", async (req, res) => {
  try {
    const { crypto, status } = req.query;
    const query = {
      ...(crypto ? { crypto } : {}),
      ...(status ? { status } : { status: "active" }),
    };
    const offers = await Offer.find(query).sort({ created_at: -1 });
    res.json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
