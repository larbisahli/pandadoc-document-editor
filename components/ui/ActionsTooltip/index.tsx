import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
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

// Types
export type Placement = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export interface UseFloatingOptions {
  placement?: Placement; // preferred side
  align?: Align; // alignment along the cross-axis
  offset?: number; // gap in px between trigger and tooltip
  boundaryPadding?: number; // min distance from viewport edges
  sameWidth?: boolean; // match trigger width (popovers)
}

export interface FloatingStyle {
  position: "absolute" | "fixed";
  top: number;
  left: number;
  minWidth?: number;
  transformOrigin?: string;
}

// Utils
const getViewport = () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
});

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

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
function useRect(elRef: React.RefObject<Element | null>) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

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
      scrollParents.forEach((p) =>
        p.removeEventListener("scroll", update as any),
      );
      window.removeEventListener("resize", update as any);
    };
  }, [elRef]);

  return rect;
}

// Core positioning
function computePosition(
  triggerRect: DOMRect,
  floatingSize: { width: number; height: number },
  opts: Required<UseFloatingOptions>,
): {
  top: number;
  left: number;
  placement: Placement;
  transformOrigin: string;
  minWidth?: number;
} {
  const { placement, align, offset, boundaryPadding, sameWidth } = opts;
  const vp = getViewport();

  // Try preferred placement first, flip if it overflows
  const placements: Placement[] = [
    placement,
    ...(placement === "top" || placement === "bottom"
      ? ["left", "right", placement === "top" ? "bottom" : "top"]
      : ["top", "bottom", placement === "left" ? "right" : "left"]),
  ];

  function calc(p: Placement) {
    let top = 0,
      left = 0;
    switch (p) {
      case "top":
        top = triggerRect.top - offset - floatingSize.height;
        break;
      case "bottom":
        top = triggerRect.bottom + offset;
        break;
      case "left":
        left = triggerRect.left - offset - floatingSize.width;
        break;
      case "right":
        left = triggerRect.right + offset;
        break;
    }

    if (p === "top" || p === "bottom") {
      // horizontal alignment
      if (align === "start") left = triggerRect.left;
      if (align === "center")
        left = triggerRect.left + (triggerRect.width - floatingSize.width) / 2;
      if (align === "end") left = triggerRect.right - floatingSize.width;
    } else {
      // vertical alignment
      if (align === "start") top = triggerRect.top;
      if (align === "center")
        top = triggerRect.top + (triggerRect.height - floatingSize.height) / 2;
      if (align === "end") top = triggerRect.bottom - floatingSize.height;
    }

    // Defaults if not set above
    if (left === 0 && (p === "top" || p === "bottom")) left = triggerRect.left;
    if (top === 0 && (p === "left" || p === "right")) top = triggerRect.top;

    const transformOrigin = (
      p === "top"
        ? `bottom ${align}`
        : p === "bottom"
          ? `top ${align}`
          : p === "left"
            ? `${align} right`
            : ` ${align} left`
    ).replace("center", "center");

    // Boundaries + minimal padding
    const clampedTop = clamp(
      top,
      boundaryPadding,
      vp.height - floatingSize.height - boundaryPadding,
    );
    const clampedLeft = clamp(
      left,
      boundaryPadding,
      vp.width - floatingSize.width - boundaryPadding,
    );

    const overflow = {
      top: top < boundaryPadding,
      bottom: top + floatingSize.height > vp.height - boundaryPadding,
      left: left < boundaryPadding,
      right: left + floatingSize.width > vp.width - boundaryPadding,
    };

    return { top: clampedTop, left: clampedLeft, overflow, p, transformOrigin };
  }

  let best = calc(placements[0]);
  // Flip logic: choose first placement with no overflow; fallback to least-overflowing
  for (const p of placements) {
    const candidate = calc(p);
    const noOverflow =
      !candidate.overflow.top &&
      !candidate.overflow.bottom &&
      !candidate.overflow.left &&
      !candidate.overflow.right;
    if (noOverflow) {
      best = candidate;
      break;
    }
    // pick the one with fewer overflow sides as soft-heuristic
    const bestCount = Object.values(best.overflow).filter(Boolean).length;
    const candCount = Object.values(candidate.overflow).filter(Boolean).length;
    if (candCount < bestCount) best = candidate;
  }

  return {
    top: Math.round(best.top),
    left: Math.round(best.left),
    placement: best.p,
    transformOrigin: best.transformOrigin,
    minWidth: sameWidth ? Math.round(triggerRect.width) : undefined,
  };
}

export function useFloating(
  triggerRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  options?: UseFloatingOptions,
) {
  const opts: Required<UseFloatingOptions> = {
    placement: options?.placement ?? "top",
    align: options?.align ?? "center",
    offset: options?.offset ?? 8,
    boundaryPadding: options?.boundaryPadding ?? 8,
    sameWidth: options?.sameWidth ?? false,
  };

  const floatingRef = useRef<HTMLDivElement | null>(null);
  const triggerRect = useRect(triggerRef as any);
  const [style, setStyle] = useState<FloatingStyle | null>(null);

  const update = useCallback(() => {
    if (!open) return;
    const el = floatingRef.current;
    const tr = triggerRect;
    if (!el || !tr) return;

    // Measure floating content
    const { width, height } = el.getBoundingClientRect();
    const { top, left, transformOrigin, minWidth } = computePosition(
      tr,
      { width, height },
      opts,
    );

    setStyle({ position: "fixed", top, left, transformOrigin, minWidth });
  }, [
    open,
    triggerRect,
    opts.placement,
    opts.align,
    opts.offset,
    opts.boundaryPadding,
    opts.sameWidth,
  ]);

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
      parents.forEach((p) => p.removeEventListener("scroll", update as any));
      window.removeEventListener("resize", update as any);
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

// Tooltip component
export function Tooltip({
  open,
  anchorRef,
  placement = "top",
  align = "center",
  offset = 8,
  boundaryPadding = 8,
  sameWidth = false,
  children,
  onMouseEnter,
  onMouseLeave,
}: React.PropsWithChildren<{
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  placement?: Placement;
  align?: Align;
  offset?: number;
  boundaryPadding?: number;
  sameWidth?: boolean;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
}>) {
  const root = usePortalRoot();
  const { floatingRef, style } = useFloating(anchorRef, open, {
    placement,
    align,
    offset,
    boundaryPadding,
    sameWidth,
  });

  if (!root || !open) return null;

  return createPortal(
    <div
      ref={floatingRef}
      style={{
        position: style?.position,
        top: style?.top,
        left: style?.left,
        minWidth: style?.minWidth,
        transformOrigin: style?.transformOrigin,
        zIndex: 60_000,
      }}
      className="pointer-events-auto rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm shadow-lg transition-opacity duration-100 will-change-transform"
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

// Example usage
export default function Example() {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-16">
      <button
        ref={btnRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
      >
        Hover me
      </button>

      <Tooltip
        open={open}
        anchorRef={btnRef}
        placement="top"
        align="center"
        offset={10}
      >
        Hello from a portal tooltip ✨
      </Tooltip>
    </div>
  );
}
