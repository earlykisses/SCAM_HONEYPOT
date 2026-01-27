export function buildExplanation({ scamType, extractedData }) {
  const reasons = [];

  if (extractedData.upi_ids.length > 0)
    reasons.push("message asks for payment via UPI");

  if (extractedData.links.length > 0)
    reasons.push("message contains suspicious links");

  if (["UPI", "KYC", "Banking"].includes(scamType))
    reasons.push(`matches common ${scamType} scam pattern`);

  return reasons.length
    ? reasons.join(", ")
    : "message matches known scam behavior";
}
