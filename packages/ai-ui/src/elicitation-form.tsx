// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Elicitation form  https://www.assistant-ui.com/elements/elicitation-form
// Caller-owned presentation only: fields and submit are caller-owned; nothing is sent here.
"use client";

import { Button } from "@abworks-dev/ui/core/button";
import { Input } from "@abworks-dev/ui/core/input";
import { Label } from "@abworks-dev/ui/core/label";
import { Textarea } from "@abworks-dev/ui/core/textarea";
import { cn } from "./utils";
import type { HTMLAttributes, ReactNode } from "react";
import { useCallback, useState } from "react";

export type ElicitationField = {
  id: string;
  label: string;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
};

export type ElicitationValues = Record<string, string>;

/**
 * ElicitationForm renders the fields a server still needs mid-tool-call, with
 * the submit intent as a caller callback. It owns only its local field values.
 */
export type ElicitationFormProps = HTMLAttributes<HTMLDivElement> & {
  fields: ElicitationField[];
  title?: string;
  description?: string;
  onSubmit?: (values: ElicitationValues) => void;
  submitLabel?: string;
  children?: ReactNode;
};

export const ElicitationForm = ({
  fields,
  title,
  description,
  onSubmit,
  submitLabel = "Submit",
  className,
  children,
  ...props
}: ElicitationFormProps) => {
  const [values, setValues] = useState<ElicitationValues>({});

  const setValue = useCallback((id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit?.(values);
  }, [onSubmit, values]);

  return (
    <div
      data-slot="elicitation-form"
      className={cn("w-full rounded-lg border p-4", className)}
      {...props}
    >
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-3 flex flex-col gap-3">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-1.5">
            <Label htmlFor={`elicitation-${field.id}`}>
              {field.label}
              {field.required ? (
                <span aria-hidden="true" className="text-destructive">
                  {" "}
                  *
                </span>
              ) : null}
            </Label>
            {field.multiline ? (
              <Textarea
                id={`elicitation-${field.id}`}
                placeholder={field.placeholder}
                value={values[field.id] ?? ""}
                onChange={(event) => setValue(field.id, event.target.value)}
              />
            ) : (
              <Input
                id={`elicitation-${field.id}`}
                placeholder={field.placeholder}
                value={values[field.id] ?? ""}
                onChange={(event) => setValue(field.id, event.target.value)}
              />
            )}
          </div>
        ))}
        {children}
      </div>
      {onSubmit && (
        <div className="mt-4 flex justify-end">
          <Button type="button" size="sm" onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
