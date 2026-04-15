import axios from "axios";

export async function askLLM(systemPrompt, userPrompt) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://scam-honeypot-zpti.onrender.com",
        "X-Title": "Scam Honeypot Hackathon"
      },
      timeout: 15000
    }
  );

  const rawText =
    response?.data?.choices?.[0]?.message?.content || "";

  // ✅ CRITICAL: strip markdown / code fences defensively
  return rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}
