// AI Elements - Apache-2.0
// Copyright (c) 2025 Vercel
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/voice-selector.tsx
// ABWorks adaptations: Base Nova/Base UI Dialog and Command; preview is callback-only.
"use client"

import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext, useMemo, useState } from "react"
import { CircleSmallIcon, MarsIcon, MarsStrokeIcon, NonBinaryIcon, PauseIcon, PlayIcon, TransgenderIcon, VenusAndMarsIcon, VenusIcon } from "lucide-react"
import { Button, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, Dialog, DialogContent, DialogTitle, DialogTrigger, Spinner } from "@abworks-dev/ui"
import { cn } from "./utils"

interface VoiceSelectorContextValue { value?: string; setValue: (value?: string) => void; open: boolean; setOpen: (open: boolean) => void }
const VoiceSelectorContext = createContext<VoiceSelectorContextValue | null>(null)
export const useVoiceSelector = () => { const value = useContext(VoiceSelectorContext); if (!value) throw new Error("VoiceSelector components must be used within VoiceSelector"); return value }
export type VoiceSelectorProps = ComponentProps<typeof Dialog> & { value?: string; defaultValue?: string; onValueChange?: (value: string | undefined) => void }
type VoiceSelectorChangeDetails = Parameters<NonNullable<ComponentProps<typeof Dialog>["onOpenChange"]>>[1]
export const VoiceSelector = ({ value: valueProp, defaultValue, onValueChange, open: openProp, defaultOpen = false, onOpenChange, children, ...props }: VoiceSelectorProps) => {
  const [valueState, setValueState] = useState(defaultValue); const [openState, setOpenState] = useState(defaultOpen)
  const value = valueProp ?? valueState; const open = openProp ?? openState
  const setValue = (next?: string) => { if (valueProp === undefined) setValueState(next); onValueChange?.(next) }; const setOpen = (next: boolean, event?: VoiceSelectorChangeDetails) => { if (openProp === undefined) setOpenState(next); onOpenChange?.(next, event as VoiceSelectorChangeDetails) }
  const context = useMemo(() => ({ value, setValue, open, setOpen }), [value, open])
  return <VoiceSelectorContext.Provider value={context}><Dialog open={open} onOpenChange={(next, event) => setOpen(next, event)} {...props}>{children}</Dialog></VoiceSelectorContext.Provider>
}
export type VoiceSelectorTriggerProps = ComponentProps<typeof DialogTrigger>
export const VoiceSelectorTrigger = (props: VoiceSelectorTriggerProps) => <DialogTrigger {...props} />
export type VoiceSelectorContentProps = ComponentProps<typeof DialogContent> & { title?: ReactNode }
export const VoiceSelectorContent = ({ className, title = "Voice Selector", children, ...props }: VoiceSelectorContentProps) => <DialogContent aria-describedby={undefined} showCloseButton={false} className={cn("p-0", className)} {...props}><DialogTitle className="sr-only">{title}</DialogTitle><Command className="**:data-[slot=command-input-wrapper]:h-auto">{children}</Command></DialogContent>
export type VoiceSelectorDialogProps = ComponentProps<typeof CommandDialog>
export const VoiceSelectorDialog = (props: VoiceSelectorDialogProps) => <CommandDialog {...props} />
export type VoiceSelectorInputProps = ComponentProps<typeof CommandInput>
export const VoiceSelectorInput = ({ className, ...props }: VoiceSelectorInputProps) => <CommandInput className={cn("h-auto py-3.5", className)} {...props} />
export type VoiceSelectorListProps = ComponentProps<typeof CommandList>
export const VoiceSelectorList = (props: VoiceSelectorListProps) => <CommandList {...props} />
export type VoiceSelectorEmptyProps = ComponentProps<typeof CommandEmpty>
export const VoiceSelectorEmpty = (props: VoiceSelectorEmptyProps) => <CommandEmpty {...props} />
export type VoiceSelectorGroupProps = ComponentProps<typeof CommandGroup>
export const VoiceSelectorGroup = (props: VoiceSelectorGroupProps) => <CommandGroup {...props} />
export type VoiceSelectorItemProps = ComponentProps<typeof CommandItem>
export const VoiceSelectorItem = ({ className, onSelect, value, ...props }: VoiceSelectorItemProps) => { const context = useVoiceSelector(); const handleSelect = (selected: string) => { context.setValue(selected); context.setOpen(false); onSelect?.(selected) }; return <CommandItem {...props} className={cn("px-4 py-2", className)} value={value} onSelect={handleSelect} /> }
export type VoiceSelectorShortcutProps = ComponentProps<typeof CommandShortcut>
export const VoiceSelectorShortcut = (props: VoiceSelectorShortcutProps) => <CommandShortcut {...props} />
export type VoiceSelectorSeparatorProps = ComponentProps<typeof CommandSeparator>
export const VoiceSelectorSeparator = (props: VoiceSelectorSeparatorProps) => <CommandSeparator {...props} />
export type VoiceSelectorNameProps = ComponentProps<"span">
export const VoiceSelectorName = ({ className, ...props }: VoiceSelectorNameProps) => <span className={cn("flex-1 truncate text-left font-medium", className)} {...props} />
export type VoiceSelectorDescriptionProps = ComponentProps<"span">
export const VoiceSelectorDescription = ({ className, ...props }: VoiceSelectorDescriptionProps) => <span className={cn("text-muted-foreground text-xs", className)} {...props} />
export type VoiceSelectorAgeProps = ComponentProps<"span">
export const VoiceSelectorAge = ({ className, ...props }: VoiceSelectorAgeProps) => <span className={cn("text-muted-foreground text-xs tabular-nums", className)} {...props} />
export type VoiceSelectorAttributesProps = ComponentProps<"div">
export const VoiceSelectorAttributes = ({ className, ...props }: VoiceSelectorAttributesProps) => <div className={cn("flex items-center text-xs", className)} {...props} />
export type VoiceSelectorBulletProps = ComponentProps<"span">
export const VoiceSelectorBullet = ({ className, ...props }: VoiceSelectorBulletProps) => <span aria-hidden="true" className={cn("select-none text-border", className)} {...props}>&bull;</span>
export type VoiceSelectorGenderProps = ComponentProps<"span"> & { value?: "male" | "female" | "transgender" | "androgyne" | "non-binary" | "intersex" | string }
export const VoiceSelectorGender = ({ className, value, children, ...props }: VoiceSelectorGenderProps) => { const icon = value === "male" ? <MarsIcon className="size-4" /> : value === "female" ? <VenusIcon className="size-4" /> : value === "transgender" ? <TransgenderIcon className="size-4" /> : value === "androgyne" ? <MarsStrokeIcon className="size-4" /> : value === "non-binary" ? <NonBinaryIcon className="size-4" /> : value === "intersex" ? <VenusAndMarsIcon className="size-4" /> : <CircleSmallIcon className="size-4" />; return <span className={cn("text-muted-foreground text-xs", className)} {...props}>{children ?? icon}</span> }
export type VoiceSelectorAccentProps = ComponentProps<"span"> & { value?: string }
export const VoiceSelectorAccent = ({ className, value, children, ...props }: VoiceSelectorAccentProps) => { const emoji = { american: "🇺🇸", british: "🇬🇧", australian: "🇦🇺", canadian: "🇨🇦", irish: "🇮🇪", indian: "🇮🇳", spanish: "🇪🇸", french: "🇫🇷", german: "🇩🇪", italian: "🇮🇹", portuguese: "🇵🇹", brazilian: "🇧🇷", mexican: "🇲🇽", argentinian: "🇦🇷", japanese: "🇯🇵", chinese: "🇨🇳", korean: "🇰🇷", russian: "🇷🇺", arabic: "🇸🇦", dutch: "🇳🇱", swedish: "🇸🇪", norwegian: "🇳🇴", danish: "🇩🇰", finnish: "🇫🇮", polish: "🇵🇱", turkish: "🇹🇷", greek: "🇬🇷" }[value ?? ""]; return <span className={cn("text-muted-foreground text-xs", className)} {...props}>{children ?? emoji}</span> }
export type VoiceSelectorPreviewProps = Omit<ComponentProps<typeof Button>, "children" | "onClick"> & { playing?: boolean; loading?: boolean; onPlay?: () => void; onClick?: ComponentProps<"button">["onClick"] }
export const VoiceSelectorPreview = ({ className, playing, loading, onPlay, onClick, disabled, ...props }: VoiceSelectorPreviewProps) => <Button aria-label={playing ? "Pause preview" : "Play preview"} className={cn("size-6", className)} disabled={loading || disabled} onClick={event => { event.stopPropagation(); onClick?.(event); onPlay?.() }} size="icon-sm" type="button" variant="outline" {...props}>{loading ? <Spinner className="size-3" /> : playing ? <PauseIcon aria-hidden="true" className="size-3" /> : <PlayIcon aria-hidden="true" className="size-3" />}</Button>
