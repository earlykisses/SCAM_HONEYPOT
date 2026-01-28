export function extractData(text) {
  const bankAccounts = text.match(/\b\d{9,18}\b/g) || [];
  const upiIds = text.match(/[a-zA-Z0-9.\-_]+@[a-zA-Z]+/g) || [];
  const phishingLinks = text.match(/https?:\/\/[^\s]+/g) || [];
  const phoneNumbers = text.match(/\b(\+91)?[6-9]\d{9}\b/g) || [];

  const suspiciousKeywordsList = [
    "urgent",
    "immediately",
    "verify",
    "blocked",
    "suspended",
    "account",
    "limited"
  ];

  const suspiciousKeywords = suspiciousKeywordsList.filter((word) =>
    text.toLowerCase().includes(word)
  );

  return {
    bankAccounts,
    upiIds,
    phishingLinks,
    phoneNumbers,
    suspiciousKeywords
  };
}
