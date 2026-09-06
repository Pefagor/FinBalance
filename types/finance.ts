// Core domain types shared across the FinSight renderer.
// NOTE: `transactiom_id` is intentionally misspelled to match the
// existing Python-side JSON schema (parser.py / mock data).

export type OperationType = "доход" | "расход"

export interface Transaction {
  transactiom_id: number
  user_id: string
  /** DD.MM.YYYY */
  date: string
  /** HH:mm */
  time: string
  amount: number
  currency: string
  operation_type: OperationType
  expense_category?: string
  description: string
}

export interface Advice {
  title: string
  description: string
}

/** Overall lifecycle of the renderer, driven by file upload + processing. */
export type AppStatus = "empty" | "uploading" | "processing" | "ready" | "error"

/** Fine-grained step shown inside the upload/processing UI. */
export type ProcessingStage =
  | "uploading"
  | "validating"
  | "parsing"
  | "extracting"
  | "finalizing"
  | "done"

export type SourceFileKind = "pdf" | "json"

export interface ErrorInfo {
  kind:
    | "unsupported-format"
    | "invalid-json"
    | "parser-failed"
    | "empty-data"
    | "advice-failed"
    | "unknown"
  message: string
}

export type DateRangePreset =
  | "today"
  | "7d"
  | "30d"
  | "this-month"
  | "last-month"
  | "3m"
  | "this-year"
  | "custom"

export interface DateRange {
  from: Date
  to: Date
}

export type ChartMode = "line" | "bar" | "area"
export type CategoryChartMode = "donut" | "bar" | "table"

export interface CategoryAmount {
  category: string
  amount: number
  percent: number
}

export interface DailyStat {
  date: string
  income: number
  expense: number
}

export interface MonthlyStat {
  month: string
  income: number
  expense: number
}

export interface FileMeta {
  name: string
  sizeLabel: string
  kind: SourceFileKind
}
