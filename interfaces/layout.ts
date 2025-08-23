import { InstanceId, NodeId, OverlayId } from "./common";
import { NodeDirection, NodeKind } from "./enum";
import { LayoutStyleType } from "./style";

export interface ContainerNode {
  id: NodeId;
  kind: NodeKind;
  direction: NodeDirection; // "row" or "column"
  children: NodeId[]; // ordered children (containers or blockRefs)
  layoutStyle: LayoutStyleType;
}

export interface BlockRefNode {
  id: NodeId;
  kind: NodeKind;
  instanceId: InstanceId; // points into blockInstances.byId
  layoutStyle: LayoutStyleType;
}

export type LayoutNode = ContainerNode | BlockRefNode;

/**
 *  Per-page layout (normalized graph)
 */
export interface PageLayout {
  rootId: NodeId; // must point to a ContainerNode
  byId: Record<string, LayoutNode>; // { nodeId: LayoutNode }
  overlayIds: OverlayId[]; // optional convenience
}
