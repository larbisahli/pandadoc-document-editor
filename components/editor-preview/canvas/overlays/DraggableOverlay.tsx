"use client";

import React, { memo, useLayoutEffect, useRef } from "react";
import { OverlayId } from "@/interfaces/common";
import { useAppSelector } from "@/lib/hooks";
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
  const overlay = useAppSelector((state) =>
    selectOverlayById(state, overlayId),
  );

  const { position } = overlay;
  const offsetX = position?.offsetX ?? 0;
  const offsetY = position?.offsetY ?? 0;

  // Keep DOM position in sync with props
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.left = `${offsetX}px`;
    element.style.top = `${offsetY}px`;
  }, [offsetX, offsetY]);

  return (
    <div
      ref={ref}
      id={overlayId}
      className="pointer-events-auto absolute h-fit w-fit origin-top-left"
    >
      {children}
    </div>
  );
}

export default memo(DraggableOverlay);
