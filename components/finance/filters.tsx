"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DATE_RANGE_PRESET_LABELS } from "@/lib/dateUtils"
import { CURRENCY_LABELS } from "@/lib/format"
import type { DateRangePreset } from "@/types/finance"

const PRESET_ORDER: DateRangePreset[] = ["7d", "30d", "this-month", "last-month", "3m", "this-year"]

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangePreset)}>
      <SelectTrigger size="sm" className="w-40 bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {PRESET_ORDER.map((preset) => (
            <SelectItem key={preset} value={preset}>
              {DATE_RANGE_PRESET_LABELS[preset]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function CurrencyFilter({
  currencies,
  value,
  onChange,
}: {
  currencies: string[]
  value: string
  onChange: (value: string) => void
}) {
  if (currencies.length <= 1) return null

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-36 bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {currencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {CURRENCY_LABELS[currency] ?? currency}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
