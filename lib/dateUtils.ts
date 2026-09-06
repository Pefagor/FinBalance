import type { DateRange, DateRangePreset, Transaction } from "@/types/finance"

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
]

const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

/**
 * Transactions arrive with dates as "DD.MM.YYYY", which native `Date`
 * parsing handles inconsistently across engines. We split and construct
 * the Date manually so behavior is deterministic everywhere.
 */
export function parseTransactionDate(dateStr: string, timeStr?: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number)
  let hours = 0
  let minutes = 0
  if (timeStr) {
    const [h, m] = timeStr.split(":").map(Number)
    hours = h ?? 0
    minutes = m ?? 0
  }
  return new Date(year, (month ?? 1) - 1, day ?? 1, hours, minutes)
}

export function transactionDateTime(t: Transaction): Date {
  return parseTransactionDate(t.date, t.time)
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}

export function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

export function addMonths(d: Date, months: number): Date {
  const next = new Date(d)
  next.setMonth(next.getMonth() + months)
  return next
}

export function getRangeForPreset(preset: DateRangePreset, referenceDate = new Date()): DateRange {
  const today = startOfDay(referenceDate)

  switch (preset) {
    case "today":
      return { from: today, to: endOfDay(referenceDate) }
    case "7d":
      return { from: startOfDay(addDays(referenceDate, -6)), to: endOfDay(referenceDate) }
    case "30d":
      return { from: startOfDay(addDays(referenceDate, -29)), to: endOfDay(referenceDate) }
    case "this-month": {
      const from = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
      return { from, to: endOfDay(referenceDate) }
    }
    case "last-month": {
      const from = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1)
      const to = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0, 23, 59, 59, 999)
      return { from, to }
    }
    case "3m":
      return { from: startOfDay(addMonths(referenceDate, -3)), to: endOfDay(referenceDate) }
    case "this-year": {
      const from = new Date(referenceDate.getFullYear(), 0, 1)
      return { from, to: endOfDay(referenceDate) }
    }
    default:
      return { from: startOfDay(addMonths(referenceDate, -1)), to: endOfDay(referenceDate) }
  }
}

export const DATE_RANGE_PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Сегодня",
  "7d": "7 дней",
  "30d": "30 дней",
  "this-month": "Этот месяц",
  "last-month": "Прошлый месяц",
  "3m": "3 месяца",
  "this-year": "Этот год",
  custom: "Произвольный период",
}

export function formatDateLong(d: Date): string {
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateShort(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  return `${day}.${month}`
}

export function formatDateInput(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  return `${day}.${month}.${d.getFullYear()}`
}

export function formatMonthLabel(d: Date): string {
  return `${MONTHS_NOMINATIVE[d.getMonth()]} ${d.getFullYear()}`
}

export function isWithinRange(date: Date, range: DateRange): boolean {
  return date.getTime() >= range.from.getTime() && date.getTime() <= range.to.getTime()
}
