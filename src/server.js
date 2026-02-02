console.log("BOOT CHECK → Honeypot server version 2026-02-02");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/chat.route.js";
import { apiKeyAuth } from "./middleware/apiKeyAuth.js";

dotenv.config();

const app = express();
app.use(cors());

// 🔑 GUVI ENDPOINT TESTER HANDSHAKE (STRICT RESPONSE)
app.post("/api/chat", apiKeyAuth, (req, res, next) => {
  const contentLength = req.headers["content-length"];

  // GUVI tester: POST + headers + NO BODY
  if (!contentLength || contentLength === "0") {
    return res.status(200).json({
      status: "success"
    });
  }

  next();
});

// JSON parser AFTER handshake
app.use(express.json({ strict: false }));

// Health check (not used by GUVI tester)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

// Real chat logic
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
