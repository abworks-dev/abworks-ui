"use client"

import * as React from "react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tooltip, TooltipContent, TooltipTrigger, HoverCard, HoverCardContent, HoverCardTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@abworks-dev/ui"
import type { ChatStatus, FileUIPart, SourceDocumentUIPart } from "ai"
import { CornerDownLeftIcon, ImageIcon, LoaderCircleIcon, MonitorIcon, PlusIcon, SquareIcon, XIcon } from "lucide-react"
import { cn } from "./utils"

const readFileAsDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error ?? new Error("Unable to read attachment")); reader.readAsDataURL(file) })


const captureScreenshot = async (): Promise<File | null> => {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) return null
  const stream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true })
  const video = document.createElement("video")
  video.srcObject = stream; video.muted = true; video.playsInline = true
  try {
    await new Promise<void>((resolve, reject) => { video.onloadedmetadata = () => resolve(); video.onerror = () => reject(new Error("Failed to load screen stream")) })
    await video.play()
    if (!video.videoWidth || !video.videoHeight) return null
    const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight
    const context = canvas.getContext("2d"); if (!context) return null
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"))
    return blob ? new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" }) : null
  } finally { stream.getTracks().forEach(track => track.stop()); video.pause(); video.srcObject = null }
}

export interface AttachmentsContext {
  files: Array<FileUIPart & { id: string }>
  add: (files: File[] | FileList) => void
  remove: (id: string) => void
  clear: () => void
  openFileDialog: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  toSubmissionFiles?: () => Promise<FileUIPart[]>
}
export interface TextInputContext { value: string; setInput: (value: string) => void; clear: () => void }
export interface PromptInputControllerProps {
  textInput: TextInputContext
  attachments: AttachmentsContext
  __registerFileInput: (ref: React.RefObject<HTMLInputElement | null>, open: () => void) => void
}
const ControllerContext = React.createContext<PromptInputControllerProps | null>(null)
const ProviderAttachmentsContext = React.createContext<AttachmentsContext | null>(null)
const LocalAttachmentsContext = React.createContext<AttachmentsContext | null>(null)

export function usePromptInputController() {
  const value = React.useContext(ControllerContext)
  if (!value) throw new Error("Wrap your component inside <PromptInputProvider> to use usePromptInputController().")
  return value
}
const useOptionalController = () => React.useContext(ControllerContext)
export function useProviderAttachments() {
  const value = React.useContext(ProviderAttachmentsContext)
  if (!value) throw new Error("Wrap your component inside <PromptInputProvider> to use useProviderAttachments().")
  return value
}
const useOptionalProviderAttachments = () => React.useContext(ProviderAttachmentsContext)
export function usePromptInputAttachments() {
  const value = React.useContext(LocalAttachmentsContext) ?? useOptionalProviderAttachments()
  if (!value) throw new Error("usePromptInputAttachments must be used within a PromptInput or PromptInputProvider")
  return value
}

export interface ReferencedSourcesContext {
  sources: Array<SourceDocumentUIPart & { id: string }>
  add: (sources: SourceDocumentUIPart | SourceDocumentUIPart[]) => void
  remove: (id: string) => void
  clear: () => void
}
export const LocalReferencedSourcesContext = React.createContext<ReferencedSourcesContext | null>(null)
export function usePromptInputReferencedSources() {
  const value = React.useContext(LocalReferencedSourcesContext)
  if (!value) throw new Error("usePromptInputReferencedSources must be used within a PromptInput")
  return value
}

const id = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
const filePart = (file: File): FileUIPart & { id: string } => ({ id: id(), type: "file", filename: file.name, mediaType: file.type || "application/octet-stream", url: URL.createObjectURL(file) })

