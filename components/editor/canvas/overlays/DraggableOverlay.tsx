"use client";

import React, { memo, useLayoutEffect, useRef } from "react";
import { makeDragImageFrom } from "./helpers";
import { OverlayId } from "@/interfaces/common";
import { FIELD_DATA_FORMAT } from "@/dnd";

export type Point = { offsetX: number; offsetY: number };

export type OverlayDragPayload = {
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

function DraggableOverlay({
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
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.left = `${offsetX}px`;
    element.style.top = `${offsetY}px`;
  }, [offsetX, offsetY]);

  // Compute pointer offset inside the element
  const computeGrabOffset = (e: React.DragEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    return { offsetX: e.clientX - r.left, offsetY: e.clientY - r.top };
  };

  const onDragStart = (e: React.DragEvent) => {
    const element = ref.current;
    if (!element || !e.dataTransfer) return;

    // Prepare payload
    grabOffset.current = computeGrabOffset(e);
    const payload: OverlayDragPayload = {
      kind: "overlay",
      id: overlayId,
      grabOffset: { ...grabOffset.current },
      startPos: { offsetX, offsetY },
    };
    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData(FIELD_DATA_FORMAT, JSON.stringify(payload));

    // Build and register custom drag image
    const ghost = makeDragImageFrom(element, scale);
    ghostRef.current = ghost;

    // Align the ghost so cursor stays at the same relative point
    ghost.updateAt(
      e.clientX,
      e.clientY,
      grabOffset.current.offsetX,
      grabOffset.current.offsetY,
    );
    e.dataTransfer.setDragImage(
      ghost.element,
      grabOffset.current.offsetX,
      grabOffset.current.offsetY,
    );

    // Visually hide original while dragging
    element.style.opacity = "0";
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

  const onDragEnd = () => {
    const element = ref.current;
    if (element) {
      element.style.opacity = "";
    }
    // Clean up ghost
    ghostRef.current?.destroy();
    ghostRef.current = null;
  };

  return (
    <div
      ref={ref}
      id={overlayId}
      className="pointer-events-auto absolute h-fit w-fit bg-green-800"
      draggable
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {children}
    </div>
  );
}

export default memo(DraggableOverlay);
