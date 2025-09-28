import { NodeId } from "@/interfaces/common";
import { DropEvent, DropPayload } from "@/interfaces/dnd";
import { DropSide, NodeDirection, NodeKind } from "@/interfaces/enum";
import { BlockRefNode, ContainerNode } from "@/interfaces/layout";
import { LayoutStyleType } from "@/interfaces/style";
import { newNodeId } from "./ids";

export type LayoutNode = ContainerNode | BlockRefNode;
export type LayoutById = Record<NodeId, LayoutNode>;

/** Is the drop side horizontal? */
const isHorizontal = (side: DropSide) =>
  side === DropSide.Left || side === DropSide.Right;
/** Is the drop side vertical? */
const isVertical = (side: DropSide) =>
  side === DropSide.Top || side === DropSide.Bottom;
/** Insert position relative to target index */
const sideIsBefore = (side: DropSide) =>
  side === DropSide.Left || side === DropSide.Top;

/** Normalize a percentage number to a fixed 2-decimal string (e.g., 33.33%) */
function toPercentString(value: number): string {
  return `${Math.max(0, value).toFixed(2)}%`;
}

/**
 * Redistribute widths (for rows) or heights (for columns) equally across children.
 * Rule: If container.direction === "row" -> set child.width = 100 / n (%)
 *       If container.direction === "column" -> set child.height = 100 / n (%)
 * This is deterministic and avoids layout drift.
 */
function redistributeSizes(byId: LayoutById, container: ContainerNode): void {
  const childCount = container.children.length;
  if (childCount === 0) return;

  const share = 100 / childCount;
  if (container.direction === NodeDirection.Row) {
    for (const childId of container.children) {
      const child = byId[childId];
      if (!child) continue;
      // Width applies to both containers and blocks inside a row
      child.layoutStyle = {
        ...child.layoutStyle,
        width: toPercentString(share),
      };
      // clear height so it can be auto
      // delete child.layoutStyle.height;
    }
  }
}

/** Create a new container with children and wire parent pointers. */
function createContainer(
  byId: LayoutById,
  direction: NodeDirection,
  children: NodeId[],
  parentId: NodeId | null,
  layoutStyle: LayoutStyleType = {},
): ContainerNode {
  const container: ContainerNode = {
    id: newNodeId(),
    kind: NodeKind.Container,
    parentId,
    direction,
    children: [...children],
    layoutStyle,
  };
  // Set parent id
  byId[container.id] = container;
  for (const childId of children) {
    const child = byId[childId];
    if (child) child.parentId = container.id;
  }
  return container;
}

/** Create a new blockRef node from a payload */
function createBlockRefFromPayload(
  byId: LayoutById,
  payload: DropPayload,
  parentId: NodeId | null,
): BlockRefNode {
  const nodeId = newNodeId();
  const block: BlockRefNode = {
    id: nodeId,
    kind: NodeKind.BlockRef,
    parentId,
    instanceId: payload.data.instance!.id!,
    layoutStyle: {},
  };
  byId[nodeId] = block;
  return block;
}

/** Replace a child in parent's children array at index with replacement id. */
function replaceChild(
  byId: LayoutById,
  parent: ContainerNode,
  replaceIndex: number,
  replacementId: NodeId,
) {
  parent.children.splice(replaceIndex, 1, replacementId);
  const replacement = byId[replacementId];
  if (replacement) replacement.parentId = parent.id;
}

/** Insert new child id into parent's children array at index. */
function insertChild(
  byId: LayoutById,
  parent: ContainerNode,
  insertIndex: number,
  childId: NodeId,
) {
  parent.children.splice(insertIndex, 0, childId);
  const child = byId[childId];
  if (child) child.parentId = parent.id;
}

/* ------------------------------------------------------------------ */

/** Helper: is this node the current root (and root has no parent)? */
function isRoot(byId: LayoutById, nodeId: NodeId, rootId?: NodeId): boolean {
  if (!rootId) return false;
  const root = byId[rootId];
  const node = byId[nodeId];
  return (
    !!root &&
    !!node &&
    root.kind === NodeKind.Container &&
    node.id === root.id &&
    root.parentId === null
  );
}

