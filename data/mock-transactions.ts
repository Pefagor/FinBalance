import type { Transaction } from "@/types/finance"
import rawData from "@/data/operations.json"

export type RawTransaction = {
  transaction_id: number
  user_id: string
  date: string
  time: string
  amount: number
  currency: string
  operation_type: "доход" | "расход"
  category?: string
  recipient_type?: string
  recipient?: string
  description?: string
}

export function mapRawToTransaction(raw: RawTransaction): Transaction {
  return {
    transactiom_id: raw.transaction_id,
    user_id: raw.user_id,
    date: raw.date,
    time: raw.time,
    amount: raw.amount,
    currency: raw.currency,
    operation_type: raw.operation_type,
    ...(raw.operation_type === "расход" && raw.category
      ? { expense_category: raw.category }
      : {}),
    description: raw.description ?? raw.recipient ?? "",
  }
}

export const MOCK_TRANSACTIONS: Transaction[] = (rawData as RawTransaction[]).map(mapRawToTransaction)