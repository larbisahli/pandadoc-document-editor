import * as React from "react";
import { useAppSelector } from "@/lib/hooks";
import { selectNodeById } from "@/lib/features/layout/layoutSlice";
import RowItem from "./RowItem";
import DocBlock from "./DocBlock";
import NodeColumnShell from "./NodeColumnShell";
import NodeRowShell from "./NodeRowShell";
import BlockLeaf from "./BlockLeaf";
import { NodeId, PageId } from "@/interfaces/common";
import { BlockRefNode, ContainerNode } from "@/interfaces/layout";
import { NodeDirection, NodeKind } from "@/interfaces/enum";

interface LayoutRendererProps {
  nodeId: NodeId;
  pageId: PageId;
}

function LayoutRenderer({ pageId, nodeId }: LayoutRendererProps) {
  const node = useAppSelector((state) => selectNodeById(state, pageId, nodeId));

  if (!node) return null;

  switch (node.kind) {
    case NodeKind.Container: {
      const n = node as ContainerNode;
      const isColumn = n.direction === NodeDirection.Column;

      // The Shell component
      const Shell = isColumn ? NodeColumnShell : NodeRowShell;
      // The Wrapper component
      const ChildWrapper = isColumn ? DocBlock : RowItem;

      return (
        <Shell id={n.id}>
          {n.children.map((cid) => (
            <ChildWrapper key={cid}>
              <LayoutRenderer nodeId={cid} pageId={pageId} />
            </ChildWrapper>
          ))}
        </Shell>
      );
    }

    case NodeKind.BlockRef: {
      const leaf = node as BlockRefNode;
      return <BlockLeaf id={leaf.id} instanceId={leaf.instanceId} />;
    }

    default:
      return null;
  }
}

export default React.memo(LayoutRenderer);
