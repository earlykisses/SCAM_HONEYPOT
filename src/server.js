console.log("BOOT CHECK → Honeypot server version 2026-02-02");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/chat.route.js";
import { apiKeyAuth } from "./middleware/apiKeyAuth.js";

dotenv.config();

const app = express();
app.use(cors());

/**
 * =========================================================
 * GUVI ENDPOINT TESTER / PROBE HANDLER
 * =========================================================
 * GUVI sends large, non-chat payloads with application/json.
 * If payload is NOT a valid chat event, we ACK success
 * and DO NOT attempt to parse or process it.
 */
app.post("/api/chat", apiKeyAuth, (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  const contentLength = req.headers["content-length"];

  // If no body OR obviously not a chat payload → GUVI probe
  if (
    !contentLength ||
    contentLength === "0" ||
    !contentType.includes("application/json")
  ) {
    return res.status(200).json({ status: "success" });
  }

  // Let JSON parser run, but guard against non-chat shapes later
  next();
});

/**
 * JSON parser (after probe handler)
 */
app.use(express.json({ strict: false }));

/**
 * Second guard: body parsed but NOT a valid chat event
 * (GUVI sometimes sends junk JSON blobs)
 */
app.post("/api/chat", apiKeyAuth, (req, res, next) => {
  const body = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    !body.message ||
    typeof body.message !== "object" ||
    typeof body.message.text !== "string" ||
    typeof body.message.sender !== "string"
  ) {
    return res.status(200).json({ status: "success" });
  }

  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Real chat logic (ONLY valid chat events reach here)
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
