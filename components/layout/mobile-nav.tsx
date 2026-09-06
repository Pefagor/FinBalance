"use client"

import { useState } from "react"
import {
  LayoutDashboardIcon,
  ListIcon,
  MenuIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UploadIcon,
  WalletIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import type { WorkspaceView } from "./sidebar"
import type { AppStatus } from "@/types/finance"

const NAV_ITEMS: { id: WorkspaceView; label: string; icon: typeof LayoutDashboardIcon }[] = [
  { id: "dashboard", label: "Обзор", icon: LayoutDashboardIcon },
  { id: "transactions", label: "Транзакции", icon: ListIcon },
  { id: "advice", label: "AI-советы", icon: SparklesIcon },
]

export function MobileNav({
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
  const [open, setOpen] = useState(false)
  const navDisabled = status !== "ready"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Открыть меню" className="md:hidden" />}
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0">
        <SheetHeader className="border-b border-sidebar-border px-5 py-5">
          <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <WalletIcon className="size-4" />
            </div>
            FinAI
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-3 py-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                disabled={navDisabled}
                onClick={() => {
                  onViewChange(item.id)
                  setOpen(false)
                }}
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
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              onUploadNew()
              setOpen(false)
            }}
          >
            <UploadIcon data-icon="inline-start" />
            Загрузить выписку
          </Button>

          <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5 text-xs text-sidebar-foreground/80">
            <ShieldCheckIcon className="size-4 shrink-0 text-income" />
            <span>Данные обрабатываются локально</span>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-sidebar-foreground/60">Тема оформления</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
