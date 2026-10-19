// Aboard pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Web search  https://www.assistant-ui.com/elements/web-search
// Caller-owned presentation only: the query and results are DTOs; no fetching happens here.
"use client";

import { GlobeIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes } from "react";

export type WebSearchResult = {
  id: string;
  title: string;
  snippet?: string;
  href?: string;
};

/**
 * WebSearch renders a query and its results landing one by one. The query and
 * results are caller-owned DTOs; no search or network access happens here.
 */
export type WebSearchProps = Omit<HTMLAttributes<HTMLDivElement>, "results"> & {
  query?: string;
  results: WebSearchResult[];
};

export const WebSearch = ({
  query,
  results,
  className,
  ...props
}: WebSearchProps) => (
  <div
    data-slot="web-search"
    className={cn("w-full rounded-lg border p-4", className)}
    {...props}
  >
    {query && (
      <div className="flex items-center gap-2 text-sm font-medium">
        <GlobeIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        {query}
      </div>
    )}
    <ul className="mt-3 flex flex-col gap-3">
      {results.map((result) => (
        <li key={result.id} className="text-sm">
          {result.href ? (
            <a
              href={result.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {result.title}
            </a>
          ) : (
            <span className="font-medium">{result.title}</span>
          )}
          {result.snippet && (
            <p className="mt-0.5 text-muted-foreground">{result.snippet}</p>
          )}
        </li>
      ))}
    </ul>
  </div>
);
