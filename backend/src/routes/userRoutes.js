// backend/routes/userRoutes.js

import express from "express";
import { registerUser, getUser, uploadKYC } from "../controllers/userController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads/kyc"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/register", registerUser);
router.get("/:wallet_address", getUser);
router.post("/kyc", upload.single("kyc_file"), uploadKYC);

export default router;
