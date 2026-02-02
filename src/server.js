import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/chat.route.js";

dotenv.config();

const app = express();
app.use(cors());

// JSON body parser
app.use(express.json());

// ✅ HANDLE INVALID JSON BODY (documentation / markdown / plain text)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "INVALID_REQUEST_BODY: Request body must be valid JSON"
    });
  }
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Scam Honeypot API",
    uptime: process.uptime()
  });
});

app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