/** Insert newNode as sibling in root next to targetId; flip root to column; redistribute heights. */
function insertAsSiblingInRoot(
  byId: LayoutById,
  root: ContainerNode,
  targetId: NodeId | null,
  side: DropSide,
  newNodeId: NodeId,
) {
  // Ensure vertical stacking at root
  if (root.direction !== NodeDirection.Column) {
    root.direction = NodeDirection.Column;
  }

  if (targetId == null || root.children.length === 0) {
    // Root has no children yet → append as first child
    insertChild(byId, root, 0, newNodeId);
  } else {
    // Insert relative to existing target
    const targetIndex = root.children.indexOf(targetId);
    if (targetIndex === -1) {
      throw new Error("applyDrop: target not found among root children.");
    }
    const insertIndex = sideIsBefore(side) ? targetIndex : targetIndex + 1;
    insertChild(byId, root, insertIndex, newNodeId);
  }

  // Equal heights for root children after change
  redistributeSizes(byId, root);
}

/**
 * Apply a drop event to the layout tree.
 * - Inserts the new node as a sibling when orientation matches (row for left/right; column for top/bottom).
 * - Otherwise wraps the target and the new node in a new container with the orthogonal direction.
 * - After any structural change, redistributes sizes (widths for rows, heights for columns).
 *
 * IMPORTANT: This function mutates `byId` in-place.
 */
