"use client";

import React, { memo } from "react";
import clsx from "clsx";

type OverlayDropSurfaceProps = {
  surfaceRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode[];
};

function OverlayDropSurface({ surfaceRef, children }: OverlayDropSurfaceProps) {
  return (
    <div
      ref={surfaceRef}
      data-node-type="overlayLayer"
      role="application"
      aria-label="Overlay canvas drop surface"
      className={clsx("overlay-surface absolute inset-0 overflow-hidden")}
    >
      {children}
    </div>
  );
}

export default memo(OverlayDropSurface);
