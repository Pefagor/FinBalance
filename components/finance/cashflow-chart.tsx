"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { formatNumber } from "@/lib/format"
import type { DailyStat, MonthlyStat } from "@/types/finance"

const chartConfig = {
  income: {
    label: "Доходы",
    color: "var(--income)",
  },
  expense: {
    label: "Расходы",
    color: "var(--expense)",
  },
} satisfies ChartConfig

export function CashflowChart({
  data,
  dateKey,
}: {
  data: (DailyStat | MonthlyStat)[]
  dateKey: "date" | "month"
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Динамика доходов и расходов</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--income)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--income)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--expense)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={dateKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={56}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              stroke="var(--income)"
              strokeWidth={2}
            />
            <Area
              dataKey="expense"
              type="monotone"
              fill="url(#fillExpense)"
              stroke="var(--expense)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
