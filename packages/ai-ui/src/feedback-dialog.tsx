// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Feedback dialog  https://www.assistant-ui.com/elements/feedback-dialog
// Caller-owned presentation only: open state, reason selection, and submit are props/callbacks.
"use client";

import { Button } from "@abworks-dev/ui/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@abworks-dev/ui/core/dialog";
import { ThumbsDownIcon } from "lucide-react";
import { cn } from "./utils";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

export type FeedbackDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (reason: string) => void;
  title?: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
  children?: ReactNode;
};

/**
 * FeedbackDialog asks why a response was disliked so the signal arrives with a
 * reason. It owns only its local draft text; open state and submit are caller-owned.
 */
export const FeedbackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  title = "Send feedback",
  description = "What went wrong with this response?",
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  placeholder = "Tell us more…",
  children,
}: FeedbackDialogProps) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit?.(reason);
    setReason("");
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ThumbsDownIcon aria-hidden="true" className="size-4" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children ?? (
          <FeedbackTextarea
            value={reason}
            onValueChange={setReason}
            placeholder={placeholder}
          />
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange?.(false)}
          >
            {cancelLabel}
          </Button>
          <Button type="button" size="sm" onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function FeedbackTextarea({
  value,
  onValueChange,
  placeholder,
  className,
  ...props
}: Omit<ComponentProps<"textarea">, "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      autoFocus
      aria-label={placeholder}
      className={cn(
        "field-sizing-content min-h-20 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
