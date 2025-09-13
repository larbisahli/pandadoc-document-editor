"use client";

import React, { memo, useState } from "react";
import { OverlayDragPayload } from "./DraggableOverlay";
import { clientToCanvas } from "./helpers";
import clsx from "clsx";
import { OverlayId } from "@/interfaces/common";
import { usePage } from "../context/PageContext";
import { FIELD_DATA_FORMAT } from "@/dnd";

type OverlayDropSurfaceProps = {
  surfaceRef: React.RefObject<HTMLDivElement>;
  scale?: number;
  onCommit: (
    overlayId: OverlayId,
    { offsetX, offsetY }: { offsetX: number; offsetY: number },
  ) => void;
  children: React.ReactNode[];
  onDropHandler: (e: React.DragEvent) => void;
};

function OverlayDropSurface({
  surfaceRef,
  scale = 1,
  onCommit,
  children,
  onDropHandler,
}: OverlayDropSurfaceProps) {
  const [dragStart, setDragStart] = useState(false);

  const { pageId } = usePage();

  const AllowWrite = (overlayId: OverlayId, offsetX: number, nextY: number) => {
    const pageLayoutElement = document.getElementById(
      pageId,
    ) as HTMLElement | null;
    const resizeContainerElementId = `resizer-${overlayId}`;
    const resizeContainerElement = document.getElementById(
      resizeContainerElementId,
    ) as HTMLElement | null;
    if (!resizeContainerElement || !pageLayoutElement) return false;

    const rect = pageLayoutElement.getBoundingClientRect();
    const elementRect = resizeContainerElement.getBoundingClientRect();

    // In case dragging beyond allowed surface
    if (offsetX + elementRect?.width >= rect?.width) return false;
    else if (nextY + elementRect?.height >= rect?.height) return false;
    return true;
  };

  const onDragOver = (e: React.DragEvent) => {
    // Allow drops
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Callbacks
    onDropHandler(e);

    const surfaceEl = surfaceRef.current;
    if (!surfaceEl) return;

    const data = e.dataTransfer?.getData(FIELD_DATA_FORMAT);
    console.log("!!!!!", { data });
    if (!data) return;

    let payload: OverlayDragPayload | null = null;
    try {
      payload = JSON.parse(data);
    } catch {
      return;
    }
    if (!payload || payload.kind !== "overlay") return;

    // Where did the pointer land
    const hit = clientToCanvas(surfaceEl, e.clientX, e.clientY, scale);

    // Place the overlay so that the original grab point sits under the cursor
    let nextX = hit.offsetX - payload.grabOffset.offsetX / scale;
    let nextY = hit.offsetY - payload.grabOffset.offsetY / scale;

    const element = document.getElementById(payload.id) as HTMLElement | null;

    const maxX = Math.max(0, surfaceEl.clientWidth / scale);
    const maxY = Math.max(0, surfaceEl.clientHeight / scale);
    nextX = Math.max(0, Math.min(maxX, nextX));
    nextY = Math.max(0, Math.min(maxY, nextY));

    if (!AllowWrite(payload.id, nextX, nextY)) return;

    // Commit to app state
    onCommit(payload.id, { offsetX: nextX, offsetY: nextY });

    // Also place the element immediately
    if (element) {
      element.style.left = `${nextX}px`;
      element.style.top = `${nextY}px`;
      // In case dragend ran before
      element.style.opacity = "";
    }
  };

  return (
    <div
      ref={surfaceRef}
      onDragStart={() => setDragStart(true)}
      onDragEnd={() => setDragStart(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-node-type="overlayLayer"
      role="application"
      aria-label="Overlay canvas drop surface"
      className={clsx(
        "overlay-surface bsg-amber-400 absolute inset-0 overflow-auto",
        !dragStart && "pointer-events-none",
      )}
    >
      {children}
    </div>
  );
}

export default memo(OverlayDropSurface);
