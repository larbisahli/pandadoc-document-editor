import React, { memo } from "react";
import type { DragPayload } from "./payload";
import { NOHL } from "./DropOverlayWrapper/useEdgeHover";

type WithDraggableProps = {
  getDragPayload: () => DragPayload;
  /** Optional CSS selector inside children to use as custom drag preview */
  dragImageSelector?: string;
  effectAllowed?:
    | "none"
    | "copy"
    | "copyLink"
    | "copyMove"
    | "link"
    | "linkMove"
    | "move"
    | "all";
  className?: string;
  suppressHighlight?: boolean;
  children: React.ReactNode;
};

function WithDraggable({
  getDragPayload,
  dragImageSelector,
  effectAllowed = "copyMove",
  suppressHighlight = false,
  className,
  children,
}: WithDraggableProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent) => {
    const payload = getDragPayload();
    e.dataTransfer.effectAllowed = effectAllowed;
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    // Highlight
    if (suppressHighlight) {
      e.dataTransfer.setData(NOHL, "1");
    }
    // Image preview
    if (dragImageSelector && ref.current) {
      const element = ref.current.querySelector(
        dragImageSelector,
      ) as HTMLElement | null;
      if (element) e.dataTransfer.setDragImage(element, 0, 0);
    }
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={onDragStart}
      className={className}
      role="listitem"
      tabIndex={0}
      aria-roledescription="Draggable item"
      aria-label="Grab item"
      aria-live="polite"
    >
      {children}
    </div>
  );
}

export default memo(WithDraggable);
