"use client"

// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
// Source: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/sonner.tsx
// Local adaptations: package-relative imports, lucide-react icons, and a provider-free theme default.

import type * as React from "react"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

/**
 * A Sonner toaster that keeps the upstream `theme` prop available without
 * requiring `next-themes`. ABWorks defaults to the standard Sonner `system`
 * theme; callers can pass `light`, `dark`, or `system` directly.
 */
function Toaster({ theme = "system", closeButton = true, ...props }: ToasterProps) {
  return (
    <Sonner
      theme={theme}
      closeButton={closeButton}
      duration={5000}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          error: "cn-toast-error",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
export type { ToasterProps }
