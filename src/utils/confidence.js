export function calculateConfidence({ scamType, extractedData, message }) {
  let score = 0.3;

  // Strong indicators
  if (extractedData.upi_ids.length > 0) score += 0.3;
  if (extractedData.links.length > 0) score += 0.2;

  // Medium indicators
  if (extractedData.phone_numbers.length > 0) score += 0.1;

  // High-risk scam types
  if (["UPI", "KYC", "Banking"].includes(scamType)) score += 0.1;

  // Urgency keywords
  const urgentWords = ["urgent", "immediately", "blocked", "suspended"];
  if (urgentWords.some(w => message.toLowerCase().includes(w))) {
    score += 0.1;
  }

  return Math.min(score, 0.99);
}
