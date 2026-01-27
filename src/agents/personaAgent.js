import { askLLM } from "../services/llm.service.js";

export async function respondAsVictim(message) {
  const system = `
You are a real human, not an AI.
Persona:
- Age: 45
- Small shop owner
- Confused but polite
Never mention AI.
`;

  return await askLLM(system, message);
}
