import React, { memo } from "react";
import { useEdgeHover } from "./useEdgeHover";
import EdgeBlockHighlight from "./EdgeBlockHighlight";
import clsx from "clsx";
import { DropPayload } from "@/interfaces/dnd";
import { PALETTE_DATA_FORMAT } from "..";
import { DropSide } from "@/interfaces/enum";

interface Props {
  children: React.ReactNode;
  onDrop: (payload: DropPayload, side: DropSide | null) => void;
  className?: string;
  id?: string;
  dataNodeType?: string;
  style?: React.CSSProperties;
}

function DropBlockOverlayWrapper({
  id,
  children,
  onDrop,
  className,
  dataNodeType,
  style,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const {
    isDragging,
    activeSide,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDropEdgeHandle,
  } = useEdgeHover(ref);

  const onDropHandle = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.getData(PALETTE_DATA_FORMAT);
    if (!data) return;
    const payload = JSON.parse(data);
    // Callbacks
    onDrop(payload, activeSide);
    onDropEdgeHandle();
  };

  return (
    <div
      id={id}
      ref={ref}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropHandle}
      className={clsx("relative w-full bg-amber-700", className)}
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
