"use client"

// ReUI — MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream reference: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry-reui/bases/base/reui/date-selector.tsx
// Aboard adaptation: compact Base UI composition reusing the shared Calendar, Popover, and Button.

import * as React from "react"
import { CalendarDaysIcon, XIcon } from "lucide-react"
import type { DateRange, Locale } from "react-day-picker"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "../lib/cn"

export type DateRangePickerProps = {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (value: DateRange | undefined) => void
  disabled?: boolean
  numberOfMonths?: number
  locale?: Locale
  placeholder?: string
  "aria-label"?: string
  className?: string
}

function formatRange(value: DateRange | undefined, locale?: Locale) {
  if (!value?.from) return undefined

  const formatter = new Intl.DateTimeFormat(locale?.code, {
    dateStyle: "medium",
  })
  const start = formatter.format(value.from)
  return value.to ? `${start} – ${formatter.format(value.to)}` : start
}

function DateRangePicker(props: DateRangePickerProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    numberOfMonths = 2,
    locale,
    placeholder = "Select date range",
    "aria-label": ariaLabel = "Select date range",
    className,
  } = props
  const controlled = Object.prototype.hasOwnProperty.call(props, "value")
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const selected = controlled ? value : uncontrolledValue
  const displayValue = formatRange(selected, locale)
  const hasValue = Boolean(selected?.from)

  const updateValue = (nextValue: DateRange | undefined) => {
    if (!controlled) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <Popover>
      <div className={cn("inline-flex items-center", className)}>
        <PopoverTrigger
          disabled={disabled}
          aria-label={ariaLabel}
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                "min-w-56 justify-start gap-2 font-normal",
                !displayValue && "text-muted-foreground"
              )}
            />
          }
        >
          <CalendarDaysIcon aria-hidden="true" className="size-4" />
          <span className="min-w-0 flex-1 truncate text-start">
            {displayValue ?? placeholder}
          </span>
        </PopoverTrigger>
        {hasValue && !disabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear date range"
            className="ms-1 size-8 shrink-0"
            onClick={() => updateValue(undefined)}
          >
            <XIcon aria-hidden="true" className="size-4" />
          </Button>
        ) : null}
      </div>
      <PopoverContent
        align="start"
        className="w-auto p-0"
        aria-label={`${ariaLabel} calendar`}
      >
        <Calendar
          mode="range"
          selected={selected}
          onSelect={(nextValue) => {
            updateValue(nextValue)
          }}
          numberOfMonths={numberOfMonths}
          locale={locale}
          aria-label={`${ariaLabel} calendar`}
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }
