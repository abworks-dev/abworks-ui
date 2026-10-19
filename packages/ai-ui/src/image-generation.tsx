// Aboard pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Image generation  https://www.assistant-ui.com/elements/image-generation
// Caller-owned presentation only: the generated image, status, and prompt are DTOs.
"use client";

import { Spinner } from "@aboard/ui/core/spinner";
import { ImageIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes } from "react";

export type ImageGenerationStatus =
  "queued" | "generating" | "complete" | "failed";

/**
 * ImageGeneration renders an image-generation request with its status and the
 * resulting image. No generation or network access happens here.
 */
export type ImageGenerationProps = HTMLAttributes<HTMLDivElement> & {
  prompt?: string;
  imageUrl?: string;
  imageAlt?: string;
  status?: ImageGenerationStatus;
};

export const ImageGeneration = ({
  prompt,
  imageUrl,
  imageAlt = "Generated image",
  status = "complete",
  className,
  ...props
}: ImageGenerationProps) => {
  const busy = status === "queued" || status === "generating";

  return (
    <div
      data-slot="image-generation"
      data-status={status}
      className={cn("w-full rounded-lg border p-4", className)}
      {...props}
    >
      {prompt && <p className="text-sm text-muted-foreground">{prompt}</p>}
      <div className="mt-3 grid aspect-square w-full place-items-center overflow-hidden rounded-md bg-muted/20">
        {busy ? (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <Spinner aria-hidden="true" />
            <span>{status === "queued" ? "Queued" : "Generating"}</span>
          </div>
        ) : imageUrl ? (
          // Caller-supplied content, not an arbitrary remote fetch.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={imageAlt}
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon aria-hidden="true" className="size-6" />
            <span>{status === "failed" ? "Failed" : "No image"}</span>
          </div>
        )}
      </div>
    </div>
  );
};
