import { Point } from "../DraggableOverlay";

export const browserZoomLevel =
  typeof window !== "undefined" ? (window.visualViewport?.scale ?? 1) : 1;

/** Create a fixed-position clone as drag image. */
export function makeDragImageFrom(
  source: HTMLElement,
  scale = 1,
  opacity = 0.85,
) {
  const rect = source.getBoundingClientRect();
  const ghost = source.cloneNode(true) as HTMLElement;

  ghost.removeAttribute("id");
  ghost.style.pointerEvents = "none";
  Object.assign(ghost.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `translate(${rect.left}px, ${rect.top}px) scale(${1 / scale})`,
    transformOrigin: "top left",
    opacity: String(opacity),
    filter: "drop-shadow(0 6px 16px rgba(0,0,0,.25))",
    zIndex: "999999",
  } as CSSStyleDeclaration);

  document.body.appendChild(ghost);

  return {
    element: ghost,
    /** Position ghost so pointer stays aligned to the same spot in the box. */
    updateAt(
      clientX: number,
      clientY: number,
      offsetX: number,
      offsetY: number,
    ) {
      ghost.style.transform = `translate(${clientX - offsetX}px, ${clientY - offsetY}px) scale(${1 / scale})`;
    },
    destroy() {
      ghost.remove();
    },
    rect,
  };
}

export function clientToCanvas(
  surfaceEl: HTMLElement,
  clientX: number,
  clientY: number,
  scale = 1,
): Point {
  const r = surfaceEl.getBoundingClientRect();
  // Position inside the visible surface
  const xInView = clientX - r.left;
  const yInView = clientY - r.top;
  // Add scroll to get content coords, then unscale
  const offsetX = (xInView + surfaceEl.scrollLeft) / scale;
  const offsetY = (yInView + surfaceEl.scrollTop) / scale;
  return { offsetX, offsetY };
}

export const num = (value: unknown, f = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : f;
};

export const clamp = (value: number, low?: number, high?: number) =>
  Math.max(low ?? -Infinity, Math.min(high ?? Infinity, value));

/** Compute page content geometry & origin in DEVICE px, plus content size in CONTENT coords */
export function getPageMetrics(pageElement: HTMLElement, zoom: number) {
  const computedStyle = getComputedStyle(pageElement);
  const padL = num(computedStyle.paddingLeft);
  const padR = num(computedStyle.paddingRight);
  const padT = num(computedStyle.paddingTop);
  const padB = num(computedStyle.paddingBottom);

  const rect = pageElement.getBoundingClientRect();

  // Content box origin
  const originLeftDev = rect.left + pageElement.clientLeft + padL;
  const originTopDev = rect.top + pageElement.clientTop + padT;

  // Inner content size
  const innerWDev = pageElement.clientWidth - padL - padR;
  const innerHDev = pageElement.clientHeight - padT - padB;

  const contentW = num(innerWDev, 0) / (zoom > 0 ? zoom : 1);
  const contentH = num(innerHDev, 0) / (zoom > 0 ? zoom : 1);

  return { originLeftDev, originTopDev, contentW, contentH };
}
