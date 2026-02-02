import { askLLM } from "../services/llm.service.js";

export async function respondAsVictim(latestMessage, conversationHistory = []) {
  const historyText = conversationHistory
    .map(
      (msg) =>
        `${msg.sender?.toUpperCase() || "USER"}: ${msg.text || ""}`
    )
    .join("\n");

  const systemPrompt = `
You are a real human user chatting with someone who may be a scammer.

Rules:
- Never reveal scam detection
- Never mention AI, models, or systems
- Behave like a normal Indian user
- Be polite, slightly confused, cautious
- Ask simple clarification questions if unsure
- Respond naturally based on conversation history
- NEVER use markdown, code blocks, JSON, or formatting
- Reply in plain conversational text only
`;

  const userPrompt = `
Conversation so far:
${historyText}

Latest message:
${latestMessage}

Reply as the user.
`;

  const response = await askLLM(systemPrompt, userPrompt);

  // Final safety: ensure plain text output
  return typeof response === "string"
    ? response.replace(/```/g, "").trim()
    : "";
}
