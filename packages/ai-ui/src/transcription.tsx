// AI Elements - Apache-2.0
// Copyright (c) 2025 Vercel
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/transcription.tsx
// Aboard adaptations: local controllable state and DTO-only segment contract.
"use client"

import type { ComponentProps, ReactNode, MouseEvent } from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { cn } from "./utils"

export type TranscriptionSegmentData = { startSecond: number; endSecond: number; text: string }
type TranscriptionContextValue = { currentTime: number; onSeek?: (time: number) => void }
const TranscriptionContext = createContext<TranscriptionContextValue | null>(null)
const useTranscription = () => { const value = useContext(TranscriptionContext); if (!value) throw new Error("Transcription components must be used within Transcription"); return value }

export type TranscriptionProps = Omit<ComponentProps<"div">, "children"> & { segments: readonly TranscriptionSegmentData[]; currentTime?: number; onSeek?: (time: number) => void; children: (segment: TranscriptionSegmentData, index: number) => ReactNode }
export const Transcription = ({ segments, currentTime: controlledTime, onSeek, children, className, ...props }: TranscriptionProps) => {
  const [internalTime, setInternalTime] = useState(0)
  const currentTime = controlledTime ?? internalTime
  const seek = useCallback((time: number) => { setInternalTime(time); onSeek?.(time) }, [onSeek])
  const context = useMemo(() => ({ currentTime, onSeek: onSeek ? seek : undefined }), [currentTime, onSeek, seek])
  return <TranscriptionContext.Provider value={context}><div className={cn("flex flex-wrap gap-1 text-sm leading-relaxed", className)} data-slot="transcription" {...props}>{segments.map((segment, index) => segment.text.trim() ? children(segment, index) : null)}</div></TranscriptionContext.Provider>
}

export type TranscriptionSegmentProps = ComponentProps<"button"> & { segment: TranscriptionSegmentData; index: number }
export const TranscriptionSegment = ({ segment, index, className, onClick, ...props }: TranscriptionSegmentProps) => {
  const { currentTime, onSeek } = useTranscription()
  const active = currentTime >= segment.startSecond && currentTime < segment.endSecond
  const past = currentTime >= segment.endSecond
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => { onSeek?.(segment.startSecond); onClick?.(event) }
  return <button className={cn("inline text-left", active && "text-primary", past && "text-muted-foreground", !active && !past && "text-muted-foreground/60", onSeek ? "cursor-pointer hover:text-foreground" : "cursor-default", className)} data-active={active ? "true" : "false"} data-index={index} data-slot="transcription-segment" onClick={handleClick} type="button" {...props}>{segment.text}</button>
}
