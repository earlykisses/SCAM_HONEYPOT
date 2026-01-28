import express from "express";
import { detectScam } from "../agents/scamDetector.js";
import { respondAsVictim } from "../agents/personaAgent.js";
import { extractData } from "../agents/extractor.js";
import { calculateConfidence } from "../utils/confidence.js";
import { buildExplanation } from "../utils/explanation.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      sessionId,
      message,
      conversationHistory = [],
      metadata = {}
    } = req.body;

    // ---- BASIC VALIDATION (REQUIRED) ----
    if (
      !sessionId ||
      !message ||
      !message.sender ||
      !message.text ||
      !message.timestamp
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request format"
      });
    }

    const latestText = message.text;

    // ---- SCAM DETECTION ----
    const scamResult = await detectScam(latestText);

    if (!scamResult.is_scam) {
      return res.json({
        status: "success",
        scamDetected: false
      });
    }

    // ---- AGENT RESPONSE (SINGLE TURN FOR NOW) ----
    const agentReply = await respondAsVictim(latestText);

    // ---- INTELLIGENCE EXTRACTION ----
    const extracted = extractData(latestText);

    // ---- CONFIDENCE + EXPLANATION (TEMP, WILL CHANGE LATER) ----
    const confidenceScore = calculateConfidence({
      scamType: scamResult.scam_type,
      extractedData: extracted,
      message: latestText
    });

    const explanation = buildExplanation({
      scamType: scamResult.scam_type,
      extractedData: extracted
    });

    // ---- TEMP RESPONSE (PHASE 1 ONLY) ----
    res.json({
      status: "success",
      sessionId,
      scamDetected: true,
      agentReply,
      confidenceScore,
      explanation,
      extractedData: extracted,
      metadataReceived: metadata,
      conversationHistoryLength: conversationHistory.length
    });

  } catch (error) {
    console.error("PHASE 1 ERROR:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

export default router;
