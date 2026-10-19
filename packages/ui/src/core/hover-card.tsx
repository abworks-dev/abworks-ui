"use client"

// Inspired by ReUI; built as an Aboard adapter around Base UI Popover.
// Base UI does not provide a HoverCard primitive in this version.

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "../lib/cn"

type HoverCardTiming = {
  openDelay: number
  closeDelay: number
}

const HoverCardContext = React.createContext<HoverCardTiming>({
  openDelay: 0,
  closeDelay: 0,
})

type HoverCardRootProps = PopoverPrimitive.Root.Props &
  Partial<HoverCardTiming>

function HoverCard({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: HoverCardRootProps) {
  return (
    <HoverCardContext.Provider value={{ openDelay, closeDelay }}>
      <PopoverPrimitive.Root
        data-slot="hover-card"
        {...props}
        modal={false}
      />
    </HoverCardContext.Provider>
  )
}

type HoverCardTriggerProps = Omit<
  PopoverPrimitive.Trigger.Props,
  "openOnHover" | "delay" | "closeDelay"
>

function HoverCardTrigger({ ...props }: HoverCardTriggerProps) {
  const { openDelay, closeDelay } = React.useContext(HoverCardContext)

  return (
    <PopoverPrimitive.Trigger
      data-slot="hover-card-trigger"
      {...props}
      openOnHover
      delay={openDelay}
      closeDelay={closeDelay}
    />
  )
}

type HoverCardContentProps = PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "anchor"
    | "positionMethod"
    | "disableAnchorTracking"
    | "collisionBoundary"
    | "collisionPadding"
    | "sticky"
    | "arrowPadding"
    | "collisionAvoidance"
  >

function HoverCardContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  anchor,
  positionMethod,
  disableAnchorTracking,
  collisionBoundary,
  collisionPadding,
  sticky,
  arrowPadding,
  collisionAvoidance,
  ...props
}: HoverCardContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
        positionMethod={positionMethod}
        disableAnchorTracking={disableAnchorTracking}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        sticky={sticky}
        arrowPadding={arrowPadding}
        collisionAvoidance={collisionAvoidance}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "cn-hover-card-content cn-hover-card-content-logical z-50 origin-(--transform-origin) outline-hidden",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
}

export type {
  HoverCardContentProps,
  HoverCardRootProps,
  HoverCardTriggerProps,
}
