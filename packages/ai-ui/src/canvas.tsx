"use client";

// Source: vercel/ai-elements @ 6a9d5b1822ffb10bba4bd97175f01edd7d8651cd
// Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
import type { ReactFlowProps } from "@xyflow/react";
import { Background, ReactFlow } from "@xyflow/react";
import type { ReactNode } from "react";
import { cn } from "./utils";

import "@xyflow/react/dist/style.css";
import "./styles/graph.css";

export type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

const deleteKeyCode = ["Backspace", "Delete"];

// Graph data, changes and React Flow callbacks belong to the caller.
export const Canvas = ({ children, className, ...props }: CanvasProps) => (
  <ReactFlow
    className={cn("aui-graph", className)}
    deleteKeyCode={deleteKeyCode}
    fitView
    panOnDrag={false}
    panOnScroll
    selectionOnDrag={true}
    zoomOnDoubleClick={false}
    {...props}
  >
    <Background bgColor="var(--color-sidebar)" />
    {children}
  </ReactFlow>
);
