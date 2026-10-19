"use client"

// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
// Source: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/sheet.tsx
// Local adaptations: package-relative imports, Dialog composition, and logical RTL layout.

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "../lib/cn"
import { Button } from "./button"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "cn-sheet-overlay fixed inset-0 z-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none!",
        className
      )}
      {...props}
    />
  )
}

type SheetSide = "top" | "right" | "bottom" | "left"

type SheetContentProps = SheetPrimitive.Popup.Props & {
  side?: SheetSide
  showCloseButton?: boolean
  closeLabel?: string
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  closeLabel = "Close",
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "cn-sheet-content transition-[translate,opacity] duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none!",
          side === "right" && "data-[side=right]:inset-y-0 data-[side=right]:inset-e-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:sm:max-w-sm data-[side=right]:data-ending-style:translate-x-full data-[side=right]:data-starting-style:translate-x-full rtl:data-[side=right]:data-ending-style:-translate-x-full rtl:data-[side=right]:data-starting-style:-translate-x-full",
          side === "left" && "data-[side=left]:inset-y-0 data-[side=left]:inset-s-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:sm:max-w-sm data-[side=left]:data-ending-style:-translate-x-full data-[side=left]:data-starting-style:-translate-x-full rtl:data-[side=left]:data-ending-style:translate-x-full rtl:data-[side=left]:data-starting-style:translate-x-full",
          side === "top" && "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:-translate-y-full data-[side=top]:data-starting-style:-translate-y-full",
          side === "bottom" && "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-full data-[side=bottom]:data-starting-style:translate-y-full",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="cn-sheet-close"
                size="icon-sm"
                aria-label={closeLabel}
              />
            }
          >
            <XIcon />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("cn-sheet-header flex flex-col gap-1.5 p-4", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("cn-sheet-footer mt-auto flex flex-col gap-2 p-4", className)} {...props} />
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("cn-sheet-title cn-font-heading", className)} {...props} />
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn("cn-sheet-description", className)} {...props} />
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
export type { SheetSide, SheetContentProps }
