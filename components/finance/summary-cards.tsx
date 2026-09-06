import { ArrowDownIcon, ArrowUpIcon, ScaleIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

export function SummaryCards({
  income,
  expense,
  balance,
  currency,
}: {
  income: number
  expense: number
  balance: number
  currency: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SummaryCard
        label="Доходы"
        amount={formatCurrency(income, currency)}
        icon={ArrowUpIcon}
        tone="income"
      />
      <SummaryCard
        label="Расходы"
        amount={formatCurrency(expense, currency)}
        icon={ArrowDownIcon}
        tone="expense"
      />
      <SummaryCard
        label="Баланс"
        amount={formatCurrency(balance, currency, { signed: true })}
        icon={ScaleIcon}
        tone={balance >= 0 ? "income" : "expense"}
      />
    </div>
  )
}

function SummaryCard({
  label,
  amount,
  icon: Icon,
  tone,
}: {
  label: string
  amount: string
  icon: typeof ArrowUpIcon
  tone: "income" | "expense"
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            tone === "income" ? "bg-income/15 text-income" : "bg-expense/15 text-expense",
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-2xl font-semibold tracking-tight text-foreground">{amount}</p>
      </CardContent>
    </Card>
  )
}
