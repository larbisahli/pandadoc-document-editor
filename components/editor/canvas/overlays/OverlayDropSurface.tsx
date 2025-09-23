"use client";

import React, { memo, useState } from "react";
import { OverlayDragPayload } from "./DraggableOverlay";
import { clientToCanvas } from "./helpers";
import clsx from "clsx";
import { OverlayId } from "@/interfaces/common";
import { usePage } from "../context/PageContext";
import { FIELD_DATA_FORMAT } from "@/dnd";
import { snapFinalPosition } from "@/utils/helpers/alignmentGuides";

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
    // Drop handler for palette drop
    onDropHandler(e);

    const surfaceEl = surfaceRef.current;
    if (!surfaceEl) return;

    const data = e.dataTransfer?.getData(FIELD_DATA_FORMAT);
    if (!data) return;

    let payload: OverlayDragPayload | null = null;
    try {
      payload = JSON.parse(data);
    } catch (e) {
      console.log(e);
      return;
    }

    if (!payload || payload.kind !== "overlay") return;

    // Where did the pointer land (content coords)
    const hit = clientToCanvas(surfaceEl, e.clientX, e.clientY, scale);

    // Tentative position from pointer + grab offset
    let nextX = hit.offsetX - payload.grabOffset.offsetX / scale;
    let nextY = hit.offsetY - payload.grabOffset.offsetY / scale;

    // Clamp to page bounds
    const maxX = Math.max(0, surfaceEl.clientWidth / scale);
    const maxY = Math.max(0, surfaceEl.clientHeight / scale);
    nextX = Math.max(0, Math.min(maxX, nextX));
    nextY = Math.max(0, Math.min(maxY, nextY));

    // SNAP to page center / other fields (matches ghost snapping)
    const snapped = snapFinalPosition(
      surfaceEl,
      payload.id,
      nextX,
      nextY,
      scale,
    );
    nextX = snapped.left;
    nextY = snapped.top;

    // In case outside boundaries
    if (!AllowWrite(payload.id, nextX, nextY)) return;

    // Commit to store
    onCommit(payload.id, { offsetX: nextX, offsetY: nextY });

    // Also place the element immediately for visual sync
    const element = document.getElementById(payload.id) as HTMLElement | null;
    if (element) {
      element.style.left = `${nextX}px`;
      element.style.top = `${nextY}px`;
      element.style.opacity = "";
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setDragStart(true);
  };

  const handleOnDragEnd = (e: React.DragEvent) => {
    setDragStart(false);
  };

  return (
    <div
      ref={surfaceRef}
      onDragStart={handleDragStart}
      onDragEnd={handleOnDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-node-type="overlayLayer"
      role="application"
      aria-label="Overlay canvas drop surface"
      className={clsx(
        "overlay-surface absolute inset-0 overflow-hidden",
        !dragStart && "pointer-events-none",
      )}
    >
      {children}
    </div>
  );
}

export default memo(OverlayDropSurface);