export type PromptInputProviderProps = React.PropsWithChildren<{ initialInput?: string }>
export function PromptInputProvider({ initialInput = "", children }: PromptInputProviderProps) {
  const [value, setValue] = React.useState(initialInput)
  const [files, setFiles] = React.useState<Array<FileUIPart & { id: string }>>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const openRef = React.useRef<() => void>(() => undefined)
  const fileRecords = React.useRef(new Map<string, File>())
  const clearFiles = React.useCallback(() => { setFiles(current => { current.forEach(file => { fileRecords.current.delete(file.id); file.url?.startsWith("blob:") && URL.revokeObjectURL(file.url) }); return [] }) }, [])
  const addFiles = React.useCallback((incoming: File[] | FileList) => { const parts = Array.from(incoming).map(file => { const part = filePart(file); fileRecords.current.set(part.id, file); return part }); setFiles(current => [...current, ...parts]) }, [])
  const toSubmissionFiles = React.useCallback(async () => Promise.all(files.map(async ({ id: fileId, ...part }) => ({ ...part, url: fileRecords.current.has(fileId) ? await readFileAsDataUrl(fileRecords.current.get(fileId)!) : part.url }))), [files])
  const attachments = React.useMemo<AttachmentsContext>(() => ({ files, fileInputRef: inputRef, add: addFiles, toSubmissionFiles, remove: fileId => setFiles(current => { const found = current.find(file => file.id === fileId); fileRecords.current.delete(fileId); if (found?.url?.startsWith("blob:")) URL.revokeObjectURL(found.url); return current.filter(file => file.id !== fileId) }), clear: clearFiles, openFileDialog: () => openRef.current(), }), [files, addFiles, toSubmissionFiles, clearFiles])
  const controller = React.useMemo(() => ({ textInput: { value, setInput: setValue, clear: () => setValue("") }, attachments, __registerFileInput: (ref: React.RefObject<HTMLInputElement | null>, open: () => void) => { inputRef.current = ref.current; openRef.current = open } }), [value, attachments])
  const filesRef = React.useRef(files)
  React.useEffect(() => { filesRef.current = files }, [files])
  React.useEffect(() => () => { filesRef.current.forEach(file => file.url?.startsWith("blob:") && URL.revokeObjectURL(file.url)) }, [])
  return <ControllerContext.Provider value={controller}><ProviderAttachmentsContext.Provider value={attachments}>{children}</ProviderAttachmentsContext.Provider></ControllerContext.Provider>
}

