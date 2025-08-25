import { NodeId } from "@/interfaces/common";

export interface ResizerPayloadType {
  leftId: NodeId;
  rightId: NodeId;
  leftDelta: number;
  rightDelta: number;
}

/**
 * Given a parent row container's children and a dragged child index,
 * return the left and right neighbor IDs and the deltas to apply.
 */
export function getResizeEffect(
  children: string[],
  index: number,
  delta: number,
): ResizerPayloadType | null {
  if (index < 0 || index >= children.length - 1) {
    // Don't resize if there is no right neighbor
    return null;
  }
  const leftId = children[index] as NodeId;
  const rightId = children[index + 1] as NodeId;

  return {
    leftId,
    rightId,
    leftDelta: delta,
    rightDelta: -delta,
  };
}
