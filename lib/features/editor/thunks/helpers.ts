import { Normalized } from "@/interfaces/document";
import { BlockRefNode, PageLayout } from "@/interfaces/layout";
import { OverlayItem } from "@/interfaces/overlay";

export function collectIdsFromLayoutPage(
  page?: PageLayout | null,
  overlays?: Normalized<OverlayItem>,
) {
  const instanceIds = new Set<string>();

  if (!page) return { overlayIds: [], instanceIds: [] };

  const overlayIds = page.overlayIds;

  for (const [_, node] of Object.entries(page.byId)) {
    const { instanceId = null } = node as BlockRefNode;
    if (instanceId) {
      instanceIds.add(instanceId);
    }
  }

  if (overlays?.byId) {
    for (const id of overlayIds) {
      const { instanceId = null } = overlays.byId[id];
      if (instanceId) {
        instanceIds.add(instanceId);
      }
    }
  }

  return { overlayIds, instanceIds: [...instanceIds] };
}
