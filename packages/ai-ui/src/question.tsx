// AI Elements — Apache-2.0
// Copyright (c) 2025 Vercel, Inc.
// Upstream: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/question.tsx
// ABWorks adaptation: @abworks-dev/ui primitives, semantic tokens, and caller-owned callbacks.
"use client"

import type {
  ChangeEvent,
  ComponentProps,
  FormEvent,
  HTMLAttributes,
  ReactNode,
} from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

import { Button } from "@abworks-dev/ui"
import { Textarea } from "@abworks-dev/ui"

import { cn } from "./utils"

export interface QuestionValue {
  selectedValues: readonly string[]
  text: string
}

export interface QuestionResponse {
  selectedValues: readonly string[]
  text?: string
}

type SelectionMode = "multiple" | "single"

interface QuestionContextValue {
  disabled: boolean
  selectedValues: readonly string[]
  selectionMode: SelectionMode
  setText: (text: string) => void
  text: string
  toggleValue: (value: string) => void
}

const QuestionContext = createContext<QuestionContextValue | null>(null)

const useQuestion = () => {
  const context = useContext(QuestionContext)

  if (!context) {
    throw new Error("Question components must be used within Question")
  }

  return context
}

export type QuestionProps = Omit<
  ComponentProps<"form">,
  "defaultValue" | "onSubmit" | "value"