export interface PromptInputMessage { text: string; files: FileUIPart[]; sources?: SourceDocumentUIPart[] }
export type PromptInputError = { code: "max_files" | "max_file_size" | "accept"; message: string }
export type PromptInputProps = Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onError"> & {
  accept?: string; multiple?: boolean; globalDrop?: boolean; syncHiddenInput?: boolean; maxFiles?: number; maxFileSize?: number
  onError?: (error: PromptInputError) => void
  onSubmit: (message: PromptInputMessage, event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
}
export function PromptInput({ className, accept, multiple, globalDrop = false, syncHiddenInput = false, maxFiles, maxFileSize, onError, onSubmit, children, ...props }: PromptInputProps) {
  const controller = useOptionalController()
  const [localFiles, setLocalFiles] = React.useState<Array<FileUIPart & { id: string }>>([])
  const [sources, setSources] = React.useState<Array<SourceDocumentUIPart & { id: string }>>([])
  const localFileRecords = React.useRef(new Map<string, File>())
  const inputRef = React.useRef<HTMLInputElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const files = controller?.attachments.files ?? localFiles
  const localFilesRef = React.useRef(localFiles)
  React.useEffect(() => { localFilesRef.current = localFiles }, [localFiles])
  React.useEffect(() => () => { localFilesRef.current.forEach(file => file.url?.startsWith("blob:") && URL.revokeObjectURL(file.url)); localFileRecords.current.clear() }, [])
  const matchesAccept = React.useCallback((file: File) => { if (!accept?.trim()) return true; return accept.split(",").map(item => item.trim()).filter(Boolean).some(pattern => pattern.endsWith("/*") ? file.type.startsWith(pattern.slice(0, -1)) : file.type === pattern) }, [accept])
  const addFiles = React.useCallback((incoming: File[] | FileList) => {
    const selected = Array.from(incoming)
    const accepted = selected.filter(matchesAccept)
    if (selected.length && !accepted.length) { onError?.({ code: "accept", message: "No files match the accepted types." }); return }
    const sized = maxFileSize ? accepted.filter(file => file.size <= maxFileSize) : accepted
    if (accepted.length && !sized.length) { onError?.({ code: "max_file_size", message: "All files exceed the maximum size." }); return }
    const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - files.length) : sized.length
    if (sized.length > capacity) onError?.({ code: "max_files", message: "Too many files. Some were not added." })
    const next = sized.slice(0, capacity)
    if (controller) controller.attachments.add(next)
    else setLocalFiles(current => [...current, ...next.map(file => { const part = filePart(file); localFileRecords.current.set(part.id, file); return part })])
  }, [accept, controller, files.length, matchesAccept, maxFileSize, maxFiles, onError])
  const clearFiles = React.useCallback(() => { if (controller) controller.attachments.clear(); else setLocalFiles(current => { current.forEach(file => { localFileRecords.current.delete(file.id); file.url?.startsWith("blob:") && URL.revokeObjectURL(file.url) }); return [] }) }, [controller])
  const removeFile = React.useCallback((fileId: string) => { if (controller) controller.attachments.remove(fileId); else setLocalFiles(current => { const found = current.find(file => file.id === fileId); localFileRecords.current.delete(fileId); if (found?.url?.startsWith("blob:")) URL.revokeObjectURL(found.url); return current.filter(file => file.id !== fileId) }) }, [controller])
  const openFileDialog = React.useCallback(() => inputRef.current?.click(), [])
  React.useEffect(() => { if (controller) controller.__registerFileInput(inputRef, openFileDialog) }, [controller, openFileDialog])
  React.useEffect(() => { const form = formRef.current; if (!form || globalDrop) return; const drop = (event: DragEvent) => { if (event.dataTransfer?.files.length) { event.preventDefault(); addFiles(event.dataTransfer.files) } }; const over = (event: DragEvent) => { if (event.dataTransfer?.types.includes("Files")) event.preventDefault() }; form.addEventListener("drop", drop); form.addEventListener("dragover", over); return () => { form.removeEventListener("drop", drop); form.removeEventListener("dragover", over) } }, [addFiles, globalDrop])
  React.useEffect(() => { if (!globalDrop) return; const drop = (event: DragEvent) => { if (event.dataTransfer?.files.length) { event.preventDefault(); addFiles(event.dataTransfer.files) } }; const over = (event: DragEvent) => { if (event.dataTransfer?.types.includes("Files")) event.preventDefault() }; document.addEventListener("drop", drop); document.addEventListener("dragover", over); return () => { document.removeEventListener("drop", drop); document.removeEventListener("dragover", over) } }, [addFiles, globalDrop])
  const toSubmissionFiles = React.useCallback(async () => Promise.all(files.map(async ({ id: fileId, ...part }) => ({ ...part, url: localFileRecords.current.has(fileId) ? await readFileAsDataUrl(localFileRecords.current.get(fileId)!) : part.url }))), [files])
  const localAttachments = React.useMemo<AttachmentsContext>(() => ({ files, add: addFiles, remove: removeFile, clear: clearFiles, openFileDialog, fileInputRef: inputRef, toSubmissionFiles }), [files, addFiles, removeFile, clearFiles, openFileDialog, toSubmissionFiles])
  const refs = React.useMemo<ReferencedSourcesContext>(() => ({ sources, add: incoming => setSources(current => [...current, ...(Array.isArray(incoming) ? incoming : [incoming]).map(source => ({ ...source, id: id() }))]), remove: sourceId => setSources(current => current.filter(source => source.id !== sourceId)), clear: () => setSources([]) }), [sources])
  const clear = React.useCallback(() => { clearFiles(); setSources([]); controller?.textInput.clear() }, [clearFiles, controller])
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = controller?.textInput.value ?? String(new FormData(event.currentTarget).get("message") ?? "")
    const submittedFiles = await (controller?.attachments.toSubmissionFiles?.() ?? localAttachments.toSubmissionFiles?.() ?? Promise.resolve(files.map(({ id: _id, ...file }) => file)))
    const message = { text, files: submittedFiles, sources: sources.map(({ id: _id, ...source }) => source) }
    try { await onSubmit(message, event); clear(); if (!controller) formRef.current?.reset() } catch { /* retain input and attachments for retry */ }
  }
  return <LocalAttachmentsContext.Provider value={localAttachments}><LocalReferencedSourcesContext.Provider value={refs}><input ref={inputRef} type="file" className="hidden" accept={accept} multiple={multiple} aria-label="Upload files" onChange={event => { if (event.currentTarget.files) addFiles(event.currentTarget.files); event.currentTarget.value = "" }} />{syncHiddenInput && <input type="hidden" name="attachments" value={JSON.stringify(files)} readOnly />}<form {...props} ref={formRef} className={cn("w-full", className)} onSubmit={submit}><InputGroup className="overflow-hidden">{children}</InputGroup></form></LocalReferencedSourcesContext.Provider></LocalAttachmentsContext.Provider>
}

