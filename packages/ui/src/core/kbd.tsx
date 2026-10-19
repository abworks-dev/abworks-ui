// ReUI source adapted from upstream.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/kbd.tsx
// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "cn-kbd pointer-events-none inline-flex items-center justify-center select-none",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("cn-kbd-group inline-flex items-center", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
