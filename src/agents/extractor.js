function cleanText(rawText = "") {
  if (typeof rawText !== "string") return "";

  return rawText
    // remove markdown code fences
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    // remove markdown headers and bullets
    .replace(/#+\s?/g, "")
    .replace(/[-*•]\s+/g, "")
    // normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

export function extractData(text) {
  const cleanedText = cleanText(text);
  const lowerText = cleanedText.toLowerCase();

  const bankAccounts =
    cleanedText.match(/\b\d{9,18}\b/g) || [];

  const upiIds =
    cleanedText.match(/[a-zA-Z0-9.\-_]+@[a-zA-Z]+/g) || [];

  const phishingLinks =
    cleanedText.match(/https?:\/\/[^\s]+/g) || [];

  const phoneNumbers =
    cleanedText.match(/\b(\+91)?[6-9]\d{9}\b/g) || [];

  const suspiciousKeywordsList = [
    "urgent",
    "immediately",
    "verify",
    "blocked",
    "suspended",
    "account",
    "limited"
  ];

  const suspiciousKeywords =
    suspiciousKeywordsList.filter((word) =>
      lowerText.includes(word)
    );

  return {
    bankAccounts,
    upiIds,
    phishingLinks,
    phoneNumbers,
    suspiciousKeywords
  };
}
