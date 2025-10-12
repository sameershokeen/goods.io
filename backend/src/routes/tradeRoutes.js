import express from "express";
import { createTrade, getUserTrades } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/", createTrade); // Start trade
router.get("/:publicKey", getUserTrades); // Get user trades

export default router;
