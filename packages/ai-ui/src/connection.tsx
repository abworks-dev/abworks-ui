"use client";

// Source: vercel/ai-elements @ 6a9d5b1822ffb10bba4bd97175f01edd7d8651cd
// Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
import type { ConnectionLineComponent } from "@xyflow/react";

const HALF = 0.5;

export const Connection: ConnectionLineComponent = ({
  fromX,
  fromY,
  toX,
  toY,
}) => (
  <g>
    <path
      className="animated"
      d={`M${fromX},${fromY} C ${fromX + (toX - fromX) * HALF},${fromY} ${fromX + (toX - fromX) * HALF},${toY} ${toX},${toY}`}
      fill="none"
      stroke="var(--color-ring)"
      strokeWidth={1}
    />
    <circle
      cx={toX}
      cy={toY}
      fill="var(--color-background)"
      r={3}
      stroke="var(--color-ring)"
      strokeWidth={1}
    />
  </g>
);
