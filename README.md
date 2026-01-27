# Agentic Scam Honeypot API

An autonomous AI-powered honeypot system that detects scam messages, engages scammers using a realistic persona, and extracts actionable intelligence such as UPI IDs, phone numbers, and phishing links.

This project is built for hackathon evaluation with a focus on explainability, deployment stability, and real-world relevance.

---

## 🚀 Live API

Base URL:
https://scam-honeypot-zpti.onrender.com


---

## 🔍 Health Check

GET /health


Response:
```json
{
  "status": "ok",
  "service": "Scam Honeypot API"
}
🤖 Core API Endpoint
Detect & Engage Scammers
POST /api/chat
Request Body
{
  "message": "Your KYC is blocked. Send money to helpdesk@upi immediately"
}
Sample Response
{
  "scam_detected": true,
  "scam_type": "KYC",
  "confidence_score": 0.85,
  "explanation": "message asks for payment via UPI, matches common KYC scam pattern",
  "agent_reply": "Sir, I am not understanding properly. Can you explain again?",
  "extracted_data": {
    "upi_ids": ["helpdesk@upi"],
    "bank_accounts": [],
    "phone_numbers": [],
    "links": []
  }
}
🧠 How It Works
Scam Detection
Incoming messages are classified using an LLM-based detector.

Agentic Engagement
When a scam is detected, the system switches to a believable human persona and continues the conversation.

Intelligence Extraction
Regex-based extraction is used to identify UPI IDs, phone numbers, bank accounts, and links.

Explainability Layer
A deterministic confidence score and explanation are generated without extra LLM calls.

🛠 Tech Stack
Node.js

Express.js

OpenRouter (Open-source LLMs)

Render (Deployment)

🔐 Security & Deployment Notes
.env files are excluded from version control

Secrets are managed via environment variables

Dynamic port handling is used for cloud deployment

👨‍⚖️ Judge Notes
The system is fully deployable and publicly accessible

No frontend required; API-first design

Focuses on real-world scam intelligence extraction

Designed to be explainable, fast, and cost-efficient

📌 Team
Built as part of a hackathon challenge on scam detection and intelligence extraction.


---

## 🔁 FINAL STEPS TO FINISH

Run locally:
```bash
git add README.md src/server.js
git commit -m "Add health endpoint and final README"
git push origin main
Then:

Render → Manual Deploy → Deploy latest commit

