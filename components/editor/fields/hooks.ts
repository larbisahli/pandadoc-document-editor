import * as React from "react";

type Point = { x: number; y: number };

type UseOverlayDragOpts = {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  position: Point; // current absolute pos (px)
  onCommit: (pos: Point) => void; // called once on release
  scale?: number; // canvas zoom (default 1)
};

export function useOverlayDrag({
  overlayRef,
  containerRef,
  position,
  onCommit,
  scale = 1,
}: UseOverlayDragOpts) {
  const start = React.useRef({
    pos: { x: 0, y: 0 },
    pointer: { x: 0, y: 0 },
    scroll: { x: 0, y: 0 },
  });

  const rafId = React.useRef(0);
  const delta = React.useRef<Point>({ x: 0, y: 0 });

  const flush = React.useCallback(() => {
    rafId.current = 0;
    const el = overlayRef.current;
    if (!el) return;
    // Only transform during drag (no layout)
    el.style.transform = `translate3d(${delta.current.x}px, ${delta.current.y}px, 0)`;
  }, [overlayRef]);

  const schedule = React.useCallback(() => {
    if (!rafId.current) rafId.current = requestAnimationFrame(flush);
  }, [flush]);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      const el = overlayRef.current;
      const container = containerRef.current;
      if (!el || !container) return;

      el.setPointerCapture(e.pointerId);

      start.current.pos = { ...position };
      start.current.pointer = { x: e.clientX, y: e.clientY };
      start.current.scroll = {
        x: container.scrollLeft,
        y: container.scrollTop,
      };

      // Perf hints
      el.style.willChange = "transform, opacity";
      container.style.contain = "layout style";

      // Hide the original while dragging (ghost/preview is transform)
      el.style.opacity = "0";
    },
    [overlayRef, containerRef, position],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      const el = overlayRef.current;
      const container = containerRef.current;
      if (!el || !container) return;
      if (!el.hasPointerCapture(e.pointerId)) return;

      // movement + container scrolling during drag
      const dxClient = e.clientX - start.current.pointer.x;
      const dyClient = e.clientY - start.current.pointer.y;
      const dScrollX = container.scrollLeft - start.current.scroll.x;
      const dScrollY = container.scrollTop - start.current.scroll.y;

      delta.current.x = (dxClient + dScrollX) / scale;
      delta.current.y = (dyClient + dScrollY) / scale;

      schedule();
    },
    [overlayRef, containerRef, scale, schedule],
  );

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      const el = overlayRef.current;
      const container = containerRef.current;
      if (!el || !container) return;

      if (el.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
      if (rafId.current)
        (cancelAnimationFrame(rafId.current), (rafId.current = 0));

      // Final absolute position
      const finalPos = {
        x: start.current.pos.x + delta.current.x,
        y: start.current.pos.y + delta.current.y,
      };

      // Commit visually: clear transform, set left/top, restore opacity
      el.style.transform = "";
      el.style.left = `${finalPos.x}px`;
      el.style.top = `${finalPos.y}px`;
      el.style.opacity = ""; // back to normal

      // Cleanup perf hints
      el.style.willChange = "";
      container.style.contain = "";

      // Notify app state (Redux, etc.)
      onCommit(finalPos);

      // reset delta for the next drag
      delta.current = { x: 0, y: 0 };
    },
    [overlayRef, containerRef, onCommit],
  );

  return { onPointerDown, onPointerMove, onPointerUp };
}
