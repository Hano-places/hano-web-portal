export function formatRwandaPhone(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("250")) {
    digits = digits.slice(3);
  }

  digits = digits.slice(0, 10);

  if (digits.length > 0 && !digits.startsWith("0") && !digits.startsWith("7")) {
    digits = `7${digits}`.slice(0, 10);
  }

  return digits;
}

export function isValidRwandaPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 9) return /^7\d{8}$/.test(digits);
  if (digits.length === 10) return /^07\d{8}$/.test(digits);
  return false;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCardCvv(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function isValidCardNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 13 && digits.length <= 16;
}

export function isValidCardExpiry(value: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;

  const [month, year] = value.split("/").map((part) => Number(part));
  if (month < 1 || month > 12) return false;

  const fullYear = 2000 + year;
  const now = new Date();
  const expiryEnd = new Date(fullYear, month, 0, 23, 59, 59, 999);

  return expiryEnd >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isValidCardCvv(value: string): boolean {
  return /^\d{3,4}$/.test(value);
}

export function isCardPaymentValid({
  cardNumber,
  cardExpiry,
  cardCvv,
}: {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}): boolean {
  return (
    isValidCardNumber(cardNumber) &&
    isValidCardExpiry(cardExpiry) &&
    isValidCardCvv(cardCvv)
  );
}
