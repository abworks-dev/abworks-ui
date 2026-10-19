"use client";

import { Avatar, AvatarFallback, Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@aboard/ui";
import { CheckIcon, CopyIcon, FileIcon, GitCommitIcon, MinusIcon, PlusIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { cn } from "./utils";

export type CommitProps = ComponentProps<typeof Collapsible>;
export const Commit = ({ className, children, ...props }: CommitProps) => <Collapsible className={cn("rounded-lg border bg-background", className)} {...props}>{children}</Collapsible>;
export type CommitHeaderProps = ComponentProps<typeof CollapsibleTrigger>;
export const CommitHeader = ({ className, children, ...props }: CommitHeaderProps) => <CollapsibleTrigger className={cn("group flex w-full items-center justify-between gap-4 p-3 text-left transition-colors hover:opacity-80", className)} {...props}>{children}</CollapsibleTrigger>;
export type CommitHashProps = HTMLAttributes<HTMLSpanElement>;
export const CommitHash = ({ className, children, ...props }: CommitHashProps) => <span className={cn("font-mono text-xs", className)} {...props}><GitCommitIcon className="mr-1 inline-block size-3" />{children}</span>;
export type CommitMessageProps = HTMLAttributes<HTMLSpanElement>;
export const CommitMessage = ({ className, children, ...props }: CommitMessageProps) => <span className={cn("font-medium text-sm", className)} {...props}>{children}</span>;
export type CommitMetadataProps = HTMLAttributes<HTMLDivElement>;
export const CommitMetadata = ({ className, children, ...props }: CommitMetadataProps) => <div className={cn("flex items-center gap-2 text-muted-foreground text-xs", className)} {...props}>{children}</div>;
export type CommitSeparatorProps = HTMLAttributes<HTMLSpanElement>;
export const CommitSeparator = ({ className, children, ...props }: CommitSeparatorProps) => <span className={className} {...props}>{children ?? "•"}</span>;
export type CommitInfoProps = HTMLAttributes<HTMLDivElement>;
export const CommitInfo = ({ className, children, ...props }: CommitInfoProps) => <div className={cn("flex flex-1 flex-col", className)} {...props}>{children}</div>;
export type CommitAuthorProps = HTMLAttributes<HTMLDivElement>;
export const CommitAuthor = ({ className, children, ...props }: CommitAuthorProps) => <div className={cn("flex items-center", className)} {...props}>{children}</div>;
export type CommitAuthorAvatarProps = ComponentProps<typeof Avatar> & { initials: string };
export const CommitAuthorAvatar = ({ initials, className, ...props }: CommitAuthorAvatarProps) => <Avatar className={cn("size-8", className)} {...props}><AvatarFallback className="text-xs">{initials}</AvatarFallback></Avatar>;
export type CommitTimestampProps = HTMLAttributes<HTMLTimeElement> & { date: Date };
export const CommitTimestamp = ({ date, className, children, ...props }: CommitTimestampProps) => {
  const [formatted, setFormatted] = useState("");
  const validDate = date instanceof Date && Number.isFinite(date.getTime()) ? date : null;
  useEffect(() => {
    if (!validDate) { setFormatted(""); return; }
    const days = Math.round((validDate.getTime() - Date.now()) / 86400000);
    setFormatted(new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(days, "day"));
  }, [validDate]);
  if (!validDate) return <time className={cn("text-xs", className)} {...props}>{children}</time>;
  return <time className={cn("text-xs", className)} dateTime={validDate.toISOString()} {...props}>{children ?? formatted}</time>;
};
export type CommitActionsProps = HTMLAttributes<HTMLDivElement>;
export const CommitActions = ({ className, children, ...props }: CommitActionsProps) => <div className={cn("flex items-center gap-1", className)} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} role="group" {...props}>{children}</div>;
export type CommitCopyButtonProps = ComponentProps<typeof Button> & { hash: string; onCopy?: (hash: string) => void; onCopyError?: (error: unknown) => void; copiedResetMs?: number };
export const CommitCopyButton = ({ hash, onCopy, onCopyError, copiedResetMs = 2000, children, className, onClick, ...props }: CommitCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const resetMs = Number.isFinite(copiedResetMs) && copiedResetMs > 0 ? copiedResetMs : 2000;
  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(() => setIsCopied(false), resetMs);
    return () => window.clearTimeout(timer);
  }, [isCopied, resetMs]);
  return <Button {...props} aria-label={props["aria-label"] ?? "Copy commit hash"} className={cn("size-7 shrink-0", className)} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || !onCopy) return;
    try { onCopy(hash); setIsCopied(true); } catch (error) { setIsCopied(false); onCopyError?.(error); }
  }} size="icon" variant="ghost">{children ?? (isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />)}</Button>;
};
export type CommitContentProps = ComponentProps<typeof CollapsibleContent>;
export const CommitContent = ({ className, children, ...props }: CommitContentProps) => <CollapsibleContent className={cn("border-t p-3", className)} {...props}>{children}</CollapsibleContent>;
export type CommitFilesProps = HTMLAttributes<HTMLDivElement>;
export const CommitFiles = ({ className, children, ...props }: CommitFilesProps) => <div className={cn("space-y-1", className)} {...props}>{children}</div>;
export type CommitFileProps = HTMLAttributes<HTMLDivElement>;
export const CommitFile = ({ className, children, ...props }: CommitFileProps) => <div className={cn("flex items-center justify-between gap-2 rounded px-2 py-1 text-sm hover:bg-muted/50", className)} {...props}>{children}</div>;
export type CommitFileInfoProps = HTMLAttributes<HTMLDivElement>;
export const CommitFileInfo = ({ className, children, ...props }: CommitFileInfoProps) => <div className={cn("flex min-w-0 items-center gap-2", className)} {...props}>{children}</div>;
const fileStatusStyles = { added: "text-green-600 dark:text-green-400", deleted: "text-red-600 dark:text-red-400", modified: "text-yellow-600 dark:text-yellow-400", renamed: "text-blue-600 dark:text-blue-400" };
const fileStatusLabels = { added: "A", deleted: "D", modified: "M", renamed: "R" };
export type CommitFileStatusProps = HTMLAttributes<HTMLSpanElement> & { status: keyof typeof fileStatusStyles };
export const CommitFileStatus = ({ status, className, children, ...props }: CommitFileStatusProps) => {
  const validStatus = typeof status === "string" && Object.hasOwn(fileStatusStyles, status) ? status as keyof typeof fileStatusStyles : "modified";
  return <span className={cn("font-medium font-mono text-xs", fileStatusStyles[validStatus], className)} {...props}>{children ?? fileStatusLabels[validStatus]}</span>;
};
export type CommitFileIconProps = ComponentProps<typeof FileIcon>;
export const CommitFileIcon = ({ className, ...props }: CommitFileIconProps) => <FileIcon className={cn("size-3.5 shrink-0 text-muted-foreground", className)} {...props} />;
export type CommitFilePathProps = HTMLAttributes<HTMLSpanElement>;
export const CommitFilePath = ({ className, children, ...props }: CommitFilePathProps) => <span className={cn("truncate font-mono text-xs", className)} {...props}>{children}</span>;
export type CommitFileChangesProps = HTMLAttributes<HTMLDivElement>;
export const CommitFileChanges = ({ className, children, ...props }: CommitFileChangesProps) => <div className={cn("flex shrink-0 items-center gap-1 font-mono text-xs", className)} {...props}>{children}</div>;
export type CommitFileAdditionsProps = HTMLAttributes<HTMLSpanElement> & { count: number };
export const CommitFileAdditions = ({ count, className, children, ...props }: CommitFileAdditionsProps) => Number.isFinite(count) && count > 0 ? <span className={cn("text-green-600 dark:text-green-400", className)} {...props}>{children ?? <><PlusIcon className="inline-block size-3" />{count}</>}</span> : null;
export type CommitFileDeletionsProps = HTMLAttributes<HTMLSpanElement> & { count: number };
export const CommitFileDeletions = ({ count, className, children, ...props }: CommitFileDeletionsProps) => Number.isFinite(count) && count > 0 ? <span className={cn("text-red-600 dark:text-red-400", className)} {...props}>{children ?? <><MinusIcon className="inline-block size-3" />{count}</>}</span> : null;
