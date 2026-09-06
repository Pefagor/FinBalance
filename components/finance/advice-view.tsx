"use client"

import { LightbulbIcon, RefreshCwIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import type { Advice } from "@/types/finance"

export function AdviceView({
  advice,
  isLoading,
  hasRequested,
  onGenerate,
}: {
  advice: Advice[]
  isLoading: boolean
  hasRequested: boolean
  onGenerate: () => void
}) {
  if (!hasRequested && !isLoading) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SparklesIcon />
          </EmptyMedia>
          <EmptyTitle>Персональные советы по вашим финансам</EmptyTitle>
          <EmptyDescription>
            Локальная модель проанализирует ваши транзакции и предложит до трёх практических рекомендаций
          </EmptyDescription>
        </EmptyHeader>
        <Button onClick={onGenerate}>
          <SparklesIcon data-icon="inline-start" />
          Получить AI совет
        </Button>
      </Empty>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-ai/25 bg-ai/10 px-4 py-3 text-sm text-foreground">
          <SparklesIcon className="size-4 shrink-0 animate-pulse text-ai" />
          Анализируем транзакции и формируем рекомендации...
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (advice.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SparklesIcon />
          </EmptyMedia>
          <EmptyTitle>Модель не нашла заметных рекомендаций</EmptyTitle>
          <EmptyDescription>
            Ваши финансы выглядят сбалансированно. Попробуйте повторить анализ после новых операций
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={onGenerate}>
          <RefreshCwIcon data-icon="inline-start" />
          Повторить анализ
        </Button>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ai/25 bg-ai/10 px-4 py-3 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 shrink-0 text-ai" />
          Рекомендации сформированы локальной моделью на основе анализа ваших транзакций
        </div>
        <Button size="sm" variant="ghost" onClick={onGenerate}>
          <RefreshCwIcon data-icon="inline-start" />
          Обновить
        </Button>
      </div>

      {advice.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex-row items-start gap-3 space-y-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ai/15 text-ai">
              <LightbulbIcon className="size-4" />
            </div>
            <CardTitle className="text-base font-semibold leading-relaxed">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="pl-[3.75rem]">
            <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
