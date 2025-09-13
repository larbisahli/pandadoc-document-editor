"use client";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import clsx from "clsx";
import { OverlayId } from "@/interfaces/common";
import { usePage } from "../context/PageContext";
import { clamp, getPageMetrics, num } from "./helpers";
import { updateOverlaySize } from "@/lib/features/overlay/overlaySlice";
import { useAppDispatch } from "@/lib/hooks";

type Props = {
  overlayId: OverlayId;
  width: number;
  height: number;
  minW?: number;
  minH?: number;
  scale?: number;
  onResizeEnd?: (w: number, h: number) => void;
  children?: React.ReactNode;
};

type Session = {
  startW: number;
  startH: number;
  startX: number;
  startY: number;
  maxWidthWithinPage: number; // in CONTENT coords
  maxHeightWithinPage: number; // in CONTENT coords
  rafId: number;
  nextW: number;
  nextH: number;
};

function ResizableFieldWrapper({
  overlayId,
  width,
  height,
  minW = 10,
  minH = 30,
  scale = 1,
  onResizeEnd,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<Session | null>(null);

  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  // keep DOM in sync with external state
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.width = `${num(width)}px`;
    element.style.height = `${num(height)}px`;
  }, [width, height]);

  const apply = useCallback(() => {
    const session = sessionRef.current;
    const element = ref.current;
    if (!session || !element) return;
    session.rafId = 0;

    const width = Number.isFinite(session.nextW)
      ? session.nextW
      : session.startW;
    const height = Number.isFinite(session.nextH)
      ? session.nextH
      : session.startH;

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  }, []);

  const schedule = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    if (!session.rafId) {
      session.rafId = requestAnimationFrame(apply);
    }
  }, [apply]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const element = ref.current;
    if (!element) return;

    const pageLayoutElement = document.getElementById(
      pageId,
    ) as HTMLElement | null;
    if (!pageLayoutElement) return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const zoom = num(scale, 1);

    // Current layout box sizes/position
    const elementRect = element.getBoundingClientRect();

    // Convert size
    const startW = num(elementRect.width) / zoom;
    const startH = num(elementRect.height) / zoom;

    // Measure actual position of the element relative to the page content
    const { originLeftDev, originTopDev, contentW, contentH } = getPageMetrics(
      pageLayoutElement,
      zoom,
    );

    const currentLeftContent = (elementRect.left - originLeftDev) / zoom;
    const currentTopContent = (elementRect.top - originTopDev) / zoom;

    // Max allowed width/height
    const maxWidthWithinPage = Math.max(0, contentW - currentLeftContent);
    const maxHeightWithinPage = Math.max(0, contentH - currentTopContent);

    sessionRef.current = {
      startW,
      startH,
      startX: e.clientX,
      startY: e.clientY,
      maxWidthWithinPage,
      maxHeightWithinPage,
      rafId: 0,
      nextW: startW,
      nextH: startH,
    };

    // willChange is great for GPU acceleration
    element.style.willChange = "width, height";
    (element.parentElement || document.body).style.userSelect = "none";
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const session = sessionRef.current;
    if (!session) return;
    if (
      !(event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)
    )
      return;

    const zoom = num(scale, 1);
    const dx = (event.clientX - session.startX) / zoom;
    const dy = (event.clientY - session.startY) / zoom;

    let width = session.startW + dx;
    let height = session.startH + dy;

    // Clamp against min and computed page-remaining space
    width = clamp(width, num(minW, 0), session.maxWidthWithinPage);
    height = clamp(height, num(minH, 0), session.maxHeightWithinPage);

    if (!Number.isFinite(width) || !Number.isFinite(height)) return;

    session.nextW = width;
    session.nextH = height;
    schedule();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const element = ref.current;
    const session = sessionRef.current;
    if (!element || !session) return;

    if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
    if (session.rafId) {
      cancelAnimationFrame(session.rafId);
      session.rafId = 0;
    }

    const finalWidth = Number.isFinite(session.nextW)
      ? session.nextW
      : session.startW;
    const finalHeight = Number.isFinite(session.nextH)
      ? session.nextH
      : session.startH;

    element.style.width = `${finalWidth}px`;
    element.style.height = `${finalHeight}px`;

    // Clean up
    element.style.willChange = "";
    (element.parentElement || document.body).style.userSelect = "";
    sessionRef.current = null;

    dispatch(
      updateOverlaySize({
        overlayId,
        width: finalWidth,
        height: finalHeight,
      }),
    );

    onResizeEnd?.(finalWidth, finalHeight);
  };

  return (
    <div
      ref={ref}
      id={`resizer-${overlayId}`}
      className="group/resize-point absolute box-border"
    >
      {children}
      <div
        id={`resize-point-${overlayId}`}
        role="separator"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={clsx(
          "absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2",
          "h-2 w-2 cursor-nwse-resize rounded-full border border-gray-300 bg-white shadow",
          "invisible touch-none select-none group-hover/resize-point:visible",
        )}
      />
    </div>
  );
}

export default ResizableFieldWrapper;
