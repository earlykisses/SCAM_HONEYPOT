import express from "express";
import { detectScam } from "../agents/scamDetector.js";
import { respondAsVictim } from "../agents/personaAgent.js";
import { extractData } from "../agents/extractor.js";
import { calculateConfidence } from "../utils/confidence.js";
import { buildExplanation } from "../utils/explanation.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const scam = await detectScam(message);

    if (!scam.is_scam) {
      return res.json({
        scam_detected: false,
        reply: "No scam detected"
      });
    }

    const reply = await respondAsVictim(message);
    const extracted = extractData(message);

    const confidence_score = calculateConfidence({
      scamType: scam.scam_type,
      extractedData: extracted,
      message
    });

    const explanation = buildExplanation({
      scamType: scam.scam_type,
      extractedData: extracted
    });

    res.json({
      scam_detected: true,
      scam_type: scam.scam_type,
      confidence_score,
      explanation,
      agent_reply: reply,
      extracted_data: extracted
    });
  } 
  catch (err) {
  console.error("LLM ERROR:", err.response?.data || err.message);
  res.status(500).json({ error: "LLM failure" });
}

});

export default router;
