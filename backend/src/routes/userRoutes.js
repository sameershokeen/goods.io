// backend/routes/userRoutes.js

import express from "express";
import { registerUser, getUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.get("/:wallet_address", getUser);

export default router;
