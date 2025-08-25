import { memo, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import RowResizer from "./RowResizer";
import {
  selectRowItemLayoutStyle,
  updateLayoutCalculatedWidth,
} from "@/lib/features/layout/layoutSlice";
import { usePage } from "../context/PageContext";
import { NodeId } from "@/interfaces/common";

type Props = {
  rowRootId: string;
  nodeIds: string[];
  index: number;
};

// minimum row width percentage
const MIN_PCT = 15;

function clampPairPercent(
  leftBasePct: number,
  rightBasePct: number,
  dPct: number, // left gains dPct, right loses dPct
  minPct: number,
) {
  let L = Math.max(minPct, leftBasePct + dPct);
  let R = Math.max(minPct, rightBasePct - dPct);

  const cap = Math.max(0, leftBasePct + rightBasePct);
  const pairNow = L + R;
  if (pairNow > cap && pairNow > 0) {
    const s = cap / pairNow;
    L = Math.max(minPct, L * s);
    R = Math.max(minPct, R * s);
  }
  return { L, R };
}

function RowResizerWrapper({ rowRootId, nodeIds, index }: Props) {
  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  // the two panes controlled by this resizer
  const leftId = nodeIds[index] as NodeId;
  const rightId = nodeIds[index + 1] as NodeId;

  // base % widths from store (source of truth)
  const leftBasePct = useAppSelector((s) =>
    parseFloat(selectRowItemLayoutStyle(s, pageId, leftId)?.width || "0"),
  );
  const rightBasePct = useAppSelector((s) =>
    parseFloat(selectRowItemLayoutStyle(s, pageId, rightId)?.width || "0"),
  );

  // one drag session cache to avoid re‑measuring per move
  const sessionRef = useRef<{
    rowEl: HTMLDivElement | null;
    rowWidth: number;
    leftEl: HTMLDivElement | null;
    rightEl: HTMLDivElement | null;
    rafId: number;
    lastDeltaPx: number;
  } | null>(null);

  const ensureSession = useCallback(() => {
    let s = sessionRef.current;
    if (s) return s;

    const rowEl = document.getElementById(rowRootId) as HTMLDivElement | null;
    const leftEl = document.getElementById(leftId) as HTMLDivElement | null;
    const rightEl = document.getElementById(rightId) as HTMLDivElement | null;
    const rowWidth = rowEl?.clientWidth ?? 0;

    sessionRef.current = s = {
      rowEl,
      rowWidth,
      leftEl,
      rightEl,
      rafId: 0,
      lastDeltaPx: 0,
    };

    // small perf hint: isolate row during drag to reduce layout scope
    if (rowEl) rowEl.style.contain = "layout style";

    return s;
  }, [rowRootId, leftId, rightId]);

  // rAF-applied frame writer (mutates only two styles)
  const applyFrame = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    s.rafId = 0;

    if (!s.rowWidth || !s.leftEl || !s.rightEl) return;

    const dPct = (s.lastDeltaPx / s.rowWidth) * 100;
    const { L, R } = clampPairPercent(leftBasePct, rightBasePct, dPct, MIN_PCT);

    // write only what’s needed; keep them fixed during drag
    s.leftEl.style.width = `${L.toFixed(2)}%`;
    s.rightEl.style.width = `${R.toFixed(2)}%`;
  }, [leftBasePct, rightBasePct]);

  const schedule = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    if (!s.rafId) {
      s.rafId = requestAnimationFrame(applyFrame);
    }
  }, [applyFrame]);

  // LIVE drag: update delta, rAF will flush styles next frame
  const handleResize = useCallback(
    (deltaPx: number) => {
      const s = ensureSession();
      if (!s) return;
      s.lastDeltaPx = deltaPx;
      schedule();
    },
    [ensureSession, schedule],
  );

  // COMMIT once: compute final L/R and dispatch to Redux
  const handleResizeEnd = useCallback(
    (deltaPx: number) => {
      const s = ensureSession();
      if (!s) return;

      if (s.rafId) {
        cancelAnimationFrame(s.rafId);
        s.rafId = 0;
      }

      // final compute
      s.lastDeltaPx = deltaPx;
      if (s.rowWidth) {
        const dPct = (s.lastDeltaPx / s.rowWidth) * 100;
        const { L, R } = clampPairPercent(
          leftBasePct,
          rightBasePct,
          dPct,
          MIN_PCT,
        );

        // persist to store (single commit for each side)
        dispatch(
          updateLayoutCalculatedWidth({
            pageId,
            nodeId: leftId,
            width: `${L.toFixed(2)}%`,
          }),
        );
        dispatch(
          updateLayoutCalculatedWidth({
            pageId,
            nodeId: rightId,
            width: `${R.toFixed(2)}%`,
          }),
        );

        // ensure DOM matches committed values
        if (s.leftEl) {
          s.leftEl.style.width = `${L.toFixed(2)}%`;
        }
        if (s.rightEl) {
          s.rightEl.style.width = `${R.toFixed(2)}%`;
        }
      }

      // cleanup row containment hint
      if (s.rowEl) s.rowEl.style.contain = "";

      // end session
      sessionRef.current = null;
    },
    [
      ensureSession,
      leftBasePct,
      rightBasePct,
      dispatch,
      pageId,
      leftId,
      rightId,
    ],
  );

  return <RowResizer onResize={handleResize} onResizeEnd={handleResizeEnd} />;
}

export default memo(RowResizerWrapper);
