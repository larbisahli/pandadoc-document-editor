import clsx from "clsx";
import React, { memo } from "react";
import { useEdgeHover } from "./useEdgeHover";
import type { Side } from "./useEdgeHover";
import EdgeBlockHighlight from "./EdgeBlockHighlight";
import type { DragPayload } from "../payload";

interface Props {
  children: React.ReactNode;
  onDrop: (payload: DragPayload, side: Side) => void;
  className?: string;
}

function DropOverlayWrapper({ className, children, onDrop }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const {
    isHovering,
    activeSide,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDropEdgeHandle,
  } = useEdgeHover(ref);

  const onDropHandle = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = JSON.parse(e.dataTransfer.getData("application/json"));
    // Callbacks
    onDrop(payload, activeSide);
    onDropEdgeHandle();
  };

  return (
    <div
      ref={ref}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropHandle}
      className={clsx("relative", className)}
    >
      {children}
      {/* Block highlight overlay */}
      {isHovering && <EdgeBlockHighlight side={activeSide} />}
    </div>
  );
}

export default memo(DropOverlayWrapper);

// <DropBlockOverlayWrapper />
// <DropFieldOverlayWrapper />
// <DropContentOverlayWrapper />

// acceptTypes | acceptTypes?: DragPayload["type"][]; // e.g. ["palette.block","move.node"]
// if (acceptTypes && !acceptTypes.includes(p.type)) return;
// if (shouldHighlight && !shouldHighlight(p)) return;
// acceptTypes={["palette.block","move.node"]} shouldHighlight={(p) => p.type !== "tool.select"}