> & {
  defaultValue?: QuestionValue
  disabled?: boolean
  onSubmit?: (
    response: QuestionResponse,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>
  onValueChange?: (value: QuestionValue) => void
  selectionMode?: SelectionMode
  value?: QuestionValue
}

const EMPTY_VALUE: QuestionValue = { selectedValues: [], text: "" }

const getSelectedValues = (
  currentValues: readonly string[],
  optionValue: string,
  selectionMode: SelectionMode
): readonly string[] => {
  const isSelected = currentValues.includes(optionValue)

  if (selectionMode === "single") {
    return isSelected ? currentValues : [optionValue]
  }

  if (isSelected) {
    return currentValues.filter((item) => item !== optionValue)
  }

  return [...currentValues, optionValue]
}

export const Question = ({
  children,
  className,
  defaultValue = EMPTY_VALUE,
  disabled = false,
  onSubmit,
  onValueChange,
  selectionMode = "single",
  value: controlledValue,
  ...props
}: QuestionProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = controlledValue ?? internalValue

  const setValue = useCallback(
    (nextValue: QuestionValue) => {
      if (controlledValue === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [controlledValue, onValueChange]
  )

  const setText = useCallback(
    (text: string) => {
      setValue({ ...value, text })
    },
    [setValue, value]
  )

  const toggleValue = useCallback(
    (optionValue: string) => {
      const selectedValues = getSelectedValues(
        value.selectedValues,
        optionValue,
        selectionMode
      )
      setValue({ ...value, selectedValues })
    },
    [selectionMode, setValue, value]
  )

  const contextValue = useMemo(
    () => ({
      disabled,
      selectedValues: value.selectedValues,
      selectionMode,
      setText,
      text: value.text,
      toggleValue,
    }),
    [disabled, selectionMode, setText, toggleValue, value]
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (disabled) {
        return
      }

      const text = value.text.trim()
      if (value.selectedValues.length === 0 && text.length === 0) {
        return
      }

      await onSubmit?.(
        {
          selectedValues: value.selectedValues,
          text: text.length > 0 ? text : undefined,
        },
        event
      )
    },
    [disabled, onSubmit, value]
  )

  return (
    <QuestionContext.Provider value={contextValue}>
      <form
        className={cn(
          "space-y-4 rounded-lg border border-border bg-background p-4",
          className
        )}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    </QuestionContext.Provider>
  )
}

export type QuestionPromptProps = HTMLAttributes<HTMLParagraphElement>

export const QuestionPrompt = ({ className, ...props }: QuestionPromptProps) => (
  <p className={cn("font-medium text-sm", className)} {...props} />
)

export type QuestionDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const QuestionDescription = ({
  className,
  ...props
}: QuestionDescriptionProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

export type QuestionOptionsProps = HTMLAttributes<HTMLDivElement>

export const QuestionOptions = ({
  className,
  onFocus,
  ...props
}: QuestionOptionsProps) => {
  const { selectedValues, selectionMode } = useQuestion()

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
      role={selectionMode === "single" ? "radiogroup" : "group"}
      tabIndex={selectionMode === "single" && selectedValues.length === 0 ? 0 : undefined}
      onFocus={(event) => {
        onFocus?.(event)
        if (selectionMode === "single" && event.target === event.currentTarget) {
          event.currentTarget.querySelector<HTMLButtonElement>(
            '[role="radio"]:not(:disabled)',
          )?.focus()
        }
      }}
    />
  )
}

export type QuestionOptionProps = Omit<ComponentProps<typeof Button>, "value"> & {
  value: string
}

export const QuestionOption = ({
  children,
  className,
  disabled,
  onClick,
  onKeyDown,
  value,
  variant,
  ...props
}: QuestionOptionProps) => {
  const question = useQuestion()
  const isSelected = question.selectedValues.includes(value)
  const role = question.selectionMode === "single" ? "radio" : "checkbox"
  const handleClick = useCallback(
    (event: Parameters<NonNullable<QuestionOptionProps["onClick"]>>[0]) => {
      question.toggleValue(value)
      onClick?.(event)
    },
    [onClick, question, value]
  )

  const handleKeyDown = useCallback(
    (event: Parameters<NonNullable<QuestionOptionProps["onKeyDown"]>>[0]) => {
      onKeyDown?.(event)
      if (
        question.selectionMode !== "single" ||
        event.defaultPrevented ||
        !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)
      ) {
        return
      }

      const options = Array.from(
        event.currentTarget.closest('[role="radiogroup"]')?.querySelectorAll<HTMLButtonElement>(
          '[role="radio"]:not(:disabled)',
        ) ?? [],
      )
      if (options.length < 2) return
      event.preventDefault()
      const currentIndex = options.indexOf(event.currentTarget)
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (currentIndex + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + options.length) % options.length
      const nextOption = options[nextIndex]
      nextOption.focus()
      nextOption.click()
    },
    [onKeyDown, question.selectionMode],
  )

  return (
    <Button
      {...props}
      aria-checked={isSelected}
      tabIndex={role === "radio" ? (isSelected ? 0 : -1) : undefined}
      className={cn("h-auto whitespace-normal", className)}
      disabled={question.disabled || disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={role}
      type="button"
      variant={variant ?? (isSelected ? "default" : "outline")}
    >
      {children ?? value}
    </Button>
  )
}

export type QuestionInputProps = Omit<
  ComponentProps<typeof Textarea>,
  "defaultValue" | "value"
>

export const QuestionInput = ({
  className,
  disabled,
  onChange,
  ...props
}: QuestionInputProps) => {
  const question = useQuestion()
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      question.setText(event.currentTarget.value)
      onChange?.(event)
    },
    [onChange, question]
  )

  return (
    <Textarea
      className={cn("min-h-20", className)}
      disabled={question.disabled || disabled}
      onChange={handleChange}
      value={question.text}
      {...props}
    />
  )
}

export type QuestionActionsProps = HTMLAttributes<HTMLDivElement>

export const QuestionActions = ({
  className,
  ...props
}: QuestionActionsProps) => (
  <div
    className={cn("flex items-center justify-end gap-2", className)}
    {...props}
  />
)

export type QuestionSubmitProps = ComponentProps<typeof Button> & {
  children?: ReactNode
}

export const QuestionSubmit = ({
  children = "Submit",
  disabled,
  ...props
}: QuestionSubmitProps) => {
  const question = useQuestion()
  const hasResponse =
    question.selectedValues.length > 0 || question.text.trim().length > 0

  return (
    <Button
      disabled={question.disabled || disabled || !hasResponse}
      type="submit"
      {...props}
    >
      {children}
    </Button>
  )
}
