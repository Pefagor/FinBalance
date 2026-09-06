"use client"

import { useMemo, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import { transactionDateTime } from "@/lib/dateUtils"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/types/finance"

export function TransactionsView({ transactions }: { transactions: Transaction[] }) {
  const [query, setQuery] = useState("")

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => transactionDateTime(b).getTime() - transactionDateTime(a).getTime()),
    [transactions],
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted
    const q = query.trim().toLowerCase()
    return sorted.filter(
      (t) => t.description.toLowerCase().includes(q) || (t.expense_category ?? "").toLowerCase().includes(q),
    )
  }, [sorted, query])

  return (
    <div className="flex flex-col gap-4">
      <InputGroup className="max-w-sm bg-card">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Поиск по описанию или категории"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
            {filtered.map((t) => {
              const isIncome = t.operation_type === "доход"
              return (
                <TableRow key={t.transactiom_id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {t.date} <span className="text-xs">{t.time}</span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{t.description}</TableCell>
                  <TableCell>
                    {t.expense_category ? (
                      <Badge variant="secondary">{t.expense_category}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 whitespace-nowrap font-mono text-sm font-medium",
                        isIncome ? "text-income" : "text-expense",
                      )}
                    >
                      {isIncome ? <ArrowUpIcon className="size-3.5" /> : <ArrowDownIcon className="size-3.5" />}
                      {formatCurrency(t.amount, t.currency)}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
