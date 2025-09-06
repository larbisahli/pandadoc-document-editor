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
  rowNodeId: NodeId;
  childNodeIds: NodeId[];
  index: number;
};

function RowResizerWrapper({ rowNodeId, childNodeIds, index }: Props) {
  // Drag session cache: everything we must not recompute per-move.
  const sessionRef = useRef<{
    rowEl: HTMLDivElement | null;
    leftChildEl: HTMLDivElement | null;
    rightChildEl: HTMLDivElement | null;
    rowWidth: number;
    effectiveDeltaPx: number;
    anchorOffsetPx: number;
    rafId: number;
  } | null>(null);

  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  // The two panes controlled by this resizer
  const leftChildNodeId = childNodeIds[index] as NodeId;
  const rightChildNodeId = childNodeIds[index + 1] as NodeId;

  // Base % widths from the store (source of truth)
  const leftBasePct = useAppSelector((s) =>
    parseFloat(
      selectRowItemLayoutStyle(s, pageId, leftChildNodeId)?.width || "0",
    ),
  );
  const rightBasePct = useAppSelector((s) =>
    parseFloat(
      selectRowItemLayoutStyle(s, pageId, rightChildNodeId)?.width || "0",
    ),
  );

  const ensureSession = useCallback(() => {
    let session = sessionRef.current;
    if (session) return session;

    const rowEl = document.getElementById(rowNodeId) as HTMLDivElement | null;
    const leftChildEl = document.getElementById(
      leftChildNodeId,
    ) as HTMLDivElement | null;
    const rightChildEl = document.getElementById(
      rightChildNodeId,
    ) as HTMLDivElement | null;
    const rowWidth = rowEl?.clientWidth ?? 0;

    sessionRef.current = session = {
      rowEl,
      leftChildEl,
      rightChildEl,
      rowWidth,
      effectiveDeltaPx: 0,
      anchorOffsetPx: 0,
      rafId: 0, // rAF ID
    };

    // Isolate layout of the row during drag
    if (rowEl) rowEl.style.contain = "layout style";
    return session;
  }, [rowNodeId, leftChildNodeId, rightChildNodeId]);

  // rAF writer, applies styles based on the clamped, effective delta
  const applyFrame = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    session.rafId = 0;

    if (!session.rowWidth || !session.leftChildEl || !session.rightChildEl)
      return;

    const dPct = pxToPct(session.rowWidth, session.effectiveDeltaPx);

    const clamped = clampDeltaPercent(leftBasePct, rightBasePct, dPct, MIN_PCT);
    const { leftRow, rightRow } = applyPairPercent(
      leftBasePct,
      rightBasePct,
      clamped,
      MIN_PCT,
    );

    // Write to style
    session.leftChildEl.style.width = `${leftRow.toFixed(2)}%`;
    session.rightChildEl.style.width = `${rightRow.toFixed(2)}%`;
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
        const effectivePx = rawDeltaPx + session.anchorOffsetPx;
        const dPctRaw = pxToPct(session.rowWidth, effectivePx);
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
            nodeId: leftChildNodeId,
            width: `${leftRow.toFixed(2)}%`,
          }),
        );
        dispatch(
          updateLayoutCalculatedWidth({
            pageId,
            nodeId: rightChildNodeId,
            width: `${rightRow.toFixed(2)}%`,
          }),
        );

        // Ensure DOM reflects committed values
        if (session.leftChildEl) {
          session.leftChildEl.style.width = `${leftRow.toFixed(2)}%`;
        }
        if (session.rightChildEl) {
          session.rightChildEl.style.width = `${rightRow.toFixed(2)}%`;
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
      leftChildNodeId,
      rightChildNodeId,
    ],
  );

  return <RowResizer onResize={handleResize} onResizeEnd={handleResizeEnd} />;
}

export default memo(RowResizerWrapper);
