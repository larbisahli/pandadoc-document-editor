"use client";

import { memo, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import RowResizer from "./RowResizer";
import {
  selectRowItemLayoutStyle,
  updateLayoutCalculatedWidth,
} from "@/lib/features/layout/layoutSlice";
import { usePage } from "../../context/PageContext";
import { NodeId } from "@/interfaces/common";
import {
  applyPairPercent,
  clampDeltaPercent,
  MIN_PCT,
  pctToPx,
  pxToPct,
} from "@/utils/helpers/resizer";

type Props = {
  rowRootId: string;
  nodeIds: string[];
  index: number;
};

function RowResizerWrapper({ rowRootId, nodeIds, index }: Props) {
  // Drag session cache: everything we must not recompute per-move.
  const sessionRef = useRef<{
    rowEl: HTMLDivElement | null;
    leftEl: HTMLDivElement | null;
    rightEl: HTMLDivElement | null;
    rowWidth: number;
    effectiveDeltaPx: number;
    anchorOffsetPx: number;
    rafId: number;
  } | null>(null);

  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  // the two panes controlled by this resizer
  const leftId = nodeIds[index] as NodeId;
  const rightId = nodeIds[index + 1] as NodeId;

  // base % widths from the store (source of truth)
  const leftBasePct = useAppSelector((s) =>
    parseFloat(selectRowItemLayoutStyle(s, pageId, leftId)?.width || "0"),
  );
  const rightBasePct = useAppSelector((s) =>
    parseFloat(selectRowItemLayoutStyle(s, pageId, rightId)?.width || "0"),
  );

  const ensureSession = useCallback(() => {
    let session = sessionRef.current;
    if (session) return session;

    const rowEl = document.getElementById(rowRootId) as HTMLDivElement | null;
    const leftEl = document.getElementById(leftId) as HTMLDivElement | null;
    const rightEl = document.getElementById(rightId) as HTMLDivElement | null;
    const rowWidth = rowEl?.clientWidth ?? 0;

    sessionRef.current = session = {
      rowEl,
      leftEl,
      rightEl,
      rowWidth,
      effectiveDeltaPx: 0,
      anchorOffsetPx: 0,
      rafId: 0, // rAF ID
    };

    // Isolate layout of the row during drag
    if (rowEl) rowEl.style.contain = "layout style";
    return session;
  }, [rowRootId, leftId, rightId]);

  // rAF writer — applies styles based on the clamped, effective delta
  const applyFrame = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    session.rafId = 0;

    if (!session.rowWidth || !session.leftEl || !session.rightEl) return;

    const dPct = pxToPct(session.rowWidth, session.effectiveDeltaPx);

    const clamped = clampDeltaPercent(leftBasePct, rightBasePct, dPct, MIN_PCT);
    const { leftRow, rightRow } = applyPairPercent(
      leftBasePct,
      rightBasePct,
      clamped,
      MIN_PCT,
    );

    // write only what’s needed, keep them fixed during drag
    session.leftEl.style.width = `${leftRow.toFixed(2)}%`;
    session.rightEl.style.width = `${rightRow.toFixed(2)}%`;
  }, [leftBasePct, rightBasePct]);

  const schedule = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    if (!session.rafId) {
      session.rafId = requestAnimationFrame(applyFrame);
    }
  }, [applyFrame]);

  // LIVE move: transform raw delta → clamped effective delta
  const handleResize = useCallback(
    (rawDeltaPx: number) => {
      const session = ensureSession();
      if (!session?.rowWidth) return;

      // effective delta before clamping
      const effectiveBefore = rawDeltaPx + session.anchorOffsetPx;

      const dPctRaw = pxToPct(session.rowWidth, effectiveBefore);
      const dPctClamped = clampDeltaPercent(
        leftBasePct,
        rightBasePct,
        dPctRaw,
        MIN_PCT,
      );
      const effectiveDeltaPx = pctToPx(session.rowWidth, dPctClamped);

      // Keep effective delta pinned at the limit
      if (effectiveDeltaPx !== effectiveBefore) {
        session.anchorOffsetPx = effectiveDeltaPx - rawDeltaPx;
      }

      session.effectiveDeltaPx = effectiveDeltaPx;
      schedule();
    },
    [ensureSession, leftBasePct, rightBasePct, schedule],
  );

  // COMMIT once on end
  const handleResizeEnd = useCallback(
    (rawDeltaPx: number) => {
      const session = ensureSession();
      if (!session) return;

      if (session.rafId) {
        cancelAnimationFrame(session.rafId);
        session.rafId = 0;
      }

      if (session.rowWidth) {
        // finalize effective delta (already re-anchored)
        const effPx = rawDeltaPx + session.anchorOffsetPx;
        const dPctRaw = pxToPct(session.rowWidth, effPx);
        const dPctClamped = clampDeltaPercent(
          leftBasePct,
          rightBasePct,
          dPctRaw,
          MIN_PCT,
        );
        const { leftRow, rightRow } = applyPairPercent(
          leftBasePct,
          rightBasePct,
          dPctClamped,
          MIN_PCT,
        );

        // Persist to Redux
        dispatch(
          updateLayoutCalculatedWidth({
            pageId,
            nodeId: leftId,
            width: `${leftRow.toFixed(2)}%`,
          }),
        );
        dispatch(
          updateLayoutCalculatedWidth({
            pageId,
            nodeId: rightId,
            width: `${rightRow.toFixed(2)}%`,
          }),
        );

        // Ensure DOM reflects committed values
        if (session.leftEl) {
          session.leftEl.style.width = `${leftRow.toFixed(2)}%`;
        }
        if (session.rightEl) {
          session.rightEl.style.width = `${rightRow.toFixed(2)}%`;
        }
      }

      // Cleanup row containment & end session
      if (session.rowEl) session.rowEl.style.contain = "";
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
