export function buildThresholds(step: number): number[] {
  const clamped = Math.min(Math.max(step, 0.01), 1);
  const thresholds: number[] = [];

  for (let threshold = 0; threshold <= 1; threshold += clamped) {
    thresholds.push(Number(threshold.toFixed(3)));
  }

  // Ensure final value is exactly 1
  if (thresholds[thresholds.length - 1] !== 1) {
    thresholds.push(1);
  }

  return thresholds;
}

/**
 * Get the current vertical scroll position.
 * Falls back to window/document when no root element is provided.
 */
export function getScrollTop(root?: HTMLElement | null): number {
  if (root) return root.scrollTop;

  return (
    window.scrollY ??
    document.documentElement.scrollTop ??
    document.body.scrollTop ??
    0
  );
}

type ScrollDirection = 1 | -1;

// Pick the most visible page; break ties using scroll direction and DOM order.
export function pickActivePage(
  pageIds: readonly string[],
  visibilityRatios: ReadonlyMap<string, number>,
  domPositions: ReadonlyMap<string, number>,
  scrollDirection: ScrollDirection,
): string | null {
  if (pageIds.length === 0) return null;

  const getRatio = (pageId: string) =>
    Math.max(0, visibilityRatios.get(pageId) ?? 0);
  const getPosition = (pageId: string) => domPositions.get(pageId) ?? 0;

  const chooseBetter = (current: string | null, candidate: string): string => {
    if (current === null) return candidate;

    const currentRatio = getRatio(current);
    const candidateRatio = getRatio(candidate);

    if (candidateRatio > currentRatio) return candidate;
    if (candidateRatio < currentRatio) return current;

    // Tie → break based on scroll direction and DOM position
    const currentPos = getPosition(current);
    const candidatePos = getPosition(candidate);
    const candidateAhead =
      scrollDirection === 1
        ? candidatePos > currentPos
        : candidatePos < currentPos;

    return candidateAhead ? candidate : current;
  };

  return pageIds.reduce<string | null>(chooseBetter, null);
}

/** Decide whether to switch from last → next given ratios & thresholds. */
export function shouldSwitch(
  lastId: string | null,
  nextId: string,
  ratios: Map<string, number>,
  majorityThreshold: number,
  switchMargin: number,
): boolean {
  if (!lastId) return true; // first selection
  if (lastId === nextId) return false;

  const next = ratios.get(nextId) ?? 0;
  const prev = ratios.get(lastId) ?? 0;

  // Switch if next has clear majority OR beats previous by a small margin
  return next >= majorityThreshold || next > prev + switchMargin;
}
