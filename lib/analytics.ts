import type { CategoryAmount, DailyStat, DateRange, MonthlyStat, Transaction } from "@/types/finance"
import { formatDateShort, formatMonthLabel, isWithinRange, transactionDateTime } from "./dateUtils"

export function filterTransactionsByDate(transactions: Transaction[], range: DateRange): Transaction[] {
  return transactions.filter((t) => isWithinRange(transactionDateTime(t), range))
}

export function filterTransactionsByCurrency(transactions: Transaction[], currency: string): Transaction[] {
  return transactions.filter((t) => t.currency === currency)
}

export function getAvailableCurrencies(transactions: Transaction[]): string[] {
  return Array.from(new Set(transactions.map((t) => t.currency))).sort()
}

/** Returns the currency with the most transactions, used as the sensible default filter. */
export function getDominantCurrency(transactions: Transaction[], fallback = "RUB"): string {
  const counts = new Map<string, number>()
  for (const t of transactions) {
    counts.set(t.currency, (counts.get(t.currency) ?? 0) + 1)
  }
  let best = fallback
  let bestCount = -1
  for (const [currency, count] of counts) {
    if (count > bestCount) {
      best = currency
      bestCount = count
    }
  }
  return best
}

export function calculateIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.operation_type === "доход")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function calculateExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.operation_type === "расход")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function calculateBalance(transactions: Transaction[]): number {
  return calculateIncome(transactions) - calculateExpenses(transactions)
}

export function calculateCategoryExpenses(transactions: Transaction[]): CategoryAmount[] {
  const expenses = transactions.filter((t) => t.operation_type === "расход")
  const total = expenses.reduce((sum, t) => sum + t.amount, 0)
  const byCategory = new Map<string, number>()

  for (const t of expenses) {
    const category = t.expense_category || "Другое"
    byCategory.set(category, (byCategory.get(category) ?? 0) + t.amount)
  }

  return Array.from(byCategory.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function getTopCategories(transactions: Transaction[], limit = 5): CategoryAmount[] {
  return calculateCategoryExpenses(transactions).slice(0, limit)
}

export function calculateDailyStatistics(transactions: Transaction[]): DailyStat[] {
  const byDay = new Map<string, { date: Date; income: number; expense: number }>()

  for (const t of transactions) {
    const dt = transactionDateTime(t)
    const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`
    const entry = byDay.get(key) ?? { date: dt, income: 0, expense: 0 }
    if (t.operation_type === "доход") entry.income += t.amount
    else entry.expense += t.amount
    byDay.set(key, entry)
  }

  return Array.from(byDay.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => ({
      date: formatDateShort(entry.date),
      income: entry.income,
      expense: entry.expense,
    }))
}

export function calculateMonthlyStatistics(transactions: Transaction[]): MonthlyStat[] {
  const byMonth = new Map<string, { date: Date; income: number; expense: number }>()

  for (const t of transactions) {
    const dt = transactionDateTime(t)
    const key = `${dt.getFullYear()}-${dt.getMonth()}`
    const entry = byMonth.get(key) ?? { date: new Date(dt.getFullYear(), dt.getMonth(), 1), income: 0, expense: 0 }
    if (t.operation_type === "доход") entry.income += t.amount
    else entry.expense += t.amount
    byMonth.set(key, entry)
  }

  return Array.from(byMonth.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => ({
      month: formatMonthLabel(entry.date),
      income: entry.income,
      expense: entry.expense,
    }))
}
