import { NodeDirection } from "@/interfaces/enum";
import { ContainerNode, LayoutNode, PageLayout } from "@/interfaces/layout";

function toPercentString(n: number) {
  return `${Math.max(0, n)}%`;
}

function isContainer(node: LayoutNode): node is ContainerNode {
  return (node as ContainerNode).children !== undefined;
}

/** Recompute equal widths for a Row container's children */
function redistributeRowWidths(page: PageLayout, rowId: string) {
  const row = page.byId[rowId] as ContainerNode | undefined;
  if (!row || row.direction !== NodeDirection.Row) return;
  const count = row.children.length;
  if (count === 0) return;
  const share = 100 / count;
  for (const childId of row.children) {
    const child = page.byId[childId];
    if (!child) continue;
    child.layoutStyle = { ...child.layoutStyle, width: toPercentString(share) };
  }
}

/** Remove an empty container and prune up the tree recursively. */
function pruneEmptyContainer(page: PageLayout, containerId: string) {
  const container = page.byId[containerId] as ContainerNode | undefined;
  if (!container) return;

  const parentId = container.parentId;
  // Remove container itself
  delete page.byId[containerId];

  if (!parentId) return; // reached root (or detached)

  const parent = page.byId[parentId] as ContainerNode | undefined;
  if (!parent) return;

  // Detach from parent
  parent.children = parent.children.filter((id) => id !== containerId);

  // If parent is a Row, rebalance remaining widths
  if (parent.direction === NodeDirection.Row) {
    redistributeRowWidths(page, parentId);
  }

  // If parent became empty as well, prune it too
  if (parent.children.length === 0) {
    pruneEmptyContainer(page, parentId);
  }
}

/** Detach a child from its parent and handle container-specific updates */
export function detachFromParent(page: PageLayout, nodeId: string) {
  const node = page.byId[nodeId];
  if (!node) return;

  const parentId = node.parentId;
  if (!parentId) return;

  const parent = page.byId[parentId] as ContainerNode | undefined;
  if (!parent || !isContainer(parent)) return;

  // Remove the child from parent's children
  parent.children = parent.children.filter((id) => id !== nodeId);

  if (parent.direction === NodeDirection.Row) {
    if (parent.children.length > 0) {
      redistributeRowWidths(page, parentId);
    } else {
      // Row became empty -> prune it
      pruneEmptyContainer(page, parentId);
    }
  } else {
    // Column: if it became empty, prune it
    if (parent.children.length === 0) {
      pruneEmptyContainer(page, parentId);
    }
  }
}
