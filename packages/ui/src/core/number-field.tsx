// ReUI — MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry-reui/bases/base/reui/number-field.tsx
// ABWorks adaptations: Base UI 1.7.0, semantic tokens, data-slot markers, and lucide-react icons.
"use client"

import { createContext, useContext, useId, type ReactNode } from "react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { cva, type VariantProps } from "class-variance-authority"
import { MinusIcon, PlusIcon, MoveHorizontalIcon } from "lucide-react"

import { cn } from "../lib/cn"

const numberFieldGroupVariants = cva(
  "cn-number-field-group relative flex w-full items-stretch justify-between border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:border-destructive focus-within:has-aria-invalid:border-destructive",
  {
    variants: {
      size: {
        sm: "h-7 text-sm",
        default: "h-8 text-sm",
        lg: "h-9 text-sm",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const numberFieldButtonVariants = cva(
  "cn-number-field-button relative flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-foreground transition-colors outline-none select-none hover:bg-accent active:bg-accent/80 focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "w-7 px-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        default: "w-8 px-2 [&_svg:not([class*='size-'])]:size-4",
        lg: "w-9 px-2.5 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const numberFieldInputVariants = cva(
  "cn-number-field-input w-full min-w-0 flex-1 bg-transparent px-2.5 py-1 text-center tabular-nums text-foreground outline-none placeholder:text-muted-foreground focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "px-2 py-0.5",
        default: "px-2.5 py-1",
        lg: "px-2.5 py-1.5",
      },
    },
    defaultVariants: { size: "default" },
  }
)

type NumberFieldSize = NonNullable<VariantProps<typeof numberFieldGroupVariants>["size"]>

type NumberFieldContextValue = {
  fieldId: string
  size: NumberFieldSize
}

const NumberFieldContext = createContext<NumberFieldContextValue | null>(null)

function useNumberFieldContext(component: string) {
  const context = useContext(NumberFieldContext)
  if (!context) {
    throw new Error(`${component} must be used within a NumberField component.`)
  }
  return context
}

function NumberField({
  id,
  className,
  size = "default",
  ...props
}: NumberFieldPrimitive.Root.Props & VariantProps<typeof numberFieldGroupVariants>) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const sizeValue = size ?? "default"

  return (
    <NumberFieldContext.Provider value={{ fieldId, size: sizeValue }}>
      <NumberFieldPrimitive.Root
        data-size={sizeValue}
        data-slot="number-field"
        id={fieldId}
        className={cn("cn-number-field flex w-full flex-col items-start gap-2", className)}
        {...props}
      />
    </NumberFieldContext.Provider>
  )
}

function NumberFieldGroup({
  className,
  size: sizeProp,
  ...props
}: NumberFieldPrimitive.Group.Props & Partial<VariantProps<typeof numberFieldGroupVariants>>) {
  const context = useNumberFieldContext("NumberFieldGroup")
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(numberFieldGroupVariants({ size }), "rounded-lg", className)}
      {...props}
    />
  )
}

function NumberFieldDecrement({
  className,
  size: sizeProp,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props &
  Partial<VariantProps<typeof numberFieldButtonVariants>> & { children?: ReactNode }) {
  const context = useNumberFieldContext("NumberFieldDecrement")
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(numberFieldButtonVariants({ size }), "rounded-s-[inherit] border-e border-input", className)}
      {...props}
    >
      {children ?? <MinusIcon aria-hidden="true" />}
    </NumberFieldPrimitive.Decrement>
  )
}

function NumberFieldIncrement({
  className,
  size: sizeProp,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props &
  Partial<VariantProps<typeof numberFieldButtonVariants>> & { children?: ReactNode }) {
  const context = useNumberFieldContext("NumberFieldIncrement")
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(numberFieldButtonVariants({ size }), "rounded-e-[inherit] border-s border-input", className)}
      {...props}
    >
      {children ?? <PlusIcon aria-hidden="true" />}
    </NumberFieldPrimitive.Increment>
  )
}

function NumberFieldInput({
  className,
  size: sizeProp,
  ...props
}: NumberFieldPrimitive.Input.Props &
  Partial<VariantProps<typeof numberFieldInputVariants>>) {
  const context = useNumberFieldContext("NumberFieldInput")
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(numberFieldInputVariants({ size }), className)}
      {...props}
    />
  )
}

function NumberFieldScrubArea({
  className,
  label,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props & { label: string }) {
  const context = useNumberFieldContext("NumberFieldScrubArea")

  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("cn-number-field-scrub-area flex cursor-ew-resize items-center gap-1 select-none", className)}
      {...props}
    >
      <label className="cursor-ew-resize text-sm font-medium text-foreground" htmlFor={context.fieldId}>
        {label}
      </label>
      <NumberFieldPrimitive.ScrubAreaCursor data-slot="number-field-scrub-area-cursor" className="text-muted-foreground">
        <MoveHorizontalIcon aria-hidden="true" className="size-4" />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  )
}

export {
  NumberField,
  NumberFieldScrubArea,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldGroup,
  NumberFieldInput,
}

export type { NumberFieldSize }
