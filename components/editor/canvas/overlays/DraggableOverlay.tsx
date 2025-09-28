"use client";

import React, { memo, useLayoutEffect, useMemo, useRef } from "react";
import { browserZoomLevel, makeDragImageFrom } from "./helpers";
import { OverlayId } from "@/interfaces/common";
import { FIELD_DATA_FORMAT } from "@/dnd";
import { usePage } from "../context/PageContext";
import { useAppSelector } from "@/lib/hooks";
import { selectPageOverlayIds } from "@/lib/features/layout/layoutSlice";
import {
  collectRectsByIds,
  getCurrentRect,
  getPageSize,
} from "@/utils/helpers/alignmentGuides";
import { useAlignmentGuides } from "../../hooks/useAlignmentGuides";
import { PageSize, Rect } from "@/interfaces";
import { selectOverlayById } from "@/lib/features/overlay/overlaySlice";

export type Point = { offsetX: number; offsetY: number };

export type OverlayDragPayload = {
  kind: "overlay";
  id: OverlayId;
  grabOffset: { offsetX: number; offsetY: number };
  startPos: { offsetX: number; offsetY: number };
};

type DraggableOverlayProps = {
  overlayId: OverlayId;
  children: React.ReactNode;
};

function DraggableOverlay({ overlayId, children }: DraggableOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<ReturnType<typeof makeDragImageFrom> | null>(null);
  const grabOffset = useRef<Point>({ offsetX: 0, offsetY: 0 });
  const rulerRootLayerRef = useRef<HTMLDivElement | null>(null);
  const rulerThrottlerAFRef = useRef<number | null>(null);

  const overlay = useAppSelector((state) =>
    selectOverlayById(state, overlayId),
  );

  const { pageId } = usePage();
  const overlayIds = useAppSelector((state) =>
    selectPageOverlayIds(state, pageId),
  );

  const scale = browserZoomLevel;

  const { position } = overlay;
  const offsetX = position?.offsetX ?? 0;
  const offsetY = position?.offsetY ?? 0;

  const pageSize: PageSize = useMemo(() => getPageSize(pageId), [pageId]);

  const {
    guides,
    snappedLeft,
    snappedTop,
    onDragStartAlign,
    onDragMoveAlign,
    onDragEndAlign,
  } = useAlignmentGuides({ threshold: 6, snap: true });

  // Keep DOM position in sync with props
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.left = `${offsetX}px`;
    element.style.top = `${offsetY}px`;
  }, [offsetX, offsetY]);

  // Rulers root container overlay inside the page
  const ensureRulerOverlayLayer = () => {
    const pageEl = document.getElementById(pageId);
    if (!pageEl) return null;
    if (
      !rulerRootLayerRef.current ||
      !pageEl.contains(rulerRootLayerRef.current)
    ) {
      const node = document.createElement("div");
      Object.assign(node.style, {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        zIndex: "999999",
      } as CSSStyleDeclaration);
      pageEl.appendChild(node);
      rulerRootLayerRef.current = node;
    }
    return rulerRootLayerRef.current;
  };

  // Fully remove ruler root to avoid leftovers
  const clearGuides = () => {
    if (rulerRootLayerRef.current) {
      rulerRootLayerRef.current.remove();
      rulerRootLayerRef.current = null;
    }
  };

  // Render rulers
  const renderGuides = () => {
    const root = ensureRulerOverlayLayer();
    if (!root) return;
    // Throttle DOM writes to one per frame
    if (rulerThrottlerAFRef.current != null) return;
    rulerThrottlerAFRef.current = requestAnimationFrame(() => {
      rulerThrottlerAFRef.current = null;

      // Build all lines off-DOM, then attach them once
      const frag = document.createDocumentFragment();
      const height = pageSize.height * scale;
      const width = pageSize.width * scale;

      // Vertical x-axis
      for (const x of guides.x || []) {
        const line = document.createElement("div");
        Object.assign(line.style, {
          position: "absolute",
          left: `${x * scale}px`,
          top: "0",
          width: "1px",
          height: `${height}px`,
          background: "var(--rulerBgColor)",
          transform: "translateX(-0.5px)",
          zIndex: "999999",
        } as CSSStyleDeclaration);
        frag.appendChild(line);
      }

      // Horizontal y-axis
      for (const y of guides.y || []) {
        const line = document.createElement("div");
        Object.assign(line.style, {
          position: "absolute",
          top: `${y * scale}px`,
          left: "0",
          height: "1px",
          width: `${width}px`,
          background: "var(--rulerBgColor)",
          transform: "translateY(-0.5px)",
          zIndex: "999999",
        } as CSSStyleDeclaration);
        frag.appendChild(line);
      }

      root.replaceChildren(frag);
    });
  };

  // Compute pointer offset inside the element
  const computeGrabOffset = (e: React.DragEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    return { offsetX: e.clientX - r.left, offsetY: e.clientY - r.top };
  };

  const onDragStart = (e: React.DragEvent) => {
    const element = ref.current;
    if (!element || !e.dataTransfer) return;

    // Precompute candidates at drag start (fresh rects from DOM)
    onDragStartAlign(
      overlayId,
      collectRectsByIds(overlayIds, pageId, scale),
      pageSize,
    );

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

    // Build our custom ghost (a DOM clone you control)
    const ghost = makeDragImageFrom(element, scale);
    ghost.element.style.position = "fixed";
    ghost.element.style.pointerEvents = "none";
    ghost.element.style.zIndex = "99999";
    document.body.appendChild(ghost.element);
    ghostRef.current = ghost;

    // Position ghost initially
    ghost.updateAt(
      e.clientX,
      e.clientY,
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

    // Compute tentative position (content coords)
    const pageEl = document.getElementById(pageId)!;
    const pageBox = pageEl.getBoundingClientRect();

    const pointerX = clientX - pageBox.left;
    const pointerY = clientY - pageBox.top;

    const tentativeLeft =
      (pointerX - grabOffset.current.offsetX) / (scale || 1);
    const tentativeTop = (pointerY - grabOffset.current.offsetY) / (scale || 1);

    const current = getCurrentRect(overlayId, pageId, scale);
    if (!current) return;

    const next: Rect = { ...current, left: tentativeLeft, top: tentativeTop };

    // Alignment (snapping + active guides)
    onDragMoveAlign(next);

    // Move ghost to snapped screen coord
    const snappedX =
      pageBox.left + snappedLeft * (scale || 1) + grabOffset.current.offsetX;
    const snappedY =
      pageBox.top + snappedTop * (scale || 1) + grabOffset.current.offsetY;
    ghostRef.current.updateAt(
      snappedX,
      snappedY,
      grabOffset.current.offsetX,
      grabOffset.current.offsetY,
    );

    // Draw rulers inside page
    renderGuides();
  };

  const onDragEnd = () => {
    if (ref.current) {
      ref.current.style.opacity = "";
    }
    ghostRef.current?.element.remove();
    ghostRef.current?.destroy?.();
    ghostRef.current = null;
    // Callback & cleanup
    onDragEndAlign();
    clearGuides();
  };

  return (
    <div
      ref={ref}
      id={overlayId}
      className="pointer-events-auto absolute h-fit w-fit origin-top-left"
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
