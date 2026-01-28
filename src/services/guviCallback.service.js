import axios from "axios";

const GUVI_ENDPOINT =
  "https://hackathon.guvi.in/api/updateHoneyPotFinalResult";

export async function sendFinalResultToGuvi(payload) {
  try {
    await axios.post(GUVI_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 5000
    });
  } catch (error) {
    console.error(
      "GUVI CALLBACK FAILED:",
      error.response?.data || error.message
    );
    // DO NOT throw — callback failure must not break API
  }
}
