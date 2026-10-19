// Aboard pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Guardrail notice  https://www.assistant-ui.com/elements/guardrail-notice
// Caller-owned presentation only: the refusal and nearest alternative are props.
"use client";

import { Alert, AlertDescription, AlertTitle } from "@aboard/ui/core/alert";
import { ShieldAlertIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * GuardrailNotice renders a refusal in its own shape, with the nearest thing
 * it can do instead. The refusal text and alternative are caller-owned props.
 */
export type GuardrailNoticeProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  alternative?: ReactNode;
  children?: ReactNode;
};

export const GuardrailNotice = ({
  title = "This request was declined",
  description,
  alternative,
  className,
  children,
  ...props
}: GuardrailNoticeProps) => (
  <div
    data-slot="guardrail-notice"
    className={cn("w-full", className)}
    {...props}
  >
    <Alert>
      <ShieldAlertIcon aria-hidden="true" className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      {description || children ? (
        <AlertDescription>
          {description}
          {children}
        </AlertDescription>
      ) : null}
      {alternative !== undefined && (
        <div className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {alternative}
        </div>
      )}
    </Alert>
  </div>
);
