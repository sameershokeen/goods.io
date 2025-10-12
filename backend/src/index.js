import express from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import { initSocket } from "./sockets/socket.js";

config();
const PORT = process.env.PORT || 5000;

await connectDB();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));
app.use(express.json());

// health
app.get("/", (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
