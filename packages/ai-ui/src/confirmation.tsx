"use client";

import { Button } from "@abworks-dev/ui";
import type { ButtonProps } from "@abworks-dev/ui";
import { cn } from "./utils";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type { ToolState } from "./tool";

export type ConfirmationState = "requested" | "accepted" | "rejected" | ToolState;
export type ConfirmationApproval = { id?: string; approved?: boolean; reason?: string };

interface ConfirmationContextValue { approval?: ConfirmationApproval; state: ConfirmationState }
const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);
const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) throw new Error("Confirmation components must be used within Confirmation");
  return context;
};

export type ConfirmationProps = ComponentProps<"section"> & {
  approval?: ConfirmationApproval;
  state: ConfirmationState;
};

export const Confirmation = ({ className, approval, state, ...props }: ConfirmationProps) => {
  const contextValue = useMemo(() => ({ approval, state }), [approval, state]);
  // Pending tools have no confirmation UI yet; terminal states still render their outcome branch.
  if (state === "pending" || state === "running") return null;
  return (
    <ConfirmationContext.Provider value={contextValue}>
      <section role="alert" className={cn("flex flex-col gap-2 rounded-md border p-4", className)} {...props} />
    </ConfirmationContext.Provider>
  );
};

export type ConfirmationTitleProps = ComponentProps<"div">;
export const ConfirmationTitle = ({ className, ...props }: ConfirmationTitleProps) => <div className={cn("inline", className)} {...props} />;

export interface ConfirmationRequestProps { children?: ReactNode; state?: ConfirmationState }
export const ConfirmationRequest = ({ children, state: explicitState }: ConfirmationRequestProps) => {
  const { state } = useConfirmation();
  const activeState = explicitState ?? state;
  return activeState === "waiting-approval" || activeState === "requested" ? children : null;
};

export interface ConfirmationAcceptedProps { children?: ReactNode; state?: ConfirmationState }
export const ConfirmationAccepted = ({ children, state: explicitState }: ConfirmationAcceptedProps) => {
  const { approval, state } = useConfirmation();
  const activeState = explicitState ?? state;
  return (approval?.approved === true || activeState === "accepted" || activeState === "succeeded") && (activeState === "accepted" || activeState === "succeeded") ? children : null;
};

export interface ConfirmationRejectedProps { children?: ReactNode; state?: ConfirmationState }
export const ConfirmationRejected = ({ children, state: explicitState }: ConfirmationRejectedProps) => {
  const { approval, state } = useConfirmation();
  const activeState = explicitState ?? state;
  return (approval?.approved === false || activeState === "rejected" || activeState === "failed") && (activeState === "rejected" || activeState === "failed") ? children : null;
};

export type ConfirmationActionsProps = ComponentProps<"div">;
export const ConfirmationActions = ({ className, ...props }: ConfirmationActionsProps) => {
  const { state } = useConfirmation();
  if (state !== "waiting-approval" && state !== "requested") return null;
  return <div className={cn("flex items-center justify-end gap-2 self-end", className)} {...props} />;
};

export type ConfirmationActionProps = ButtonProps & {
  decision?: "accept" | "reject";
  onDecision?: (decision: "accept" | "reject") => void;
};
export const ConfirmationAction = ({ decision, onDecision, className, onClick, variant, ...props }: ConfirmationActionProps) => (
  <Button
    {...props}
    className={cn("h-8 px-3 text-sm", className)}
    type="button"
    variant={decision === "reject" ? "outline" : variant}
    onClick={(event) => {
      if (decision) onDecision?.(decision);
      onClick?.(event);
    }}
  />
);
