import { Point } from "../DraggableOverlay";

export const browserZoomLevel = window?.visualViewport?.scale ?? 1;

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
    el: ghost,
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
  // position inside the visible surface
  const xInView = clientX - r.left;
  const yInView = clientY - r.top;
  // add scroll to get content coords, then unscale
  const offsetX = (xInView + surfaceEl.scrollLeft) / scale;
  const offsetY = (yInView + surfaceEl.scrollTop) / scale;
  return { offsetX, offsetY };
}
