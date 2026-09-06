"use client"

import { FileTextIcon, FileJsonIcon } from "lucide-react"
import { MobileNav } from "./mobile-nav"
import type { WorkspaceView } from "./sidebar"
import type { AppStatus, FileMeta } from "@/types/finance"
import { Badge } from "@/components/ui/badge"

const VIEW_META: Record<WorkspaceView, { title: string; description: string }> = {
  dashboard: {
    title: "Обзор",
    description: "Сводка доходов, расходов и баланса за выбранный период",
  },
  transactions: {
    title: "Транзакции",
    description: "Полный список операций из вашей выписки",
  },
  advice: {
    title: "AI-советы",
    description: "Персональные рекомендации на основе ваших трат",
  },
}

export function AppHeader({
  activeView,
  onViewChange,
  status,
  onUploadNew,
  fileMeta,
  children,
}: {
  activeView: WorkspaceView
  onViewChange: (view: WorkspaceView) => void
  status: AppStatus
  onUploadNew: () => void
  fileMeta: FileMeta | null
  children?: React.ReactNode
}) {
  const meta = VIEW_META[activeView]

  return (
    <header className="flex flex-col gap-3 border-b border-border bg-background px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-5">
      <div className="flex items-center gap-2">
        <MobileNav activeView={activeView} onViewChange={onViewChange} status={status} onUploadNew={onUploadNew} />
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {status === "ready" ? meta.title : "FinAI"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {status === "ready" ? meta.description : "Локальный анализ ваших финансов"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {fileMeta && status === "ready" && (
          <Badge variant="secondary" className="gap-1.5 py-1.5">
            {fileMeta.kind === "pdf" ? <FileTextIcon className="size-3.5" /> : <FileJsonIcon className="size-3.5" />}
            {fileMeta.name}
          </Badge>
        )}
        {children}
      </div>
    </header>
  )
}
