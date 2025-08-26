import { NodeId } from "@/interfaces/common";

export interface ResizerPayloadType {
  leftId: NodeId;
  rightId: NodeId;
  leftDelta: number;
  rightDelta: number;
}

// minimum width for any pane (in percent)
export const MIN_PCT = 15;

export function pctToPx(rowWidth: number, pct: number) {
  return (pct / 100) * rowWidth;
}

export function pxToPct(rowWidth: number, px: number) {
  return (px / rowWidth) * 100;
}

/**
 * Clamp delta (in percent points) so:
 * - left grows by +d, right shrinks by -d
 * - neither side goes below MIN_PCT
 * Returns clamped delta in percent.
 * This function is about how far the handle can move -> keeps us inside valid min/max bounds.
 */
export function clampDeltaPercent(
  leftBasePct: number,
  rightBasePct: number,
  dPct: number,
  minPct: number,
) {
  // How much each side can give before hitting min
  const rightCanLose = Math.max(0, rightBasePct - minPct); // limits +d
  const leftCanLose = Math.max(0, leftBasePct - minPct); // limits -d

  // smallest allowed delta
  const minD = -leftCanLose;
  // largest  allowed delta
  const maxD = rightCanLose;

  const clamped = Math.max(minD, Math.min(maxD, dPct));
  return clamped;
}

/**
 * Given base percents and a clamped delta (in percent),
 * compute the new left/right percents and make sure the pair's
 * sum never exceeds their original total (prevents rounding overflow).
 * This function ensures the pair’s widths are always valid, minimum respected,
 */
export function applyPairPercent(
  leftBasePct: number,
  rightBasePct: number,
  dPct: number,
  minPct: number,
) {
  let leftRow = Math.max(minPct, leftBasePct + dPct);
  let rightRow = Math.max(minPct, rightBasePct - dPct);

  // Cap to original pair total to avoid any rounding creep
  const cap = Math.max(0, leftBasePct + rightBasePct);
  const pairNow = leftRow + rightRow;
  if (pairNow > cap && pairNow > 0) {
    const s = cap / pairNow;
    leftRow = Math.max(minPct, leftRow * s);
    rightRow = Math.max(minPct, rightRow * s);
  }
  return { leftRow, rightRow };
}
