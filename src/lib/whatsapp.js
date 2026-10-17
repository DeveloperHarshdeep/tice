export function getWhatsAppNumber(phone) {
  let digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 10) {
    if (!/^[6-9]\d{9}$/.test(digits)) return "";
    digits = `91${digits}`;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    const nationalNumber = digits.slice(1);
    if (!/^[6-9]\d{9}$/.test(nationalNumber)) return "";
    digits = `91${nationalNumber}`;
  }

  return /^[1-9]\d{7,14}$/.test(digits) ? digits : "";
}

export function createWhatsAppUrl(message, phone) {
  const number = getWhatsAppNumber(phone);
  if (!number) return "";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
