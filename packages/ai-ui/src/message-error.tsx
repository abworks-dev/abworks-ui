// Aboard pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Error state  https://www.assistant-ui.com/elements/error-state
// Caller-owned presentation only: the error, retry intent, and message are props/callbacks.
"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@aboard/ui/core/alert";
import { Button } from "@aboard/ui/core/button";
import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes } from "react";

/**
 * MessageError renders a quiet in-thread failure banner with a retry path.
 * It is non-modal and does not own the retry transport; `onRetry` is caller-owned.
 */
export type MessageErrorProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export const MessageError = ({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Retry",
  className,
  children,
  ...props
}: MessageErrorProps) => (
  <div data-slot="message-error" className={cn("w-full", className)} {...props}>
    <Alert variant="destructive">
      <TriangleAlertIcon aria-hidden="true" className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      {description || children ? (
        <AlertDescription>
          {description}
          {children}
        </AlertDescription>
      ) : null}
      {onRetry && (
        <AlertAction>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <RotateCwIcon aria-hidden="true" className="size-3.5" />
            {retryLabel}
          </Button>
        </AlertAction>
      )}
    </Alert>
  </div>
);