export type PromptInputBodyProps = React.HTMLAttributes<HTMLDivElement>
export const PromptInputBody = ({ className, ...props }: PromptInputBodyProps) => <div className={cn("contents", className)} {...props} />
export type PromptInputTextareaProps = React.ComponentProps<typeof InputGroupTextarea>
export const PromptInputTextarea = React.forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(function PromptInputTextarea({ className, placeholder = "What would you like to know?", onKeyDown, onPaste, onChange, ...props }, ref) {
  const controller = useOptionalController()
  const attachments = usePromptInputAttachments()
  const [composing, setComposing] = React.useState(false)
  return <InputGroupTextarea {...props} ref={ref} name="message" className={cn("field-sizing-content max-h-48 min-h-16", className)} placeholder={placeholder} onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)} onChange={event => { controller?.textInput.setInput(event.currentTarget.value); onChange?.(event) }} onKeyDown={event => { onKeyDown?.(event); if (event.defaultPrevented) return; if (event.key === "Enter" && !event.shiftKey && !composing && !event.nativeEvent.isComposing) { event.preventDefault(); const submit = event.currentTarget.form?.querySelector<HTMLButtonElement>('button[type="submit"]'); if (!submit?.disabled) event.currentTarget.form?.requestSubmit() } if (event.key === "Backspace" && !event.currentTarget.value && attachments.files.length) { event.preventDefault(); attachments.remove(attachments.files.at(-1)!.id) } }} onPaste={event => { onPaste?.(event); if (event.defaultPrevented) return; const files = Array.from(event.clipboardData?.items ?? []).flatMap(item => item.kind === "file" && item.getAsFile() ? [item.getAsFile()!] : []); if (files.length) { event.preventDefault(); attachments.add(files) } }} {...(controller ? { value: controller.textInput.value } : {})} />
})
export const PromptInputHeader = ({ className, ...props }: Omit<React.ComponentProps<typeof InputGroupAddon>, "align">) => <InputGroupAddon align="block-start" className={cn("order-first flex-wrap gap-1", className)} {...props} />
export const PromptInputFooter = ({ className, ...props }: Omit<React.ComponentProps<typeof InputGroupAddon>, "align">) => <InputGroupAddon align="block-end" className={cn("justify-between gap-1", className)} {...props} />
export const PromptInputTools = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex min-w-0 items-center gap-1", className)} {...props} />
export type PromptInputButtonTooltip = string | { content: React.ReactNode; shortcut?: string; side?: React.ComponentProps<typeof TooltipContent>["side"] }
export type PromptInputButtonProps = React.ComponentProps<typeof InputGroupButton> & { tooltip?: PromptInputButtonTooltip }
export function PromptInputButton({ tooltip, size, variant = "ghost", children, ...props }: PromptInputButtonProps) { const button = <InputGroupButton {...props} type="button" variant={variant} size={size ?? (React.Children.count(children) > 1 ? "sm" : "icon-sm")}>{children}</InputGroupButton>; if (!tooltip) return button; const content = typeof tooltip === "string" ? tooltip : tooltip.content; return <Tooltip><TooltipTrigger render={button} /><TooltipContent side={typeof tooltip === "string" ? "top" : tooltip.side ?? "top"}>{content}{typeof tooltip !== "string" && tooltip.shortcut ? <span className="ml-2 text-muted-foreground">{tooltip.shortcut}</span> : null}</TooltipContent></Tooltip> }

export const PromptInputSubmit = ({ status = "ready", onStop, children, onClick, ...props }: React.ComponentProps<typeof InputGroupButton> & { status?: ChatStatus; onStop?: () => void }) => { const active = status === "submitted" || status === "streaming"; const icon = status === "submitted" ? <LoaderCircleIcon className="size-4 animate-spin" /> : status === "streaming" ? <SquareIcon className="size-4" /> : status === "error" ? <XIcon className="size-4" /> : <CornerDownLeftIcon className="size-4" />; return <InputGroupButton {...props} type={active && onStop ? "button" : "submit"} aria-label={active ? "Stop" : "Submit"} onClick={event => { if (active && onStop) { event.preventDefault(); onStop(); return } onClick?.(event) }} size={props.size ?? "icon-sm"}>{children ?? icon}</InputGroupButton> }

