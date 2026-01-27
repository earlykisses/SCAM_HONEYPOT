export function extractData(text) {
  return {
    upi_ids: text.match(/[a-zA-Z0-9.\-_]+@[a-zA-Z]+/g) || [],
    bank_accounts: text.match(/\b\d{9,18}\b/g) || [],
    phone_numbers: text.match(/\b\d{10}\b/g) || [],
    links: text.match(/https?:\/\/[^\s]+/g) || []
  };
}
