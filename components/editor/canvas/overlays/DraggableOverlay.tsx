"use client";

import React, { useRef } from "react";
import { makeDragImageFrom } from "./helpers";
import { OverlayId } from "@/interfaces/common";

export type Point = { offsetX: number; offsetY: number };

export type DragPayload = {
  kind: "overlay";
  id: OverlayId;
  grabOffset: { offsetX: number; offsetY: number };
  startPos: { offsetX: number; offsetY: number };
};

type DraggableOverlayProps = {
  overlayId: OverlayId;
  offsetX: number;
  offsetY: number;
  scale?: number;
  children: React.ReactNode;
};

export function DraggableOverlay({
  overlayId,
  offsetX,
  offsetY,
  scale = 1,
  children,
}: DraggableOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<ReturnType<typeof makeDragImageFrom> | null>(null);
  const grabOffset = useRef<Point>({ offsetX: 0, offsetY: 0 });

  // Keep DOM position in sync with props
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.left = `${offsetX}px`;
    el.style.top = `${offsetY}px`;
  }, [offsetX, offsetY]);

  // Compute pointer offset inside the element
  const computeGrabOffset = (e: React.DragEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    return { offsetX: e.clientX - r.left, offsetY: e.clientY - r.top };
  };

  const onDragStart = (e: React.DragEvent) => {
    const el = ref.current;
    if (!el || !e.dataTransfer) return;

    // Prepare payload
    grabOffset.current = computeGrabOffset(e);
    const payload: DragPayload = {
      kind: "overlay",
      id: overlayId,
      grabOffset: { ...grabOffset.current },
      startPos: { offsetX, offsetY },
    };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify(payload));

    // Build and register custom drag image
    const ghost = makeDragImageFrom(el, scale);
    ghostRef.current = ghost;

    // Align the ghost so cursor stays at the same relative point
    ghost.updateAt(
      e.clientX,
      e.clientY,
      grabOffset.current.offsetX,
      grabOffset.current.offsetY,
    );
    e.dataTransfer.setDragImage(
      ghost.el,
      grabOffset.current.offsetX,
      grabOffset.current.offsetY,
    );

    // Visually hide original while dragging
    el.style.opacity = "0";
  };

  const onDrag = (e: React.DragEvent) => {
    if (!ghostRef.current) return;
    const { clientX, clientY } = e;
    if (clientX === 0 && clientY === 0) return;
    // Move ghost to follow pointer
    ghostRef.current.updateAt(
      clientX,
      clientY,
      grabOffset.current.offsetX,
      grabOffset.current.offsetY,
    );
  };

  const onDragEnd = (e: React.DragEvent) => {
    const el = ref.current;
    if (el) {
      el.style.opacity = "";
    }
    // Clean up ghost
    ghostRef.current?.destroy();
    ghostRef.current = null;
  };

  return (
    <div
      ref={ref}
      id={overlayId}
      className="pointer-events-auto absolute top-0 left-0 cursor-grab"
      draggable
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      role="note"
      data-overlay
    >
      {children}
    </div>
  );
}
