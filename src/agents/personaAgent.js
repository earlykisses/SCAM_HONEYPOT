import { askLLM } from "../services/llm.service.js";

export async function respondAsVictim(latestMessage, conversationHistory) {
  const historyText = conversationHistory
    .map(
      (msg) => `${msg.sender.toUpperCase()}: ${msg.text}`
    )
    .join("\n");

  const systemPrompt = `
You are a real human user.
You are chatting with someone who may be a scammer.

Rules:
- Never reveal scam detection
- Never mention AI
- Behave like a normal Indian user
- Be polite, slightly confused, cautious
- Respond naturally based on conversation history
`;

  const userPrompt = `
Conversation so far:
${historyText}

Latest message:
${latestMessage}

Reply as the user.
`;

  return await askLLM(systemPrompt, userPrompt);
}
