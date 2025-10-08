"use client";

import React, { useCallback, useLayoutEffect, useRef } from "react";
import clsx from "clsx";
import { OverlayId } from "@/interfaces/common";
import { usePage } from "../context/PageContext";
import { browserZoomLevel, clamp, getPageMetrics, num } from "./helpers";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { selectOverlayById } from "@/lib/features/overlay/overlaySlice";
import { FieldTemplateType } from "@/interfaces/template";
import { updateFieldSizeFlow } from "@/lib/features/thunks/overlayThunks";

type Props = {
  overlayId: OverlayId;
  onResizeEnd?: (w: number, h: number) => void;
  children?: React.ReactNode;
};

type Session = {
  startW: number;
  startH: number;
  startX: number;
  startY: number;
  maxWidthWithinPage: number; // in content coords
  maxHeightWithinPage: number; // in content coords
  rafId: number;
  nextW: number;
  nextH: number;
};

function ResizableFieldWrapper({ overlayId, onResizeEnd, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<Session | null>(null);

  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  const overlay = useAppSelector((state) =>
    selectOverlayById(state, overlayId),
  );
  const instance = useAppSelector((state) =>
    selectInstance(state, overlay?.instanceId),
  );
  const template = useAppSelector((state) =>
    selectTemplate(state, instance?.templateId),
  );

  const scale = browserZoomLevel;
  const { style: { width, height } = {} } = overlay;
  const {
    propsSchema: {
      resizeWidth: canResizeWidth,
      resizeHeight: canResizeHeight,
      minWidth: minW,
      minHeight: minH,
    } = {},
  } = template as FieldTemplateType;

  // keep DOM in sync with external state
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (width) {
      element.style.width = `${num(width)}px`;
    }
    if (height) {
      element.style.height = `${num(height)}px`;
    }
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

    if (canResizeWidth) {
      element.style.width = `${width}px`;
    }
    if (canResizeHeight) {
      element.style.height = `${height}px`;
    }
  }, [canResizeHeight, canResizeWidth]);

  const schedule = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    if (!session.rafId) {
      session.rafId = requestAnimationFrame(apply);
    }
  }, [apply]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Do nothing
    if (!(canResizeWidth || canResizeHeight)) return;

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

    // only set will-change for enabled axes, willChange is great for GPU acceleration
    const wc: string[] = [];
    if (canResizeWidth) wc.push("width");
    if (canResizeHeight) wc.push("height");
    element.style.willChange = wc.join(", ");
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

    // start from original sizes
    let nextW = session.startW;
    let nextH = session.startH;

    if (canResizeWidth) {
      nextW = clamp(
        session.startW + dx,
        num(minW, 0),
        session.maxWidthWithinPage,
      );
      if (!Number.isFinite(nextW)) nextW = session.startW;
      session.nextW = nextW;
    }

    if (canResizeHeight) {
      nextH = clamp(
        session.startH + dy,
        num(minH, 0),
        session.maxHeightWithinPage,
      );
      if (!Number.isFinite(nextH)) nextH = session.startH;
      session.nextH = nextH;
    }

    // If an axis is disabled, keep the session's next values at start values
    if (!canResizeWidth) session.nextW = session.startW;
    if (!canResizeHeight) session.nextH = session.startH;

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

    const finalWidth = canResizeWidth
      ? Number.isFinite(session.nextW)
        ? session.nextW
        : session.startW
      : session.startW;
    const finalHeight = canResizeHeight
      ? Number.isFinite(session.nextH)
        ? session.nextH
        : session.startH
      : session.startH;

    if (canResizeWidth) element.style.width = `${finalWidth}px`;
    if (canResizeHeight) element.style.height = `${finalHeight}px`;

    // Clean up
    element.style.willChange = "";
    (element.parentElement || document.body).style.userSelect = "";
    sessionRef.current = null;

    // Dispatch with final values (unchanged axis sends previous size)
    dispatch(
      updateFieldSizeFlow({
        overlay: { id: overlayId },
        template: { id: template?.id },
        width: finalWidth,
        height: finalHeight,
      }),
    );
    onResizeEnd?.(finalWidth, finalHeight);
  };

  // Cursor by enabled axes
  const handleCursor =
    canResizeWidth && canResizeHeight
      ? "cursor-nwse-resize"
      : canResizeWidth
        ? "cursor-ew-resize"
        : canResizeHeight
          ? "cursor-ns-resize"
          : "cursor-default";

  return (
    <div
      ref={ref}
      id={`resizer-${overlayId}`}
      className="group/resize-point box-border"
    >
      {children}
      {(canResizeWidth || canResizeHeight) && (
        <div
          id={`resize-point-${overlayId}`}
          role="separator"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={clsx(
            "absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2",
            "h-2 w-2 rounded-full border border-gray-300 bg-white shadow",
            "invisible touch-none select-none group-hover/resize-point:visible",
            handleCursor,
          )}
        />
      )}
    </div>
  );
}

export default ResizableFieldWrapper;
