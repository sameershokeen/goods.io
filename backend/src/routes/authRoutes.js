import express from "express";
import { walletLogin, updateProfile } from "../controllers/authController.js";

const router = express.Router();

/**
 * POST /api/auth/wallet-login
 * body: { wallet_address, username (required for new), contact, telegram_username }
 */
router.post("/wallet-login", walletLogin);

/**
 * PUT /api/auth/update-profile
 * body: { wallet_address, username?, contact?, telegram_username? }
 */
router.put("/update-profile", updateProfile);

export default router;
