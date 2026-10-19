// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Edit a sent message  https://www.assistant-ui.com/elements/edit-message
// Caller-owned presentation only: the draft, discarded-reply count, and save/cancel are props/callbacks.
"use client";

import { Button } from "@abworks-dev/ui/core/button";
import { Textarea } from "@abworks-dev/ui/core/textarea";
import { cn } from "./utils";
import type { ComponentProps } from "react";

export type EditMessageProps = ComponentProps<"div"> & {
  defaultValue?: string;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  discardedReplies?: number;
  saveLabel?: string;
  cancelLabel?: string;
};

/**
 * EditMessage lets a caller rewrite a sent turn in place, told up front how
 * many downstream replies the edit discards. Value, save, and cancel are
 * caller-owned; nothing is submitted here.
 */
export const EditMessage = ({
  defaultValue = "",
  onSave,
  onCancel,
  discardedReplies = 0,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  className,
  ...props
}: EditMessageProps) => {
  const value = defaultValue;

  return (
    <div
      data-slot="edit-message"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <Textarea
        defaultValue={value}
        autoFocus
        aria-label="Edit message"
        placeholder="Edit your message…"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {discardedReplies > 0
            ? `${discardedReplies} ${discardedReplies === 1 ? "reply" : "replies"} will be discarded`
            : null}
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" size="sm" onClick={() => onSave?.(value)}>
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