export const PromptInputActionAddAttachments = ({ label = "Add photos or files", ...props }: React.ComponentProps<"button"> & { label?: string }) => { const attachments = usePromptInputAttachments(); return <button {...props} type="button" onClick={event => { props.onClick?.(event); if (!event.defaultPrevented) attachments.openFileDialog() }}><ImageIcon className="mr-2 size-4" />{label}</button> }
export const PromptInputActionAddScreenshot = ({ label = "Take screenshot", onClick, ...props }: React.ComponentProps<"button"> & { label?: string }) => { const attachments = usePromptInputAttachments(); return <button {...props} type="button" onClick={async event => { onClick?.(event); if (event.defaultPrevented) return; try { const screenshot = await captureScreenshot(); if (screenshot) attachments.add([screenshot]) } catch (error) { if (!(error instanceof DOMException && ["AbortError", "NotAllowedError"].includes(error.name))) throw error } }}><MonitorIcon className="mr-2 size-4" />{label}</button> }
export type PromptInputActionMenuProps = React.ComponentProps<typeof DropdownMenu>
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => <DropdownMenu {...props} />
export type PromptInputActionMenuTriggerProps = PromptInputButtonProps
export const PromptInputActionMenuTrigger = ({ children, ...props }: PromptInputActionMenuTriggerProps) => <DropdownMenuTrigger render={<PromptInputButton {...props}>{children ?? <PlusIcon className="size-4" />}</PromptInputButton>} />
export type PromptInputActionMenuContentProps = React.ComponentProps<typeof DropdownMenuContent>
export const PromptInputActionMenuContent = ({ className, ...props }: PromptInputActionMenuContentProps) => <DropdownMenuContent align="start" className={cn(className)} {...props} />
export type PromptInputActionMenuItemProps = React.ComponentProps<typeof DropdownMenuItem>
export const PromptInputActionMenuItem = ({ className, ...props }: PromptInputActionMenuItemProps) => <DropdownMenuItem className={cn(className)} {...props} />

export const PromptInputSelect = Select
export const PromptInputSelectTrigger = ({ className, ...props }: React.ComponentProps<typeof SelectTrigger>) => <SelectTrigger className={cn("border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground", className)} {...props} />
export const PromptInputSelectContent = SelectContent
export const PromptInputSelectItem = SelectItem
export const PromptInputSelectValue = SelectValue
export const PromptInputHoverCard = HoverCard
export const PromptInputHoverCardTrigger = HoverCardTrigger
export const PromptInputHoverCardContent = HoverCardContent
export const PromptInputTabsList = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={className} {...props} />
export const PromptInputTab = PromptInputTabsList
export const PromptInputTabLabel = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={cn("mb-2 px-3 font-medium text-muted-foreground text-xs", className)} {...props} />
export const PromptInputTabBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("space-y-1", className)} {...props} />
export const PromptInputTabItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent", className)} {...props} />
export const PromptInputCommand = ({ className, ...props }: React.ComponentProps<typeof Command>) => <Command className={cn(className)} {...props} />
export const PromptInputCommandInput = ({ className, ...props }: React.ComponentProps<typeof CommandInput>) => <CommandInput className={cn(className)} {...props} />
export const PromptInputCommandList = ({ className, ...props }: React.ComponentProps<typeof CommandList>) => <CommandList className={cn(className)} {...props} />
export const PromptInputCommandEmpty = ({ className, ...props }: React.ComponentProps<typeof CommandEmpty>) => <CommandEmpty className={cn(className)} {...props} />
export const PromptInputCommandGroup = ({ className, ...props }: React.ComponentProps<typeof CommandGroup>) => <CommandGroup className={cn(className)} {...props} />
export const PromptInputCommandItem = ({ className, ...props }: React.ComponentProps<typeof CommandItem>) => <CommandItem className={cn(className)} {...props} />
export const PromptInputCommandSeparator = ({ className, ...props }: React.ComponentProps<typeof CommandSeparator>) => <CommandSeparator className={cn(className)} {...props} />
