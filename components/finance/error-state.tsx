"use client"

import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ErrorInfo } from "@/types/finance"

export function ErrorState({ error, onRetry }: { error: ErrorInfo; onRetry: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-8 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangleIcon className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Не удалось обработать файл</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{error.message}</p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <RotateCcwIcon data-icon="inline-start" />
          Попробовать снова
        </Button>
      </div>
    </div>
  )
}
