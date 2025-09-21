import { PageSize, Rect } from "@/interfaces";

export function getPageSize(pageId: string): PageSize {
  const el = document.getElementById(pageId);
  if (!el) return { width: 0, height: 0 };
  return { width: el.clientWidth, height: el.clientHeight };
}

export function getCurrentRect(
  overlayId: string,
  pageId: string,
  scale = 1,
): Rect | null {
  const pageBox = document.getElementById(pageId)?.getBoundingClientRect();
  const el = document.getElementById(overlayId);
  if (!pageBox || !el) return null;
  const r = el.getBoundingClientRect();
  return {
    id: overlayId,
    left: (r.left - pageBox.left) / scale,
    top: (r.top - pageBox.top) / scale,
    width: r.width / scale,
    height: r.height / scale,
  };
}

export function collectRectsByIds(
  ids: string[],
  pageId: string,
  scale = 1,
): Rect[] {
  const pageBox = document.getElementById(pageId)?.getBoundingClientRect();
  if (!pageBox) return [];
  const out: Rect[] = [];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    out.push({
      id,
      left: (r.left - pageBox.left) / scale,
      top: (r.top - pageBox.top) / scale,
      width: r.width / scale,
      height: r.height / scale,
    });
  }
  return out;
}

export function rectEdges(rect: Rect) {
  const l = rect.left;
  const t = rect.top;
  const r = rect.left + rect.width;
  const b = rect.top + rect.height;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return { l, t, r, b, cx, cy };
}

const EPS = 0.0001;
export function dedupeSorted(values: number[]) {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i === 0 || Math.abs(values[i] - values[i - 1]) > EPS)
      out.push(values[i]);
  }
  return out;
}

function getRectRelativeToSurface(
  el: HTMLElement,
  surfaceBox: DOMRect,
  scale: number,
): Rect {
  const rect = el.getBoundingClientRect();
  return {
    id: el.id,
    left: (rect.left - surfaceBox.left) / (scale || 1),
    top: (rect.top - surfaceBox.top) / (scale || 1),
    width: rect.width / (scale || 1),
    height: rect.height / (scale || 1),
  };
}

function collectOtherRects(
  surfaceEl: HTMLElement,
  excludeId: string,
  scale: number,
): Rect[] {
  const box = surfaceEl.getBoundingClientRect();
  const out: Rect[] = [];
  const nodes = surfaceEl.children;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i] as HTMLElement;
    if (!node || node.id === excludeId) continue;
    out.push(getRectRelativeToSurface(node, box, scale));
  }
  return out;
}

export function snapFinalPosition(
  surfaceEl: HTMLElement,
  currentId: string,
  tentativeLeft: number,
  tentativeTop: number,
  scale: number,
  threshold = 6,
) {
  const surfaceBox = surfaceEl.getBoundingClientRect();
  const curEl = document.getElementById(currentId) as HTMLElement | null;
  if (!curEl) return { left: tentativeLeft, top: tentativeTop };

  // Current rect uses tentative left/top but live width/height
  const live = getRectRelativeToSurface(curEl, surfaceBox, scale);
  const current: Rect = { ...live, left: tentativeLeft, top: tentativeTop };

  // Build candidates: page center + other rect edges/centers
  const xs: number[] = [];
  const ys: number[] = [];
  // Include center
  xs.push(surfaceEl.clientWidth / (scale || 1) / 2);
  ys.push(surfaceEl.clientHeight / (scale || 1) / 2);

  const others = collectOtherRects(surfaceEl, currentId, scale);
  for (const r of others) {
    const e = rectEdges(r);
    xs.push(e.l, e.r);
    ys.push(e.t, e.b);
    // Include centers
    xs.push(e.cx);
    ys.push(e.cy);
  }
  xs.sort((a, b) => a - b);
  ys.sort((a, b) => a - b);

  const e = rectEdges(current);
  let snappedLeft = tentativeLeft;
  let snappedTop = tentativeTop;

  // find nearest within threshold
  const nearest = (target: number, arr: number[]) => {
    let best = Infinity;
    let val: number | undefined;
    for (let i = 0; i < arr.length; i++) {
      const d = Math.abs(arr[i] - target);
      if (d < best) {
        best = d;
        val = arr[i];
        if (best === 0) break;
      }
    }
    return best <= threshold ? val : undefined;
  };

  // X (L/C/R)
  const targetsX = [e.l, e.cx, e.r];
  let bestDX = 0;
  let bestFoundX: number | undefined;
  for (const tx of targetsX) {
    const v = nearest(tx, xs);
    if (v !== undefined) {
      const dx = v - tx;
      if (bestFoundX === undefined || Math.abs(dx) < Math.abs(bestDX)) {
        bestDX = dx;
        bestFoundX = v;
      }
    }
  }
  if (bestFoundX !== undefined) snappedLeft = tentativeLeft + bestDX;

  // Y (T/M/B)
  const targetsY = [e.t, e.cy, e.b];
  let bestDY = 0,
    bestFoundY: number | undefined;
  for (const ty of targetsY) {
    const v = nearest(ty, ys);
    if (v !== undefined) {
      const dy = v - ty;
      if (bestFoundY === undefined || Math.abs(dy) < Math.abs(bestDY)) {
        bestDY = dy;
        bestFoundY = v;
      }
    }
  }
  if (bestFoundY !== undefined) snappedTop = tentativeTop + bestDY;

  return { left: snappedLeft, top: snappedTop };
}
