"use client"

import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { formatCurrency, formatPercent } from "@/lib/format"
import type { CategoryAmount } from "@/types/finance"

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--ai)",
]

export function CategoryBreakdown({ categories, currency }: { categories: CategoryAmount[]; currency: string }) {
  const top = categories.slice(0, 6)
  const chartConfig = top.reduce((config, item, index) => {
    config[item.category] = { label: item.category, color: PALETTE[index % PALETTE.length] }
    return config
  }, {} as ChartConfig)

  if (top.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Расходы по категориям</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">Нет расходов за выбранный период</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Расходы по категориям</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ChartContainer config={chartConfig} className="aspect-square h-56 w-56 shrink-0">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value), currency)}
                    hideLabel
                  />
                }
              />
              <Pie data={top} dataKey="amount" nameKey="category" innerRadius={55} outerRadius={80} strokeWidth={2}>
                {top.map((entry, index) => (
                  <Cell key={entry.category} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <ul className="flex w-full flex-col gap-2.5">
            {top.map((item, index) => (
              <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                  />
                  {item.category}
                </span>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span className="font-mono text-muted-foreground">{formatCurrency(item.amount, currency)}</span>
                  <span className="w-12 text-right text-xs text-muted-foreground">{formatPercent(item.percent)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
