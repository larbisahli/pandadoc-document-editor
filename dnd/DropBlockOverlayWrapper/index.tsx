import React, { memo } from "react";
import EdgeBlockHighlight from "./EdgeBlockHighlight";
import clsx from "clsx";
import { DropPayload } from "@/interfaces/dnd";
import { PALETTE_DATA_FORMAT } from "..";
import { DropSide } from "@/interfaces/enum";
import { clamp } from "@/utils";
import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  onDrop: (payload: DropPayload, side: DropSide | null) => void;
  className?: string;
  id?: string;
  dataNodeType?: string;
  style?: React.CSSProperties;
}

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

function DropBlockOverlayWrapper({
  id,
  children,
  onDrop,
  className,
  dataNodeType,
  style,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const boundsRef = useRef<BoundsRect | null>(null);
  const lastSideRef = useRef<DropSide>(null);
  const rafRef = useRef<number>(0);
  const depthRef = useRef<number>(0);
  const pendingSideRef = useRef<DropSide>(null);

  const [activeSide, setActiveSide] = useState<DropSide | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Cancel the last animation frame
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

      setIsDragging(true);
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
      setIsDragging(false);
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

  const computeSide = (e: React.DragEvent<HTMLDivElement>): DropSide | null => {
    if (!boundsRef.current) return null;

    const { width, height, left, top, edgeX, edgeY } = boundsRef.current;

    const x = e.clientX - left,
      y = e.clientY - top;
    const dL = x,
      dR = width - x,
      dT = y,
      dB = height - y;
    let side: DropSide = DropSide.Left;
    let min = dL;
    let thresholdX = edgeX,
      thresholdY = edgeY;

    if (dR < min) {
      min = dR;
      side = DropSide.Right;
    }
    if (dT < min) {
      min = dT;
      side = DropSide.Top;
    }
    if (dB < min) {
      min = dB;
      side = DropSide.Bottom;
    }

    // HYSTERESIS_PX adds a buffer so that once we’re in one edge, it doesn’t immediately flip when you move slightly away.
    switch (lastSideRef.current) {
      case DropSide.Left:
      case DropSide.Right:
        if (side === lastSideRef.current) thresholdX += HYSTERESIS_PX;
        break;
      case DropSide.Top:
      case DropSide.Bottom:
        if (side === lastSideRef.current) thresholdY += HYSTERESIS_PX;
        break;
    }

    if (
      (side === DropSide.Left || side === DropSide.Right) &&
      min <= thresholdX
    )
      return side;
    if (
      (side === DropSide.Top || side === DropSide.Bottom) &&
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

    if (!isDragging) setIsDragging(true);

    const side = computeSide(e);
    // In case same side
    if (side === lastSideRef.current) return;
    pendingSideRef.current = side;
    schedule();
  };

  const onDropHandle = (e: React.DragEvent) => {
    // Claim the drop and stop it from reaching the root (RootDropBoundary)
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.getData(PALETTE_DATA_FORMAT);
    if (!data) return;
    const payload = JSON.parse(data);
    // Callbacks
    onDrop(payload, activeSide);
    // Clean up
    depthRef.current = 0;
    boundsRef.current = null;
    lastSideRef.current = null;
    pendingSideRef.current = null;
    setActiveSide(null);
    setIsDragging(false);
  };

  return (
    <div
      id={id}
      ref={ref}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropHandle}
      className={clsx("relative w-full", className)}
      data-node-type={dataNodeType}
      style={style}
    >
      {children}
      {/* Block highlight overlay */}
      {isDragging && <EdgeBlockHighlight side={activeSide} />}
    </div>
  );
}

export default memo(DropBlockOverlayWrapper);
