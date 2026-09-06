"use client"

import {
  LayoutDashboardIcon,
  ListIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UploadIcon,
  WalletIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { AppStatus } from "@/types/finance"

export type WorkspaceView = "dashboard" | "transactions" | "advice"

interface NavItem {
  id: WorkspaceView
  label: string
  icon: typeof LayoutDashboardIcon
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Обзор", icon: LayoutDashboardIcon },
  { id: "transactions", label: "Транзакции", icon: ListIcon },
  { id: "advice", label: "AI-советы", icon: SparklesIcon },
]

export function AppSidebar({
  activeView,
  onViewChange,
  status,
  onUploadNew,
}: {
  activeView: WorkspaceView
  onViewChange: (view: WorkspaceView) => void
  status: AppStatus
  onUploadNew: () => void
}) {
  const navDisabled = status !== "ready"

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <WalletIcon className="size-4" />
        </div>
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">FinAI</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              type="button"
              disabled={navDisabled}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="flex flex-col gap-3 px-3 pb-4">
        <Button variant="outline" className="justify-start gap-2" onClick={onUploadNew}>
          <UploadIcon data-icon="inline-start" />
          Загрузить выписку
        </Button>

        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5 text-xs text-sidebar-foreground/80">
          <ShieldCheckIcon className="size-4 shrink-0 text-income" />
          <span>Все данные обрабатываются локально, на вашем устройстве</span>
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-sidebar-foreground/60">Тема оформления</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
