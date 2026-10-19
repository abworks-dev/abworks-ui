// ReUI — MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/checkbox.tsx
"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "../lib/cn"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="cn-checkbox-indicator group/indicator grid place-content-center text-current transition-none"
      >
        {/* Aboard deviation: resolve upstream's Nova lucide Check placeholder;
            retain the existing mixed-state dash instead of rendering Check for both states. */}
        <Check aria-hidden="true" className="group-data-[indeterminate]/indicator:hidden" />
        <Minus aria-hidden="true" className="hidden group-data-[indeterminate]/indicator:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
