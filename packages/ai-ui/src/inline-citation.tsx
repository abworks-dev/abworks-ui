"use client"

// Apache-2.0 (upstream repository)
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/inline-citation.tsx

import { Badge } from "@aboard/ui/core/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@aboard/ui/core/hover-card"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { cn } from "./utils"

export type InlineCitationProps = ComponentProps<"span">

export const InlineCitation = ({ className, ...props }: InlineCitationProps) => (
  <span className={cn("group inline items-center gap-1", className)} {...props} />
)

export type InlineCitationTextProps = ComponentProps<"span">

export const InlineCitationText = ({ className, ...props }: InlineCitationTextProps) => (
  <span className={cn("transition-colors group-hover:bg-accent", className)} {...props} />
)

export type InlineCitationCardProps = ComponentProps<typeof HoverCard>

export const InlineCitationCard = (props: InlineCitationCardProps) => (
  <HoverCard closeDelay={0} openDelay={0} {...props} />
)

export type InlineCitationCardTriggerProps = ComponentProps<typeof Badge> & { sources: string[] }

function sourceHostname(source: string | undefined) {
  if (!source) return undefined
  try {
    const url = new URL(source)
    return url.protocol === "http:" || url.protocol === "https:" ? url.hostname : undefined
  } catch {
    return undefined
  }
}

export const InlineCitationCardTrigger = ({ sources, className, children, ...props }: InlineCitationCardTriggerProps) => {
  const hostname = sourceHostname(sources[0])
  const label = children ?? (hostname ? <>{hostname}{sources.length > 1 && ` +${sources.length - 1}`}</> : "unknown")

  return (
    <HoverCardTrigger render={<Badge variant="secondary" className={cn("ml-1 rounded-full", className)} {...props} />}>
      {label}
    </HoverCardTrigger>
  )
}

export type InlineCitationCardBodyProps = ComponentProps<"div">

export const InlineCitationCardBody = ({ className, ...props }: InlineCitationCardBodyProps) => (
  <HoverCardContent className={cn("relative w-80 p-0", className)} {...props} />
)

type CarouselApi = {
  scrollPrev: () => void
  scrollNext: () => void
  scrollSnapList: () => number[]
  selectedScrollSnap: () => number
  on: (event: "select", listener: () => void) => void
  off: (event: "select", listener: () => void) => void
}

const CarouselApiContext = createContext<CarouselApi | undefined>(undefined)
const useCarouselApi = () => useContext(CarouselApiContext)

export type InlineCitationCarouselProps = ComponentProps<"div"> & { setApi?: (api: CarouselApi) => void }

export const InlineCitationCarousel = ({ className, children, setApi: externalSetApi, ...props }: InlineCitationCarouselProps) => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const listenersRef = useRef(new Set<() => void>())
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const getItems = () => Array.from(viewport.querySelectorAll<HTMLElement>("[data-inline-citation-carousel-item]"))
    const getIndex = () => {
      const items = getItems()
      if (!items.length) return 0
      const position = viewport.scrollLeft
      return Math.max(0, items.findIndex((item) => item.offsetLeft >= position - item.offsetWidth / 2))
    }
    const carouselApi: CarouselApi = {
      scrollPrev: () => viewport.scrollBy({ left: -(viewport.clientWidth || 1), behavior: "smooth" }),
      scrollNext: () => viewport.scrollBy({ left: viewport.clientWidth || 1, behavior: "smooth" }),
      scrollSnapList: () => getItems().map((_, index) => index),
      selectedScrollSnap: getIndex,
      on: (_event, listener) => listenersRef.current.add(listener),
      off: (_event, listener) => listenersRef.current.delete(listener),
    }
    setApi(carouselApi)
    externalSetApi?.(carouselApi)
    const notify = () => listenersRef.current.forEach((listener) => listener())
    viewport.addEventListener("scroll", notify, { passive: true })
    return () => viewport.removeEventListener("scroll", notify)
  }, [externalSetApi])

  return (
    <CarouselApiContext.Provider value={api}>
      <div className={cn("w-full", className)} {...props}>
        <div ref={viewportRef} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-none">
          {children}
        </div>
      </div>
    </CarouselApiContext.Provider>
  )
}

export type InlineCitationCarouselContentProps = ComponentProps<"div">
export const InlineCitationCarouselContent = ({ className, ...props }: InlineCitationCarouselContentProps) => (
  <div className={cn("flex min-w-full gap-0", className)} {...props} />
)

export type InlineCitationCarouselItemProps = ComponentProps<"div">
export const InlineCitationCarouselItem = ({ className, ...props }: InlineCitationCarouselItemProps) => (
  <div data-inline-citation-carousel-item="true" className={cn("w-full shrink-0 snap-start space-y-2 p-4 pl-8", className)} {...props} />
)

export type InlineCitationCarouselHeaderProps = ComponentProps<"div">
export const InlineCitationCarouselHeader = ({ className, ...props }: InlineCitationCarouselHeaderProps) => (
  <div className={cn("flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2", className)} {...props} />
)

export type InlineCitationCarouselIndexProps = ComponentProps<"div">
export const InlineCitationCarouselIndex = ({ children, className, ...props }: InlineCitationCarouselIndexProps) => {
  const api = useCarouselApi()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const syncState = useCallback(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
  }, [api])
  useEffect(() => {
    if (!api) return
    syncState()
    api.on("select", syncState)
    return () => api.off("select", syncState)
  }, [api, syncState])
  return <div className={cn("flex flex-1 items-center justify-end px-3 py-1 text-muted-foreground text-xs", className)} {...props}>{children ?? `${current}/${count}`}</div>
}

export type InlineCitationCarouselPrevProps = ComponentProps<"button">
export const InlineCitationCarouselPrev = ({ className, children, ...props }: InlineCitationCarouselPrevProps) => {
  const api = useCarouselApi()
  return <button aria-label="Previous" className={cn("shrink-0", className)} onClick={() => api?.scrollPrev()} type="button" {...props}>{children ?? <ArrowLeftIcon className="size-4 text-muted-foreground" />}</button>
}

export type InlineCitationCarouselNextProps = ComponentProps<"button">
export const InlineCitationCarouselNext = ({ className, children, ...props }: InlineCitationCarouselNextProps) => {
  const api = useCarouselApi()
  return <button aria-label="Next" className={cn("shrink-0", className)} onClick={() => api?.scrollNext()} type="button" {...props}>{children ?? <ArrowRightIcon className="size-4 text-muted-foreground" />}</button>
}

export type InlineCitationSourceProps = ComponentProps<"div"> & { title?: string; url?: string; description?: string }
export const InlineCitationSource = ({ title, url, description, className, children, ...props }: InlineCitationSourceProps) => (
  <div className={cn("space-y-1", className)} {...props}>
    {title && <h4 className="truncate font-medium text-sm leading-tight">{title}</h4>}
    {url && <p className="truncate break-all text-muted-foreground text-xs">{url}</p>}
    {description && <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">{description}</p>}
    {children}
  </div>
)

export type InlineCitationQuoteProps = ComponentProps<"blockquote">
export const InlineCitationQuote = ({ children, className, ...props }: InlineCitationQuoteProps) => (
  <blockquote className={cn("border-muted border-l-2 pl-3 text-muted-foreground text-sm italic", className)} {...props}>{children}</blockquote>
)
