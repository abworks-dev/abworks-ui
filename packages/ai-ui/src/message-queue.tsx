// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Message queue  https://www.assistant-ui.com/elements/message-queue
// Caller-owned presentation only: pending turns arrive as props; cancel is a callback.
"use client";

import { Button } from "@abworks-dev/ui/core/button";
import { XIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes, ReactNode } from "react";

export type MessageQueueItem = {
  id: string;
  content: ReactNode;
};

/**
 * MessageQueue renders turns typed while a run was in flight, stacked and
 * cancelable. It does not own the pending queue; the list and `onCancel` are
 * caller-owned.
 */
export type MessageQueueProps = HTMLAttributes<HTMLDivElement> & {
  items: MessageQueueItem[];
  onCancel?: (id: string) => void;
  cancelLabel?: string;
};

export const MessageQueue = ({
  items,
  onCancel,
  cancelLabel = "Cancel",
  className,
  ...props
}: MessageQueueProps) => {
  if (items.length === 0) return null;

  return (
    <div
      data-slot="message-queue"
      aria-label="Pending messages"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
        >
          <span className="min-w-0 flex-1 truncate">{item.content}</span>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={cancelLabel}
              onClick={() => onCancel(item.id)}
            >
              <XIcon aria-hidden="true" className="size-3.5" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
