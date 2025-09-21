import { DropPayload } from "@/interfaces/dnd";
import React, { memo, useRef } from "react";
import { PALETTE_DATA_FORMAT } from ".";
import { TemplateTypes } from "@/interfaces/enum";

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
  kind: TemplateTypes;
  children: React.ReactNode;
  handleOnDragStart: (e: React.DragEvent) => void;
  handleOnDragEnd: (e: React.DragEvent) => void;
};

const TRANSPARENT_IMG = (() => {
  const i = new Image();
  i.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y6vYf8AAAAASUVORK5CYII=";
  return i;
})();

// Check if pointer inside page bounds
function isInsidePage(x: number, y: number): boolean {
  const el = document.getElementById("document-canvas") as HTMLElement | null;
  if (!el) return false;
  if (x === 0 && y === 0) return false;
  const hit = document.elementFromPoint(x, y);
  return !!hit && (hit === el || el.contains(hit));
}

function WithDraggable({
  getDragPayload,
  dragImageSelector,
  effectAllowed = "copyMove",
  handleOnDragStart,
  handleOnDragEnd,
  className,
  kind,
  children,
}: WithDraggableProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const insideRef = useRef<boolean | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastRef = useRef<{ x: number; y: number; inside: boolean | null }>({
    x: -1,
    y: -1,
    inside: null,
  });

  const onDragStart = (e: React.DragEvent) => {
    handleOnDragStart(e);

    // Add Global indicator for dragging type
    document.body.setAttribute("data-drag-kind", kind);

    const payload = getDragPayload();
    e.dataTransfer.effectAllowed = effectAllowed;
    e.dataTransfer.setData(PALETTE_DATA_FORMAT, JSON.stringify(payload));

    if (!e.dataTransfer || !ref.current || !dragImageSelector) return;

    const root = ref.current;
    const src = (
      root.matches?.(dragImageSelector)
        ? root
        : root.querySelector(dragImageSelector)
    ) as HTMLElement | null;
    if (!src) return;

    const r = src.getBoundingClientRect();
    const ox = e.clientX ? e.clientX - r.left : r.width / 2;
    const oy = e.clientY ? e.clientY - r.top : r.height / 2;
    offsetRef.current = { x: ox, y: oy };

    // Create custom ghost
    const ghost = src.cloneNode(true) as HTMLElement;
    Object.assign(ghost.style, {
      position: "fixed",
      top: "0",
      left: "0",
      transform: `translate(${(e.clientX || 0) - ox}px, ${(e.clientY || 0) - oy}px) scale(0.9)`,
      pointerEvents: "none",
      zIndex: "2147483647",
      opacity: "0.95",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      transformOrigin: "top left",
      borderRadius: "2px",
    } as CSSStyleDeclaration);
    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    // Hide native ghost
    e.dataTransfer.setDragImage(TRANSPARENT_IMG, 0, 0);

    // Initial position (top-left at cursor)
    ghost.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(0.9)`;
  };

  const onDrag = (e: React.DragEvent) => {
    if (!ghostRef.current || kind === TemplateTypes.Block) return;

    const x = e.clientX,
      y = e.clientY;
    if (x === 0 && y === 0) return;

    // Store latest pointer and render once per frame
    pendingRef.current = { x, y };
    if (rafIdRef.current != null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const ghost = ghostRef.current;
      if (!ghost) return;

      const { x, y } = pendingRef.current;

      // move ghost (only if changed)
      if (x !== lastRef.current.x || y !== lastRef.current.y) {
        ghost.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.9)`;
        lastRef.current.x = x;
        lastRef.current.y = y;
      }

      // Color by inside/outside (only if changed)
      const inside = isInsidePage(x, y);
      if (inside !== lastRef.current.inside) {
        lastRef.current.inside = inside;
        if (inside) {
          ghost.style.outline = "1px solid #22c55e";
          ghost.style.background = "#22c55e";
        } else {
          ghost.style.outline = "1px solid transparent";
          ghost.style.background = "transparent";
        }
      }
    });
  };

  const onDragEnd = (e: React.DragEvent) => {
    ghostRef.current?.remove();
    ghostRef.current = null;
    insideRef.current = null;
    handleOnDragEnd(e);
    // Remove Global indicator for dragging type
    document.body.removeAttribute("data-drag-kind");
  };

  return (
    <div
      ref={ref}
      draggable
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