export function applyDrop(
  byId: LayoutById,
  dropEvent: DropEvent,
  rootId: NodeId,
): { newNodeId: NodeId; maybeNewRootId?: NodeId } {
  const nodeId = dropEvent?.nodeId;
  let targetNode;

  if (nodeId) {
    targetNode = byId[nodeId];
  }

  // ** Insert Block in root **
  if (dropEvent?.forceRoot && !targetNode) {
    // Create a new block node from the payload
    const newNode = createBlockRefFromPayload(byId, dropEvent.payload, null);

    // Ensure root exists and is a container
    const root = byId[rootId] as ContainerNode | undefined;
    if (!root || !Array.isArray(root.children)) {
      throw new Error(`Root container not found for id: ${rootId}`);
    }

    // Find the last child in root (if any)
    const lastChildId =
      root.children.length > 0 ? (root.children.at(-1) as NodeId) : null;

    // Insert new node at the bottom (after last child)
    insertAsSiblingInRoot(byId, root, lastChildId, DropSide.Bottom, newNode.id);

    return { newNodeId: newNode.id, maybeNewRootId: rootId };
  }

  if (!targetNode) {
    throw new Error(`applyDrop: target node ${dropEvent.nodeId} not found.`);
  }
  if (!dropEvent.side) {
    throw new Error(`applyDrop: please specify the drop side direction.`);
  }

  // Create the new node (blockRef example). In a real app, route by payload.kind.
  const newNode = createBlockRefFromPayload(byId, dropEvent.payload, null);

  /****** Case 1: Target is a CONTAINER  ******/
  if (targetNode.kind === NodeKind.Container) {
    const container = targetNode as ContainerNode;

    // If side matches container direction → simple edge insert
    if (
      container.direction === NodeDirection.Row &&
      isHorizontal(dropEvent.side)
    ) {
      if (dropEvent.side === DropSide.Left) {
        insertChild(byId, container, 0, newNode.id);
      } else {
        insertChild(byId, container, container.children.length, newNode.id);
      }
      redistributeSizes(byId, container);
      return { newNodeId: newNode.id, maybeNewRootId: rootId };
    }

    if (
      container.direction === NodeDirection.Column &&
      isVertical(dropEvent.side)
    ) {
      if (dropEvent.side === DropSide.Top) {
        insertChild(byId, container, 0, newNode.id);
      } else {
        insertChild(byId, container, container.children.length, newNode.id);
      }
      redistributeSizes(byId, container);
      return { newNodeId: newNode.id, maybeNewRootId: rootId };
    }

    // NEW RULE: if dropping TOP/BOTTOM onto a child of ROOT → insert in ROOT (no wrapper)
    if (
      isVertical(dropEvent.side) &&
      container.parentId &&
      isRoot(byId, container.parentId, rootId)
    ) {
      const root = byId[container.parentId] as ContainerNode;
      insertAsSiblingInRoot(
        byId,
        root,
        container.id,
        dropEvent.side,
        newNode.id,
      );
      return { newNodeId: newNode.id, maybeNewRootId: rootId };
    }

    // Orientation mismatch: wrap the container + new node in an orthogonal container
    const requiredDirection: NodeDirection = isHorizontal(dropEvent.side)
      ? NodeDirection.Row
      : NodeDirection.Column;
    const orderedChildren = sideIsBefore(dropEvent.side)
      ? [newNode.id, container.id]
      : [container.id, newNode.id];

    if (container.parentId) {
      const parent = byId[container.parentId] as ContainerNode;
      const indexInParent = parent.children.indexOf(container.id);
      const wrapper = createContainer(
        byId,
        requiredDirection,
        orderedChildren,
        parent.id,
        // targetNode.layoutStyle
      );
      replaceChild(byId, parent, indexInParent, wrapper.id);
      redistributeSizes(byId, wrapper);
      redistributeSizes(byId, parent);
      return { newNodeId: newNode.id, maybeNewRootId: rootId };
    }

    // container.parentId is null → container is the root (or detached top).
    // Keep your previous behavior: create a new wrapper as the new root.
    const wrapper = createContainer(
      byId,
      requiredDirection,
      orderedChildren,
      null,
    );
    redistributeSizes(byId, wrapper);
    return { newNodeId: newNode.id, maybeNewRootId: wrapper.id };
  }

  /****** Case 2: Target is a LEAF (blockRef) → operate relative to its parent ******/
  const targetLeaf = targetNode as BlockRefNode;

  if (!targetLeaf.parentId) {
    throw new Error("applyDrop: parentId is undefined for leaf node.");
  }

  const parentContainer = byId[targetLeaf.parentId] as ContainerNode;
  const indexInParent = parentContainer.children.indexOf(targetLeaf.id);

  // Parent direction matches drop side → insert as sibling
  if (
    parentContainer.direction === NodeDirection.Row &&
    isHorizontal(dropEvent.side)
  ) {
    const insertIndex = sideIsBefore(dropEvent.side)
      ? indexInParent
      : indexInParent + 1;
    insertChild(byId, parentContainer, insertIndex, newNode.id);
    redistributeSizes(byId, parentContainer);
    return { newNodeId: newNode.id, maybeNewRootId: rootId };
  }

  if (
    parentContainer.direction === NodeDirection.Column &&
    isVertical(dropEvent.side)
  ) {
    const insertIndex = sideIsBefore(dropEvent.side)
      ? indexInParent
      : indexInParent + 1;
    insertChild(byId, parentContainer, insertIndex, newNode.id);
    redistributeSizes(byId, parentContainer);
    return { newNodeId: newNode.id, maybeNewRootId: rootId };
  }

  // NEW RULE: if side is TOP/BOTTOM and parent is ROOT → insert in ROOT (no wrapper)
  if (isVertical(dropEvent.side) && isRoot(byId, parentContainer.id, rootId)) {
    insertAsSiblingInRoot(
      byId,
      parentContainer,
      targetLeaf.id,
      dropEvent.side,
      newNode.id,
    );
    return { newNodeId: newNode.id, maybeNewRootId: rootId };
  }

  // Otherwise: wrap the leaf + new node with orthogonal container, replace in parent
  const wrapperDirection: NodeDirection = isHorizontal(dropEvent.side)
    ? NodeDirection.Row
    : NodeDirection.Column;
  const wrapperChildren = sideIsBefore(dropEvent.side)
    ? [newNode.id, targetLeaf.id]
    : [targetLeaf.id, newNode.id];

  const wrapper = createContainer(
    byId,
    wrapperDirection,
    wrapperChildren,
    parentContainer.id,
    targetNode.layoutStyle,
  );

  console.log(JSON.parse(JSON.stringify(targetNode)), { wrapperDirection });

  replaceChild(byId, parentContainer, indexInParent, wrapper.id);

  redistributeSizes(byId, wrapper);
  // redistributeSizes(byId, parentContainer);

  return { newNodeId: newNode.id, maybeNewRootId: rootId };
}
