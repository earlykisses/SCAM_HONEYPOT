import express from "express";
import { detectScam } from "../agents/scamDetector.js";
import { respondAsVictim } from "../agents/personaAgent.js";
import { extractData } from "../agents/extractor.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";
import { sendFinalResultToGuvi } from "../services/guviCallback.service.js";

const router = express.Router();

router.post("/", apiKeyAuth, async (req, res) => {
  try {
    // =====================================================
    // ✅ GUVI ENDPOINT TESTER HANDSHAKE (NO REQUEST BODY)
    // =====================================================
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Honeypot endpoint is reachable and secured"
      });
    }

    const {
      sessionId,
      message,
      conversationHistory = [],
      metadata = {}
    } = req.body;

    // =====================================================
    // ✅ STRICT VALIDATION FOR REAL CHAT REQUESTS
    // =====================================================
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

    // =====================================================
    // ✅ SCAM DETECTION (ONLY WHEN SENDER IS SCAMMER)
    // =====================================================
    const scamDetected =
      message.sender === "scammer"
        ? (await detectScam(latestText)).is_scam
        : true;

    if (!scamDetected) {
      return res.status(200).json({
        status: "success",
        scamDetected: false
      });
    }

    // =====================================================
    // ✅ AGENT RESPONSE (MULTI-TURN)
    // =====================================================
    const agentReply = await respondAsVictim(
      latestText,
      conversationHistory
    );

    // =====================================================
    // ✅ INTELLIGENCE EXTRACTION
    // =====================================================
    const allTexts = [
      ...conversationHistory.map((m) => m.text),
      latestText
    ].join(" ");

    const extracted = extractData(allTexts);

    // =====================================================
    // ✅ METRICS
    // =====================================================
    const totalMessagesExchanged =
      conversationHistory.length + 1;

    const engagementDurationSeconds = Math.max(
      0,
      (new Date(message.timestamp) -
        new Date(
          conversationHistory[0]?.timestamp || message.timestamp
        )) / 1000
    );

    const agentNotes =
      extracted.suspiciousKeywords.length > 0
        ? `Scammer used urgency tactics: ${extracted.suspiciousKeywords.join(", ")}`
        : "Scammer interaction observed with no obvious urgency tactics";

    // =====================================================
    // ✅ RESPONSE TO PLATFORM
    // =====================================================
    res.status(200).json({
      status: "success",
      scamDetected: true,
      reply: agentReply,
      engagementMetrics: {
        totalMessagesExchanged,
        engagementDurationSeconds
      },
      extractedIntelligence: {
        bankAccounts: extracted.bankAccounts,
        upiIds: extracted.upiIds,
        phishingLinks: extracted.phishingLinks,
        phoneNumbers: extracted.phoneNumbers,
        suspiciousKeywords: extracted.suspiciousKeywords
      },
      agentNotes
    });

    // =====================================================
    // ✅ MANDATORY GUVI FINAL CALLBACK (ASYNC, NON-BLOCKING)
    // =====================================================
    sendFinalResultToGuvi({
      sessionId,
      scamDetected: true,
      totalMessagesExchanged,
      extractedIntelligence: {
        bankAccounts: extracted.bankAccounts,
        upiIds: extracted.upiIds,
        phishingLinks: extracted.phishingLinks,
        phoneNumbers: extracted.phoneNumbers,
        suspiciousKeywords: extracted.suspiciousKeywords
      },
      agentNotes
    });

  } catch (error) {
    console.error("PHASE 3 ERROR:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

export default router;
