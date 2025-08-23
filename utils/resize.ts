/**
 * Given a parent row container's children and a dragged child index,
 * return the left and right neighbor IDs and the deltas to apply.
 */
export function getResizeEffect(
  children: string[],
  index: number,
  delta: number,
): {
  leftId: string;
  rightId: string;
  leftDelta: number;
  rightDelta: number;
} | null {
  if (index < 0 || index >= children.length - 1) {
    // Don't resize if there is no right neighbor
    return null;
  }
  const leftId = children[index];
  const rightId = children[index + 1];

  return {
    leftId,
    rightId,
    leftDelta: delta,
    rightDelta: -delta,
  };
}
