import express from "express";
import { createTrade, getUserTrades, updateTradeStatus } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/", createTrade); // Start trade
router.get("/:wallet_address", getUserTrades); // Get user trades
router.put("/:tradeId/status", updateTradeStatus); // Update trade status

export default router;
