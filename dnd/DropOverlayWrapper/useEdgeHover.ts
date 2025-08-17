import { clamp, hasTransferType } from "@/utils";
import { useEffect, useRef, useState, RefObject } from "react";

export enum SideEnum {
  TOP = "top",
  LEFT = "left",
  RIGHT = "right",
  BOTTOM = "bottom",
}

export type Side = SideEnum | null;

export const NOHL = "application/x-editor-nohighlight";

type BoundsRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  edgeX: number;
  edgeY: number;
};

const EDGE_FRACTION_X = 0.2,
  EDGE_FRACTION_Y = 0.5,
  EDGE_MIN_PX = 10,
  EDGE_MAX_PX = 80,
  HYSTERESIS_PX = 8;

export function useEdgeHover(ref: RefObject<HTMLDivElement | null>) {
  const boundsRef = useRef<BoundsRect | null>(null);
  const lastSideRef = useRef<Side>(null);
  const rafRef = useRef<number>(0);
  const depthRef = useRef<number>(0);
  const pendingSideRef = useRef<Side>(null);

  const [activeSide, setActiveSide] = useState<Side>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Cache geometry
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (depthRef.current === 0) {
      const element = e.currentTarget as HTMLDivElement;
      const rect = element.getBoundingClientRect();
      const edgeX = clamp(
        rect.width * EDGE_FRACTION_X,
        EDGE_MIN_PX,
        EDGE_MAX_PX,
      );
      const edgeY = clamp(
        rect.height * EDGE_FRACTION_Y,
        EDGE_MIN_PX,
        EDGE_MAX_PX,
      );
      boundsRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        edgeX,
        edgeY,
      };

      // skip block highlight
      if (!hasTransferType(e, NOHL)) {
        setIsHovering(true);
      }
    }
    depthRef.current += 1;
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    depthRef.current = Math.max(0, depthRef.current - 1);
    if (depthRef.current === 0) {
      // Cleanup
      boundsRef.current = null;
      lastSideRef.current = null;
      pendingSideRef.current = null;
      setActiveSide(null);
      setIsHovering(false);
    }
  };

  // Throttle to the next animation frame (rAF)
  const schedule = () => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const side = pendingSideRef.current;
        if (side !== lastSideRef.current) {
          lastSideRef.current = side;
          setActiveSide(side);
        }
      });
    }
  };

  const computeSide = (e: React.DragEvent<HTMLDivElement>): Side => {
    if (!boundsRef.current) return null;

    const { width, height, left, top, edgeX, edgeY } = boundsRef.current;

    const x = e.clientX - left,
      y = e.clientY - top;
    const dL = x,
      dR = width - x,
      dT = y,
      dB = height - y;
    let side: Side = SideEnum.LEFT;
    let min = dL;
    let thresholdX = edgeX,
      thresholdY = edgeY;

    if (dR < min) {
      min = dR;
      side = SideEnum.RIGHT;
    }
    if (dT < min) {
      min = dT;
      side = SideEnum.TOP;
    }
    if (dB < min) {
      min = dB;
      side = SideEnum.BOTTOM;
    }

    // HYSTERESIS_PX adds a buffer so that once we’re in one edge, it doesn’t immediately flip when you move slightly away.
    switch (lastSideRef.current) {
      case SideEnum.LEFT:
      case SideEnum.RIGHT:
        if (side === lastSideRef.current) thresholdX += HYSTERESIS_PX;
        break;
      case SideEnum.TOP:
      case SideEnum.BOTTOM:
        if (side === lastSideRef.current) thresholdY += HYSTERESIS_PX;
        break;
    }

    if (
      (side === SideEnum.LEFT || side === SideEnum.RIGHT) &&
      min <= thresholdX
    )
      return side;
    if (
      (side === SideEnum.TOP || side === SideEnum.BOTTOM) &&
      min <= thresholdY
    )
      return side;

    return null; // center dead zone
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!boundsRef.current) {
      const element = ref.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const edgeX = clamp(
          rect.width * EDGE_FRACTION_X,
          EDGE_MIN_PX,
          EDGE_MAX_PX,
        );
        const edgeY = clamp(
          rect.height * EDGE_FRACTION_Y,
          EDGE_MIN_PX,
          EDGE_MAX_PX,
        );
        boundsRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          edgeX,
          edgeY,
        };
      }
    }

    if (!isHovering && !hasTransferType(e, NOHL)) setIsHovering(true);

    const side = computeSide(e);
    // In case same side
    if (side === lastSideRef.current) return;
    pendingSideRef.current = side;
    schedule();
  };

  const onDropEdgeHandle = () => {
    // Clean up
    depthRef.current = 0;
    boundsRef.current = null;
    lastSideRef.current = null;
    pendingSideRef.current = null;
    setActiveSide(null);
    setIsHovering(false);
  };

  // Cancel the last animation frame
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    activeSide,
    isHovering,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDropEdgeHandle,
  };
}
