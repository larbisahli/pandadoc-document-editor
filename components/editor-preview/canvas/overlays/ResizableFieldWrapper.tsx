"use client";

import React, { useLayoutEffect, useRef } from "react";
import { OverlayId } from "@/interfaces/common";
import { useAppSelector } from "@/lib/hooks";
import { selectOverlayById } from "@/lib/features/overlay/overlaySlice";

const num = (value: unknown, f = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : f;
};

type Props = {
  overlayId: OverlayId;
  onResizeEnd?: (w: number, h: number) => void;
  children?: React.ReactNode;
};

function ResizableFieldWrapper({ overlayId, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const overlay = useAppSelector((state) =>
    selectOverlayById(state, overlayId),
  );

  const { style: { width, height } = {} } = overlay;

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

  return (
    <div ref={ref} className="box-border">
      {children}
    </div>
  );
}

export default ResizableFieldWrapper;
