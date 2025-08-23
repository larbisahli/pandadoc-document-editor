import { NodeId, PageId } from "@/interfaces/common";
import { selectRowItemLayoutStyle } from "@/lib/features/layout/layoutSlice";
import { useAppSelector } from "@/lib/hooks";
import React, { memo } from "react";

interface Props {
  nodeId: NodeId;
  pageId: PageId;
  children: React.ReactNode;
  rowRootId: NodeId;
  resizeEffect?: {
    leftId: NodeId;
    rightId: NodeId;
    leftDelta: number;
    rightDelta: number;
  } | null;
}

function RowItem({ resizeEffect, nodeId, pageId, children, rowRootId }: Props) {
  const layoutStyle = useAppSelector((state) =>
    selectRowItemLayoutStyle(state, pageId, nodeId),
  );

  const leftBasePct = useAppSelector((s) =>
    resizeEffect
      ? parseFloat(
          selectRowItemLayoutStyle(s, pageId, resizeEffect.leftId)?.width ||
            "0",
        )
      : 0,
  );

  const rightBasePct = useAppSelector((s) =>
    resizeEffect
      ? parseFloat(
          selectRowItemLayoutStyle(s, pageId, resizeEffect.rightId)?.width ||
            "0",
        )
      : 0,
  );

  const basePct = parseFloat(layoutStyle?.width ?? "0"); // e.g. "33%" → 33
  const minPct = 5;

  // live % for THIS item
  const livePct = React.useMemo(() => {
    if (!resizeEffect) return basePct;

    // 1) row width for px→% conversion
    const rowEl = document.getElementById(
      rowRootId ?? "",
    ) as HTMLDivElement | null;
    const rowWidth = rowEl?.clientWidth ?? 0;
    if (!rowEl || !rowWidth) return basePct;

    const { leftId, rightId, leftDelta, rightDelta } = resizeEffect;

    // If this item isn't one of the pair, it's locked (unchanged)
    if (nodeId !== leftId && nodeId !== rightId) return basePct;

    // 2) convert deltas to percentage points
    const dLeftPct = (leftDelta / rowWidth) * 100;
    const dRightPct = (rightDelta / rowWidth) * 100;

    // 3) pair’s original allowed total (others are locked)
    const maxPairTotal = Math.max(0, leftBasePct + rightBasePct);

    // 4) tentative targets for the pair with per-panel minima
    let left1 = Math.max(minPct, leftBasePct + dLeftPct);
    let right1 = Math.max(minPct, rightBasePct + dRightPct);

    // 5) if pair would exceed its allowed total, scale proportionally
    const pair1 = left1 + right1;
    if (pair1 > maxPairTotal && pair1 > 0) {
      const scale = maxPairTotal / pair1;
      left1 = Math.max(minPct, left1 * scale);
      right1 = Math.max(minPct, right1 * scale);
    }

    // 6) return this item’s live %
    return nodeId === leftId ? left1 : right1;
  }, [
    basePct,
    resizeEffect,
    rowRootId,
    nodeId,
    minPct,
    leftBasePct,
    rightBasePct,
  ]);

  // console.log(">>>", [
  //   basePct,
  //   resizeEffect,
  //   rowRootId,
  //   nodeId,
  //   minPct,
  //   leftBasePct,
  //   rightBasePct,
  // ],livePct)

  return (
    <div
      id={nodeId}
      data-node-type="item-row"
      className="item-row flex w-full bg-purple-400 px-[13px] py-2"
      style={{ width: `${(livePct as number).toFixed(2)}%` }}
    >
      {children}
    </div>
  );
}

export default memo(RowItem);
