import { NodeId, OverlayId } from "@/interfaces/common";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

/**
 * Lightweight floating tooltip positioning without external libs.
 * - Positions relative to a trigger's DOMRect
 * - Auto flips to keep in viewport
 * - Supports placement + alignment + offset
 * - Updates on resize/scroll/content changes
 */

export interface FloatingOptions {
  offset?: number; // gap in px between trigger and tooltip
  stopTop?: number; // min distance from viewport edges
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// watch dragging of a specific element id using native drag events
export function watchDragById(
  id: NodeId | OverlayId,
  onChange: (dragging: boolean, ev: DragEvent) => void,
) {
  const el = document.getElementById(id);
  if (!el) return () => {};

  el.setAttribute("draggable", "true");

  const onStart = (e: DragEvent) => onChange(true, e);
  const onEnd = (e: DragEvent) => onChange(false, e);

  el.addEventListener("dragstart", onStart);
  el.addEventListener("dragend", onEnd);

  // optional: if you want to know where it’s being dragged over
  // document.addEventListener("dragover", (e) => {/* ... */});

  return () => {
    el.removeEventListener("dragstart", onStart);
    el.removeEventListener("dragend", onEnd);
  };
}

function getScrollParents(node: Element | null): (Element | Window)[] {
  if (!node) return [window];
  const parents: (Element | Window)[] = [];
  let parent: Element | null = node.parentElement;
  const overflowRegex = /(auto|scroll|overlay)/;
  while (parent) {
    const style = getComputedStyle(parent);
    if (
      overflowRegex.test(style.overflow + style.overflowY + style.overflowX)
    ) {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  parents.push(window);
  return parents;
}

// Hook: element rect observer (ResizeObserver + rAF)
function useRect(open: boolean, elRef: React.RefObject<Element | null>) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el || !open) return;

    let raf = 0;
    const update = () => {
      raf = requestAnimationFrame(() => {
        setRect(el.getBoundingClientRect());
      });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    // Update on fonts/images layout shifts
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: true, attributes: true });

    const scrollParents = getScrollParents(el);
    scrollParents.forEach((p) =>
      p.addEventListener("scroll", update, { passive: true }),
    );
    window.addEventListener("resize", update, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      scrollParents.forEach((p) => p.removeEventListener("scroll", update));
      window.removeEventListener("resize", update);
    };
  }, [elRef, open]);

  return rect;
}

export function computePosition(
  triggerRect: DOMRect,
  floatingSize: { width: number; height: number },
  opts: FloatingOptions = {},
): { top: number; left: number } {
  const { offset = 8, stopTop = 130 } = opts;

  const vp = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };

  // Always position above, centered horizontally
  const rawTop = triggerRect.top - offset - floatingSize.height;
  const rawLeft =
    triggerRect.left + (triggerRect.width - floatingSize.width) / 2;

  // Clamp: top cannot cross the stopTop line; bottom cannot go outside viewport
  const top = clamp(rawTop, stopTop, vp.height - floatingSize.height);

  // Clamp left fully within viewport
  const left = clamp(rawLeft, 0, vp.width - floatingSize.width);

  return { top: Math.round(top), left: Math.round(left) };
}

export function useFloating(
  triggerRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  options?: FloatingOptions,
) {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const triggerRect = useRect(open, triggerRef);
  const [style, setStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const update = useCallback(() => {
    if (!open) return;
    const element = floatingRef.current;

    if (!element || !triggerRect) return;

    // Measure floating content
    const { width, height } = element.getBoundingClientRect();

    const padTop = Math.ceil(
      document.querySelector<HTMLElement>("nav")?.getBoundingClientRect()
        .height ?? 130,
    );

    const { top, left } = computePosition(
      triggerRect,
      { width, height },
      {
        offset: options?.offset ?? 8,
        stopTop: padTop + 90,
      },
    );

    setStyle({
      top,
      left,
    });

    // Don't pass options object in deps here - will cause infinite re-render
  }, [open, triggerRect, options?.offset]);

  // Update on open + rect changes + content resize
  useLayoutEffect(() => {
    if (!open) return;
    update();

    const el = floatingRef.current;
    if (!el) return;

    const ro = new ResizeObserver(update);
    ro.observe(el);

    const parents = triggerRef.current
      ? getScrollParents(triggerRef.current)
      : [window];
    parents.forEach((p) =>
      p.addEventListener("scroll", update, { passive: true }),
    );
    window.addEventListener("resize", update, { passive: true });

    return () => {
      ro.disconnect();
      parents.forEach((p) => p.removeEventListener("scroll", update));
      window.removeEventListener("resize", update);
    };
  }, [open, update, triggerRef]);

  return { floatingRef, style, update } as const;
}

// Portal root
function usePortalRoot(id = "portal-root") {
  const elRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let root = document.getElementById(id) as HTMLElement | null;
    if (!root) {
      root = document.createElement("div");
      root.id = id;
      document.body.appendChild(root);
    }
    elRef.current = root;
  }, [id]);
  return elRef.current;
}

export default function ActionsTooltipPortalWrapper({
  nodeId,
  open,
  anchorRef,
  offset = 20,
  children,
  onMouseEnter,
  onMouseLeave,
}: React.PropsWithChildren<{
  nodeId?: NodeId | OverlayId;
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  offset?: number;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
}>) {
  const root = usePortalRoot();
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [noTransition, setNoTransition] = React.useState(true); // disable transition on first paint
  const [dragging, setDragging] = React.useState(false);

  const { floatingRef, style, update } = useFloating(anchorRef, mounted, {
    offset,
  });

  React.useEffect(() => {
    console.log(">>>>SSS", open && !dragging);
    if (open && !dragging) {
      // Use setTimeout to not race the else statement
      setTimeout(() => {
        setMounted(true);
        setVisible(false);
        setNoTransition(true); // disable transition for the position set
      }, 120);
    } else {
      // Give time to the buttons to be clicked and fire
      setTimeout(() => {
        setVisible(false);
        setMounted(false);
      }, 100);
    }
  }, [open, dragging]);

  // Measure + position before paint, then show
  React.useLayoutEffect(() => {
    if (!mounted) return;
    const el = floatingRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor) return;

    // force a fresh measure (width/height may have changed)
    update?.();

    // after coords are set by useFloating (layout phase), enable fade-in next frame
    const id = requestAnimationFrame(() => {
      setNoTransition(false);
      setVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, [mounted, anchorRef, floatingRef, update, offset]);

  // Drag watcher
  React.useEffect(() => {
    if (!nodeId) return;
    const stop = watchDragById(nodeId, (isDragging) => setDragging(isDragging));
    return stop;
  }, [nodeId]);

  // Unmount when fully hidden
  const onTransitionEnd = React.useCallback(() => {
    if (!visible) setMounted(false);
  }, [visible]);

  if (!root || !mounted || !anchorRef.current) return null;

  return createPortal(
    <div
      ref={floatingRef}
      style={{
        position: "fixed",
        // If style is not ready yet (first layout), keep it far offscreen
        top: style ? style.top : -10000,
        left: style ? style.left : -10000,
        transformOrigin: "bottom center",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        zIndex: 60000,
        transition: noTransition ? "none" : "opacity 120ms ease-out",
      }}
      className="pointer-events-auto relative"
      onTransitionEnd={onTransitionEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="tooltip"
    >
      {children}
      <span className="sr-only">tooltip</span>
    </div>,
    root,
  );
}
