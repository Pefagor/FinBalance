const CURRENCY_LOCALES: Record<string, string> = {
  RUB: "ru-RU",
  USD: "en-US",
  EUR: "de-DE",
}

export function formatCurrency(amount: number, currency = "RUB", opts?: { signed?: boolean }): string {
  const locale = CURRENCY_LOCALES[currency] ?? "ru-RU"
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))

  if (opts?.signed) {
    const sign = amount > 0 ? "+" : amount < 0 ? "\u2212" : ""
    return `${sign}${formatted}`
  }
  return formatted
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(value)}%`
}

export const CURRENCY_LABELS: Record<string, string> = {
  RUB: "₽ Рубль",
  USD: "$ Доллар",
  EUR: "€ Евро",
}
