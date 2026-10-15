export function normalizeRollNumber(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export function normalizeCertificateNumber(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(String(id || ""));
}
