"use client"

import { useMemo } from "react"
import {
  calculateBalance,
  calculateCategoryExpenses,
  calculateDailyStatistics,
  calculateExpenses,
  calculateIncome,
  calculateMonthlyStatistics,
} from "@/lib/analytics"
import { getRangeForPreset } from "@/lib/dateUtils"
import { SummaryCards } from "./summary-cards"
import { CashflowChart } from "./cashflow-chart"
import { CategoryBreakdown } from "./category-breakdown"
import { DateRangeFilter } from "./filters"
import type { DateRangePreset, Transaction } from "@/types/finance"

export function DashboardView({
  transactions,
  currency,
  preset,
  onPresetChange,
}: {
  transactions: Transaction[]
  currency: string
  preset: DateRangePreset
  onPresetChange: (preset: DateRangePreset) => void
}) {
  const range = useMemo(() => getRangeForPreset(preset), [preset])
  const useMonthly = preset === "3m" || preset === "this-year"

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const [day, month, year] = t.date.split(".").map(Number)
      const dt = new Date(year, month - 1, day)
      return dt.getTime() >= range.from.getTime() && dt.getTime() <= range.to.getTime()
    })
  }, [transactions, range])

  const income = useMemo(() => calculateIncome(filtered), [filtered])
  const expense = useMemo(() => calculateExpenses(filtered), [filtered])
  const balance = useMemo(() => calculateBalance(filtered), [filtered])
  const categories = useMemo(() => calculateCategoryExpenses(filtered), [filtered])
  const daily = useMemo(() => calculateDailyStatistics(filtered), [filtered])
  const monthly = useMemo(() => calculateMonthlyStatistics(filtered), [filtered])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <DateRangeFilter value={preset} onChange={onPresetChange} />
      </div>

      <SummaryCards income={income} expense={expense} balance={balance} currency={currency} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-8 py-14 text-center">
          <p className="text-sm text-muted-foreground">Нет операций за выбранный период</p>
        </div>
      ) : (
        <>
          <CashflowChart data={useMonthly ? monthly : daily} dateKey={useMonthly ? "month" : "date"} />
          <CategoryBreakdown categories={categories} currency={currency} />
        </>
      )}
    </div>
  )
}
