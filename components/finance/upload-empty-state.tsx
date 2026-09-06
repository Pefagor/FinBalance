"use client"

import { useCallback, useRef, useState } from "react"
import { FileJsonIcon, FileTextIcon, ShieldCheckIcon, UploadCloudIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SourceFileKind } from "@/types/finance"

function detectKind(fileName: string): SourceFileKind | null {
  const lower = fileName.toLowerCase()
  if (lower.endsWith(".pdf")) return "pdf"
  if (lower.endsWith(".json")) return "json"
  return null
}

export function UploadEmptyState({
  onFileSelected,
}: {
  onFileSelected: (file: File, kind: SourceFileKind) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (!file) return
      const kind = detectKind(file.name) ?? "pdf"
      onFileSelected(file, kind)
    },
    [onFileSelected],
  )

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-border bg-card px-8 py-14 text-center transition-colors",
            isDragging && "border-primary bg-accent/40",
          )}
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloudIcon className="size-6" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-semibold text-foreground">Загрузите банковскую выписку</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Перетащите файл сюда или выберите его на компьютере. Поддерживаются форматы PDF и JSON.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button onClick={() => inputRef.current?.click()}>
              <UploadCloudIcon data-icon="inline-start" />
              Выбрать файл
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.json"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileTextIcon className="size-3.5" /> PDF выписка
            </span>
            <span className="flex items-center gap-1.5">
              <FileJsonIcon className="size-3.5" /> JSON экспорт
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-3.5 shrink-0 text-income" />
          Файл не покидает ваше устройство — весь разбор и анализ выполняются локально
        </div>
      </div>
    </div>
  )
}