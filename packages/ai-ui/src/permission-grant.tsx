// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Permission grant  https://www.assistant-ui.com/elements/permission-grant
// Caller-owned presentation only: the grant and its scope are DTOs; approval is a callback.
"use client";

import { Button } from "@abworks-dev/ui/core/button";
import { ShieldCheckIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * PermissionGrant renders a capability grant with its reach spelled out,
 * distinct from a one-off action approval. The grant scope is a caller-owned
 * DTO; grant/deny are callbacks and never performed here.
 */
export type PermissionGrantProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  scope?: string[];
  onGrant?: () => void;
  onDeny?: () => void;
  grantLabel?: string;
  denyLabel?: string;
  children?: ReactNode;
};

export const PermissionGrant = ({
  title,
  description,
  scope,
  onGrant,
  onDeny,
  grantLabel = "Grant",
  denyLabel = "Deny",
  className,
  children,
  ...props
}: PermissionGrantProps) => (
  <div
    data-slot="permission-grant"
    className={cn("w-full rounded-lg border p-4", className)}
    {...props}
  >
    <div className="flex items-start gap-3">
      <ShieldCheckIcon
        aria-hidden="true"
        className="mt-0.5 size-5 text-primary"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {scope && scope.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {scope.map((item) => (
              <li
                key={item}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </div>
    {(onGrant || onDeny) && (
      <div className="mt-3 flex justify-end gap-2">
        {onDeny && (
          <Button type="button" variant="ghost" size="sm" onClick={onDeny}>
            {denyLabel}
          </Button>
        )}
        {onGrant && (
          <Button type="button" size="sm" onClick={onGrant}>
            {grantLabel}
          </Button>
        )}
      </div>
    )}
  </div>
);
