export function formatCurrency(
  amount: number | string | undefined | null,
  locale = "pt-BR",
  currency = "BRL"
): string {
  const numericAmount = typeof amount === "number" ? amount : Number(amount) || 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function parseCurrencyInput(valueString: string | number | undefined | null): number {
  if (!valueString) return 0;
  const cleanString = valueString.toString().replace(/[^0-9.,-]/g, "").replace(",", ".");
  const parsedNumber = parseFloat(cleanString);
  return isNaN(parsedNumber) ? 0 : parsedNumber;
}

export default formatCurrency;
