"use client"

import { useCallback, useState } from "react"
import { AppSidebar } from "@/components/layout/sidebar"
import type { WorkspaceView } from "@/components/layout/sidebar"
import { AppHeader } from "@/components/layout/header"
import { UploadEmptyState } from "@/components/finance/upload-empty-state"
import { ProcessingState } from "@/components/finance/processing-state"
import { ErrorState } from "@/components/finance/error-state"
import { DashboardView } from "@/components/finance/dashboard-view"
import { TransactionsView } from "@/components/finance/transactions-view"
import { AdviceView } from "@/components/finance/advice-view"
import { CurrencyFilter } from "@/components/finance/filters"
import { getPythonBridge } from "@/lib/pythonBridge"
import { mapRawToTransaction, type RawTransaction } from "@/data/mock-transactions"
import { getAvailableCurrencies, getDominantCurrency, filterTransactionsByCurrency } from "@/lib/analytics"
import type { AppStatus, ErrorInfo, FileMeta, Advice, ProcessingStage, SourceFileKind, Transaction, DateRangePreset } from "@/types/finance"

const PROCESSING_SEQUENCE: ProcessingStage[] = ["uploading", "validating", "parsing", "extracting", "finalizing"]

export function FinanceWorkspace() {
  const [status, setStatus] = useState<AppStatus>("empty")
  const [stage, setStage] = useState<ProcessingStage>("uploading")
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [advice, setAdvice] = useState<Advice[]>([])
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [adviceRequested, setAdviceRequested] = useState(false)
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [activeView, setActiveView] = useState<WorkspaceView>("dashboard")
  const [currency, setCurrency] = useState("RUB")
  const [preset, setPreset] = useState<DateRangePreset>("30d")

  const handleFileSelected = useCallback(async (file: File, kind: SourceFileKind) => {
    const meta: FileMeta = {
      name: file.name,
      sizeLabel: "",
      kind,
    }
    setFileMeta(meta)
    setStatus("uploading")
    setStage("uploading")
    setError(null)

    try {
      let stageIndex = 0
      const advanceStage = () => {
        stageIndex = Math.min(stageIndex + 1, PROCESSING_SEQUENCE.length - 1)
        setStage(PROCESSING_SEQUENCE[stageIndex])
      }
      setStatus("processing")
      const interval = setInterval(advanceStage, 550)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      })

      clearInterval(interval)

      if (!response.ok) {
        throw new Error("parse failed")
      }

      const rawResult = (await response.json()) as RawTransaction[]
      const result = rawResult.map(mapRawToTransaction)

      if (!result || result.length === 0) {
        setError({
          kind: "empty-data",
          message: "В файле не найдено ни одной транзакции. Проверьте, что выписка содержит операции за период.",
        })
        setStatus("error")
        return
      }

      setTransactions(result)
      setCurrency(getDominantCurrency(result))
      setStatus("ready")
    } catch {
      setError({
        kind: "parser-failed",
        message: "Не удалось разобрать файл. Убедитесь, что это корректная банковская выписка в формате PDF или JSON.",
      })
      setStatus("error")
    }
  }, [])

  const handleUploadNew = useCallback(() => {
    setStatus("empty")
    setFileMeta(null)
    setTransactions([])
    setAdvice([])
    setAdviceRequested(false)
    setError(null)
    setActiveView("dashboard")
  }, [])

  const handleGenerateAdvice = useCallback(() => {
    setAdviceLoading(true)
    setAdviceRequested(true)
    const bridge = getPythonBridge()
    bridge
      .generateAdvice(transactions)
      .then(setAdvice)
      .catch(() => setAdvice([]))
      .finally(() => setAdviceLoading(false))
  }, [transactions])

  const availableCurrencies = getAvailableCurrencies(transactions)
  const currencyTransactions = filterTransactionsByCurrency(transactions, currency)

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} status={status} onUploadNew={handleUploadNew} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          activeView={activeView}
          onViewChange={setActiveView}
          status={status}
          onUploadNew={handleUploadNew}
          fileMeta={fileMeta}
        >
          {status === "ready" && (
            <CurrencyFilter currencies={availableCurrencies} value={currency} onChange={setCurrency} />
          )}
        </AppHeader>

        <main className="flex flex-1 flex-col overflow-y-auto">
          {status === "empty" && <UploadEmptyState onFileSelected={handleFileSelected} />}
          {(status === "uploading" || status === "processing") && (
            <ProcessingState stage={stage} fileMeta={fileMeta} />
          )}
          {status === "error" && error && (
            <ErrorState error={error} onRetry={handleUploadNew} />
          )}
          {status === "ready" && (
            <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
              {activeView === "dashboard" && (
                <DashboardView
                  transactions={currencyTransactions}
                  currency={currency}
                  preset={preset}
                  onPresetChange={setPreset}
                />
              )}
              {activeView === "transactions" && <TransactionsView transactions={currencyTransactions} />}
              {activeView === "advice" && (
                <AdviceView
                  advice={advice}
                  isLoading={adviceLoading}
                  hasRequested={adviceRequested}
                  onGenerate={handleGenerateAdvice}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}