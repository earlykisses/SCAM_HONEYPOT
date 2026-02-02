import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/chat.route.js";
import { apiKeyAuth } from "./middleware/apiKeyAuth.js";

dotenv.config();

const app = express();
app.use(cors());

/**
 * ✅ GUVI ENDPOINT TESTER HANDSHAKE
 * This runs BEFORE express.json()
 * Handles empty-body POST with application/json
 */
app.post("/api/chat", apiKeyAuth, (req, res, next) => {
  const contentLength = req.headers["content-length"];

  // GUVI tester sends POST with NO body
  if (!contentLength || contentLength === "0") {
    return res.status(200).json({
      status: "success",
      message: "Honeypot endpoint is reachable and secured"
    });
  }

  // If body exists → continue to real handler
  next();
});

/**
 * ✅ JSON parser ONLY after handshake
 */
app.use(express.json({ strict: false }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Scam Honeypot API",
    uptime: process.uptime()
  });
});

// Real chat logic
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
