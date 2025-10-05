import { NodeDirection } from "@/interfaces/enum";
import { ContainerNode, LayoutNode, PageLayout } from "@/interfaces/layout";

function toPercentString(n: number) {
  return `${Math.max(0, n)}%`;
}

function isContainer(node: LayoutNode): node is ContainerNode {
  return (node as ContainerNode).children !== undefined;
}

function isRoot(page: PageLayout, id: string) {
  return id === page.rootId;
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

  // Never delete the root container
  if (isRoot(page, containerId)) {
    container.children = [];
    return;
  }

  const parentId = container.parentId;
  // Remove container itself
  delete page.byId[containerId];

  if (parentId == null) return; // reached root or detached

  const parent = page.byId[parentId] as ContainerNode | undefined;
  if (!parent) return;

  // Detach from parent
  parent.children = parent.children.filter((id) => id !== containerId);

  // Rebalance if needed
  if (parent.direction === NodeDirection.Row) {
    redistributeRowWidths(page, parentId);
  }

  // If parent became empty as well, prune it (unless parent is root)
  if (parent.children.length === 0 && !isRoot(page, parentId)) {
    pruneEmptyContainer(page, parentId);
  }
}

/** Detach a child from its parent and handle container-specific updates */
export function detachFromParent(page: PageLayout, nodeId: string) {
  const node = page.byId[nodeId];
  if (!node) return;

  const parentId = node.parentId;
  if (parentId == null) return;

  const parent = page.byId[parentId] as ContainerNode | undefined;
  if (!parent || !isContainer(parent)) return;

  parent.children = parent.children.filter((id) => id !== nodeId);

  if (parent.direction === NodeDirection.Row) {
    if (parent.children.length > 0) {
      redistributeRowWidths(page, parentId);
    } else if (!isRoot(page, parentId)) {
      pruneEmptyContainer(page, parentId);
    } else {
      // root row became empty: keep it, just clear children
      parent.children = [];
    }
  } else {
    if (parent.children.length === 0) {
      if (!isRoot(page, parentId)) {
        pruneEmptyContainer(page, parentId);
      } else {
        parent.children = [];
      }
    }
  }
}
