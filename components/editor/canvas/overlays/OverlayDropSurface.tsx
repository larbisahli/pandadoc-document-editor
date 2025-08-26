"use client";

import React, { memo, useState } from "react";
import { DragPayload } from "./DraggableOverlay";
import { clientToCanvas } from "./helpers";
import clsx from "clsx";
import { OverlayId } from "@/interfaces/common";

type OverlayDropSurfaceProps = {
  surfaceRef: React.RefObject<HTMLElement>;
  scale?: number;
  onCommit: (
    overlayId: OverlayId,
    { offsetX, offsetY }: { offsetX: number; offsetY: number },
  ) => void;
  children: React.ReactNode[];
};

function OverlayDropSurface({
  surfaceRef,
  scale = 1,
  onCommit,
  children,
}: OverlayDropSurfaceProps) {
  const [dragStart, setDragStart] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    // Allow drops
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const surfaceEl = surfaceRef.current;
    if (!surfaceEl) return;

    const json = e.dataTransfer?.getData("application/json");
    if (!json) return;

    let payload: DragPayload | null = null;
    try {
      payload = JSON.parse(json);
    } catch {
      return;
    }
    if (!payload || payload.kind !== "overlay") return;

    // Where did the pointer land
    const hit = clientToCanvas(surfaceEl, e.clientX, e.clientY, scale);

    // Place the overlay so that the original grab point sits under the cursor
    let nextX = hit.offsetX - payload.grabOffset.offsetX / scale;
    let nextY = hit.offsetY - payload.grabOffset.offsetY / scale;

    // Keep within the visible surface.
    const el = document.getElementById(payload.id) as HTMLElement | null;

    const w = el ? el.getBoundingClientRect().width / scale : 0;
    const h = el ? el.getBoundingClientRect().height / scale : 0;
    const maxX = Math.max(0, surfaceEl.clientWidth / scale - w);
    const maxY = Math.max(0, surfaceEl.clientHeight / scale - h);
    nextX = Math.max(0, Math.min(maxX, nextX));
    nextY = Math.max(0, Math.min(maxY, nextY));

    // Commit to app state
    onCommit(payload.id, { offsetX: nextX, offsetY: nextY });

    // Also place the element immediately
    if (el) {
      el.style.left = `${nextX}px`;
      el.style.top = `${nextY}px`;
      // in case dragend ran before
      el.style.opacity = "";
    }
  };

  return (
    <div
      ref={surfaceRef as any}
      onDragStart={() => setDragStart(true)}
      onDragEnd={() => setDragStart(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={clsx(
        "absolute inset-0 overflow-auto",
        !dragStart && "pointer-events-none",
      )}
      data-node-type="overlayLayer"
      role="application"
      aria-label="Overlay canvas drop surface"
    >
      {children}
    </div>
  );
}

export default memo(OverlayDropSurface);
