// AI Elements - Apache-2.0
// Copyright (c) 2025 Vercel
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/suggestion.tsx
"use client"

import { Button } from "@abworks-dev/ui/core/button"
import { cn } from "./utils"
import type { ComponentProps, KeyboardEvent } from "react"
import { useCallback } from "react"

export type SuggestionsProps = ComponentProps<"div">

export const Suggestions = ({
  className,
  children,
  onKeyDown,
  tabIndex,
  ...props
}: SuggestionsProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const element = event.currentTarget
    if (event.key === "ArrowLeft") {
      element.scrollBy({ left: -element.clientWidth / 2, behavior: "smooth" })
      event.preventDefault()
    } else if (event.key === "ArrowRight") {
      element.scrollBy({ left: element.clientWidth / 2, behavior: "smooth" })
      event.preventDefault()
    } else if (event.key === "Home") {
      element.scrollTo({ left: 0, behavior: "smooth" })
      event.preventDefault()
    } else if (event.key === "End") {
      element.scrollTo({ left: element.scrollWidth, behavior: "smooth" })
      event.preventDefault()
    }
  }

  return (
    <div
      aria-label="Suggestions"
      className="w-full overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      data-slot="suggestions"
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex ?? 0}
      {...props}
    >
      <div className={cn("flex w-max flex-nowrap items-center gap-2", className)}>
        {children}
      </div>
    </div>
  )
}

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string
  onClick?: (suggestion: string) => void
}

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = useCallback(() => {
    onClick?.(suggestion)
  }, [onClick, suggestion])

  return (
    <Button
      className={cn("cursor-pointer rounded-full px-4", className)}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  )
}
