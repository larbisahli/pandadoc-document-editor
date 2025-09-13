import { DropPayload } from "@/interfaces/dnd";
import React, { memo } from "react";
import { PALETTE_DATA_FORMAT } from ".";

type WithDraggableProps = {
  getDragPayload: () => DropPayload;
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
  children: React.ReactNode;
  handleOnDragStart: (e: React.DragEvent) => void;
  handleOnDragEnd: (e: React.DragEvent) => void;
};

function WithDraggable({
  getDragPayload,
  dragImageSelector,
  effectAllowed = "copyMove",
  handleOnDragStart,
  handleOnDragEnd,
  className,
  children,
}: WithDraggableProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent) => {
    handleOnDragStart(e);

    const payload = getDragPayload();
    e.dataTransfer.effectAllowed = effectAllowed;
    e.dataTransfer.setData(PALETTE_DATA_FORMAT, JSON.stringify(payload));

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
      onDragEnd={handleOnDragEnd}
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
