import { useCallback, useRef, useState } from "react";
import { rectEdges, dedupeSorted } from "@/utils/helpers/alignmentGuides";
import { Guides, PageSize, Rect } from "@/interfaces";

type Options = {
  threshold?: number;
  snap?: boolean;
  maxGuidesPerAxis?: number;
};

const DEFAULTS: Required<Options> = {
  threshold: 6,
  snap: true,
  maxGuidesPerAxis: 3,
};

type Candidates = { x: number[]; y: number[] };

function buildCandidates(
  currentId: string,
  allRects: Rect[],
  page: PageSize,
): Candidates {
  const xs: number[] = [];
  const ys: number[] = [];

  // Includes page center
  xs.push(page.width / 2);
  ys.push(page.height / 2);

  for (const r of allRects) {
    if (r.id === currentId) continue;
    const e = rectEdges(r);
    xs.push(e.l, e.r);
    ys.push(e.t, e.b);
    // includes centers
    xs.push(e.cx);
    ys.push(e.cy);
  }
  xs.sort((a, b) => a - b);
  ys.sort((a, b) => a - b);
  return { x: dedupeSorted(xs), y: dedupeSorted(ys) };
}

export function useAlignmentGuides(options?: Options) {
  const candidatesRef = useRef<Candidates>({ x: [], y: [] });
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<Rect | null>(null);

  const [guides, setGuides] = useState<Guides>({ x: [], y: [] });
  const [snapped, setSnapped] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  const onDragStartAlign = useCallback(
    (currentId: string, allRects: Rect[], page: PageSize) => {
      candidatesRef.current = buildCandidates(currentId, allRects, page);
      setGuides({ x: [], y: [] });
    },
    [],
  );

  const compute = useCallback(
    (rect: Rect) => {
      const { threshold, snap, maxGuidesPerAxis } = {
        ...DEFAULTS,
        ...(options || {}),
      };
      const { x: candX, y: candY } = candidatesRef.current;
      const e = rectEdges(rect);

      const activeX: number[] = [];
      const activeY: number[] = [];

      let nextLeft = rect.left;
      let nextTop = rect.top;

      const findNearest = (target: number, arr: number[]) => {
        let best = Number.POSITIVE_INFINITY;
        let val: number | undefined = undefined;
        // linear scan
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

      // X snapping (L/C/R)
      const tx = [e.l, e.cx, e.r];
      let bestDX = 0,
        bestXVal: number | undefined;
      for (const t of tx) {
        const v = findNearest(t, candX);
        if (v !== undefined) {
          activeX.push(v);
          const dx = v - t;
          if (bestXVal === undefined || Math.abs(dx) < Math.abs(bestDX)) {
            bestDX = dx;
            bestXVal = v;
          }
        }
      }
      if (snap && bestXVal !== undefined) nextLeft = rect.left + bestDX;

      // Y snapping (T/C/B)
      const ty = [e.t, e.cy, e.b];
      let bestDY = 0,
        bestYVal: number | undefined;
      for (const t of ty) {
        const v = findNearest(t, candY);
        if (v !== undefined) {
          activeY.push(v);
          const dy = v - t;
          if (bestYVal === undefined || Math.abs(dy) < Math.abs(bestDY)) {
            bestDY = dy;
            bestYVal = v;
          }
        }
      }
      if (snap && bestYVal !== undefined) nextTop = rect.top + bestDY;

      const gx = dedupeSorted(activeX).slice(0, maxGuidesPerAxis);
      const gy = dedupeSorted(activeY).slice(0, maxGuidesPerAxis);

      setGuides({ x: gx, y: gy });
      setSnapped({ left: nextLeft, top: nextTop });
    },
    [options],
  );

  const schedule = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const p = pendingRef.current;
      if (p) compute(p);
    });
  }, [compute]);

  const onDragMoveAlign = useCallback(
    (nextRect: Rect) => {
      pendingRef.current = nextRect;
      schedule();
    },
    [schedule],
  );

  const onDragEndAlign = useCallback(() => {
    pendingRef.current = null;
    setGuides({ x: [], y: [] });
  }, []);

  return {
    guides,
    snappedLeft: snapped.left,
    snappedTop: snapped.top,
    onDragStartAlign,
    onDragMoveAlign,
    onDragEndAlign,
  };
}
