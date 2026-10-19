// AI Elements - Apache-2.0
// Copyright (c) 2025 Vercel
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/audio-player.tsx
// ABWorks adaptations: native audio only; source and media lifecycle remain caller-owned.
"use client"

import type { ComponentProps, CSSProperties, ReactNode, ChangeEvent } from "react"
import { createContext, useContext, useMemo, useRef, useState } from "react"
import { Button, ButtonGroup, ButtonGroupText } from "@abworks-dev/ui"
import { PauseIcon, PlayIcon, RotateCcwIcon, RotateCwIcon, Volume2Icon, VolumeXIcon } from "lucide-react"
import { cn } from "./utils"

type AudioPlayerContextValue = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  playing: boolean
  sync: () => void
}
const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)
const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext)
  if (!context) throw new Error("AudioPlayer controls must be used within AudioPlayer")
  return context
}
const formatTime = (seconds: number) => {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0
  return `${Math.floor(safe / 60).toString().padStart(2, "0")}:${Math.floor(safe % 60).toString().padStart(2, "0")}`
}
const rangeInputClassName = "absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 opacity-0"
const RangeVisual = ({ value, max }: { value: number; max: number }) => {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  const thumbTranslate = percent === 0 ? "0%" : percent === 100 ? "-100%" : "-50%"
  return <span aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border"><span className="block h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /><span className="absolute top-1/2 size-3 rounded-full bg-primary" style={{ left: `${percent}%`, transform: `translate(${thumbTranslate}, -50%)` }} /></span>
}

export type AudioPlayerProps = ComponentProps<"div"> & { children?: ReactNode }
export const AudioPlayer = ({ className, style, children, ...props }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [state, setState] = useState({ currentTime: 0, duration: 0, volume: 1, muted: false, playing: false })
  const sync = () => {
    const audio = audioRef.current
    if (audio) setState({ currentTime: audio.currentTime, duration: Number.isFinite(audio.duration) ? audio.duration : 0, volume: audio.volume, muted: audio.muted, playing: !audio.paused })
  }
  const context = useMemo(() => ({ audioRef, ...state, sync }), [state])
  return <AudioPlayerContext.Provider value={context}><div className={cn("flex flex-col gap-2", className)} data-slot="audio-player" style={{
    "--media-background-color": "transparent",
    "--media-button-icon-height": "1rem",
    "--media-button-icon-width": "1rem",
    "--media-control-background": "transparent",
    "--media-control-hover-background": "var(--color-accent)",
    "--media-control-padding": "0",
    "--media-font": "var(--font-sans)",
    "--media-font-size": "10px",
    "--media-icon-color": "currentColor",
    "--media-primary-color": "var(--color-primary)",
    "--media-range-bar-color": "var(--color-primary)",
    "--media-range-track-background": "var(--color-secondary)",
    "--media-secondary-color": "var(--color-secondary)",
    "--media-text-color": "var(--color-foreground)",
    ...style,
  } as CSSProperties} {...props}>{children}</div></AudioPlayerContext.Provider>
}

export type AudioPlayerElementData = { mediaType: string; base64: string }
export type AudioPlayerElementProps = Omit<ComponentProps<"audio">, "src"> & ({ src: string } | { data: AudioPlayerElementData }) & { controls?: boolean; preload?: ComponentProps<"audio">["preload"] }
export const AudioPlayerElement = (props: AudioPlayerElementProps) => {
  const { audioRef, sync } = useAudioPlayer()
  const { data, src: srcProp, controls = false, preload = "metadata", onDurationChange, onLoadedMetadata, onPause, onPlay, onTimeUpdate, onVolumeChange, ...audioProps } = props as AudioPlayerElementProps & { src?: string; data?: AudioPlayerElementData }
  const src = srcProp ?? (data ? `data:${data.mediaType};base64,${data.base64}` : undefined)
  return <audio {...audioProps} controls={controls} data-slot="audio-player-element" onDurationChange={event => { sync(); onDurationChange?.(event) }} onLoadedMetadata={event => { sync(); onLoadedMetadata?.(event) }} onPause={event => { sync(); onPause?.(event) }} onPlay={event => { sync(); onPlay?.(event) }} onTimeUpdate={event => { sync(); onTimeUpdate?.(event) }} onVolumeChange={event => { sync(); onVolumeChange?.(event) }} preload={preload} ref={audioRef} src={src} />
}

export type AudioPlayerControlBarProps = ComponentProps<"div">
export const AudioPlayerControlBar = ({ children, className, ...props }: AudioPlayerControlBarProps) => (
  <div className={cn("flex h-8 w-full items-center overflow-hidden rounded-lg border bg-muted", className)} data-slot="audio-player-control-bar" {...props}><ButtonGroup className="h-full w-full gap-0 bg-transparent" orientation="horizontal">{children}</ButtonGroup></div>
)

type CallbackButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & { onPress?: () => void }
export type AudioPlayerPlayButtonProps = CallbackButtonProps
export const AudioPlayerPlayButton = ({ className, onPress, children, ...props }: AudioPlayerPlayButtonProps) => {
  const { audioRef, playing } = useAudioPlayer()
  return <Button aria-label={playing ? "Pause" : "Play"} className={cn("rounded-none border-0 bg-transparent", className)} data-slot="audio-player-play-button" onClick={() => { const audio = audioRef.current; if (audio) { if (audio.paused) void audio.play(); else audio.pause() }; onPress?.() }} size="icon-sm" type="button" variant="outline" {...props}>{children ?? (playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />)}</Button>
}
export type AudioPlayerSeekButtonProps = CallbackButtonProps & { seekOffset?: number }
export type AudioPlayerSeekBackwardButtonProps = AudioPlayerSeekButtonProps
export const AudioPlayerSeekBackwardButton = ({ className, onPress, seekOffset = 10, children, ...props }: AudioPlayerSeekBackwardButtonProps) => {
  const { audioRef, sync } = useAudioPlayer()
  return <Button aria-label={`Seek backward ${seekOffset} seconds`} className={cn("rounded-none border-0 bg-transparent", className)} data-slot="audio-player-seek-backward-button" onClick={() => { const audio = audioRef.current; if (audio) { audio.currentTime = Math.max(0, audio.currentTime - seekOffset); sync() }; onPress?.() }} size="icon-sm" type="button" variant="outline" {...props}>{children ?? <RotateCcwIcon aria-hidden="true" />}</Button>
}
export type AudioPlayerSeekForwardButtonProps = AudioPlayerSeekButtonProps
export const AudioPlayerSeekForwardButton = ({ className, onPress, seekOffset = 10, children, ...props }: AudioPlayerSeekForwardButtonProps) => {
  const { audioRef, sync } = useAudioPlayer()
  return <Button aria-label={`Seek forward ${seekOffset} seconds`} className={cn("rounded-none border-0 bg-transparent", className)} data-slot="audio-player-seek-forward-button" onClick={() => { const audio = audioRef.current; if (audio) { audio.currentTime = Math.min(Number.isFinite(audio.duration) ? audio.duration : audio.currentTime + seekOffset, audio.currentTime + seekOffset); sync() }; onPress?.() }} size="icon-sm" type="button" variant="outline" {...props}>{children ?? <RotateCwIcon aria-hidden="true" />}</Button>
}
export type AudioPlayerMuteButtonProps = CallbackButtonProps
export const AudioPlayerMuteButton = ({ className, onPress, children, ...props }: AudioPlayerMuteButtonProps) => {
  const { audioRef, muted, sync } = useAudioPlayer()
  return <Button aria-label={muted ? "Unmute" : "Mute"} className={cn("rounded-none border-0 bg-transparent", className)} data-slot="audio-player-mute-button" onClick={() => { const audio = audioRef.current; if (audio) { audio.muted = !audio.muted; sync() }; onPress?.() }} size="icon-sm" type="button" variant="outline" {...props}>{children ?? (muted ? <VolumeXIcon aria-hidden="true" /> : <Volume2Icon aria-hidden="true" />)}</Button>
}

export type AudioPlayerTimeDisplayProps = ComponentProps<typeof ButtonGroupText>
export const AudioPlayerTimeDisplay = ({ className, children, ...props }: AudioPlayerTimeDisplayProps) => { const { currentTime } = useAudioPlayer(); return <ButtonGroupText className={cn("border-0 bg-transparent px-1 tabular-nums", className)} data-slot="audio-player-time-display" {...props}>{children ?? formatTime(currentTime)}</ButtonGroupText> }
export type AudioPlayerTimeRangeProps = Omit<ComponentProps<"input">, "type">
export const AudioPlayerTimeRange = ({ className, onChange, ...props }: AudioPlayerTimeRangeProps) => { const { audioRef, currentTime, duration, sync } = useAudioPlayer(); const change = (event: ChangeEvent<HTMLInputElement>) => { const audio = audioRef.current; if (audio) { audio.currentTime = Number(event.target.value); sync() }; onChange?.(event) }; return <ButtonGroupText className="relative min-w-24 flex-1 self-stretch rounded-none border-0 bg-transparent px-1" render={<span><RangeVisual max={duration > 0 ? duration : 1} value={currentTime} /><input aria-label="Audio position" className={cn(rangeInputClassName, className)} data-slot="audio-player-time-range" max={duration > 0 ? duration : 1} min={0} onChange={change} step={0.01} type="range" value={currentTime} {...props} /></span>} /> }
export type AudioPlayerDurationDisplayProps = ComponentProps<typeof ButtonGroupText>
export const AudioPlayerDurationDisplay = ({ className, children, ...props }: AudioPlayerDurationDisplayProps) => { const { duration } = useAudioPlayer(); return <ButtonGroupText className={cn("border-0 bg-transparent px-1 tabular-nums", className)} data-slot="audio-player-duration-display" {...props}>{children ?? formatTime(duration)}</ButtonGroupText> }
export type AudioPlayerVolumeRangeProps = Omit<ComponentProps<"input">, "type">
export const AudioPlayerVolumeRange = ({ className, onChange, ...props }: AudioPlayerVolumeRangeProps) => { const { audioRef, volume, sync } = useAudioPlayer(); const change = (event: ChangeEvent<HTMLInputElement>) => { const audio = audioRef.current; if (audio) { audio.volume = Number(event.target.value); sync() }; onChange?.(event) }; return <ButtonGroupText className="relative w-24 self-stretch rounded-none border-0 bg-transparent px-1" render={<span><RangeVisual max={1} value={volume} /><input aria-label="Audio volume" className={cn(rangeInputClassName, className)} data-slot="audio-player-volume-range" max={1} min={0} onChange={change} step={0.05} type="range" value={volume} {...props} /></span>} /> }
