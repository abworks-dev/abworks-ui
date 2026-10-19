// ReUI - MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/switch.tsx
"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "../lib/cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "cn-switch peer group/switch relative inline-flex items-center transition-colors motion-reduce:transition-none outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="cn-switch-thumb pointer-events-none block ring-0 transition-transform motion-reduce:transition-none"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
