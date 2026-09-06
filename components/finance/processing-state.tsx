"use client"

import { CheckIcon, FileJsonIcon, FileTextIcon, LoaderCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FileMeta, ProcessingStage } from "@/types/finance"

const STAGES: { id: ProcessingStage; label: string }[] = [
  { id: "uploading", label: "Загрузка файла" },
  { id: "validating", label: "Проверка формата" },
  { id: "parsing", label: "Разбор данных" },
  { id: "extracting", label: "Извлечение транзакций" },
  { id: "finalizing", label: "Подготовка отчёта" },
]

export function ProcessingState({ stage, fileMeta }: { stage: ProcessingStage; fileMeta: FileMeta | null }) {
  const currentIndex = STAGES.findIndex((s) => s.id === stage)

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card px-8 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {fileMeta?.kind === "json" ? (
              <FileJsonIcon className="size-5" />
            ) : (
              <FileTextIcon className="size-5" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Обработка выписки</h2>
            <p className="text-sm text-muted-foreground">
              {fileMeta?.name ?? "Файл"} обрабатывается локально, это займёт несколько секунд
            </p>
          </div>
        </div>

        <ul className="mt-8 flex flex-col gap-4">
          {STAGES.map((s, index) => {
            const isDone = index < currentIndex
            const isActive = index === currentIndex
            return (
              <li key={s.id} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                    isDone && "border-income bg-income text-income-foreground",
                    isActive && "border-primary text-primary",
                    !isDone && !isActive && "border-border text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <CheckIcon className="size-3.5" />
                  ) : isActive ? (
                    <LoaderCircleIcon className="size-3.5 animate-spin" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    isActive ? "font-medium text-foreground" : isDone ? "text-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
