import { askLLM } from "../services/llm.service.js";

export async function detectScam(message) {
  const system = "You classify scam messages.";
  const user = `
Message: "${message}"

Respond ONLY in JSON:
{
  "is_scam": true or false,
  "scam_type": "UPI | KYC | Lottery | Banking | Other"
}
`;

  return JSON.parse(await askLLM(system, user));
}
