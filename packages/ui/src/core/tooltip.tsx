"use client"

// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
// Source: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/tooltip.tsx
// Local adaptations: package-relative imports, lucide-react icons, and the
// documented tooltip description wiring recorded in
// `packages/ui/src/styles/reui/README.md`.

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "../lib/cn"

/**
 * ABWorks adaptation: the pinned upstream leaves the popup without tooltip
 * semantics, so a tooltip is announced as a plain element. ABWorks exposes the
 * popup as `role="tooltip"` and points the trigger at it through
 * `aria-describedby`.
 *
 * The reference is set even while the tooltip is closed, because the popup only
 * exists in the DOM while it is open; a dangling IDREF is ignored by assistive
 * technology, and the alternative (mirroring Base UI's open state) would fork
 * the primitive's state owner.
 */
const TooltipContentIdContext = React.createContext<string | undefined>(undefined)

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  const contentId = `${React.useId()}-tooltip`
  return (
    <TooltipContentIdContext.Provider value={contentId}>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipContentIdContext.Provider>
  )
}

function TooltipTrigger({
  "aria-describedby": ariaDescribedBy,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  const contentId = React.useContext(TooltipContentIdContext)
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      aria-describedby={ariaDescribedBy ?? contentId}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  id,
  role = "tooltip",
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const contentId = React.useContext(TooltipContentIdContext)
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          id={id ?? contentId}
          role={role}
          className={cn(
            "cn-tooltip-content cn-tooltip-content-logical z-50 w-fit max-w-xs origin-(--transform-origin) bg-foreground text-background",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="cn-tooltip-arrow cn-tooltip-arrow-logical z-50 bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
