import React from "react";
import { useAppSelector } from "@/lib/hooks";
import { selectNodeById } from "@/lib/features/layout/layoutSlice";
import { NodeId } from "@/interfaces/common";
import { BlockRefNode, ContainerNode } from "@/interfaces/layout";
import { NodeDirection, NodeKind } from "@/interfaces/enum";
import RowItem from "./shells/RowItem";
import NodeColumnShell from "./shells/NodeColumnShell";
import NodeRowShell from "./shells/NodeRowShell";
import DocBlock from "./shells/DocBlock";
import RowResizerWrapper from "./row-resizer/RowResizerWrapper";
import { usePage } from "../context/PageContext";
import BlockFactory from "../blocks/BlockFactory";

interface LayoutRendererProps {
  nodeId: NodeId;
}

function LayoutRenderer({ nodeId }: LayoutRendererProps) {
  const { pageId } = usePage();

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
        <Shell nodeId={n.id} parentId={n.parentId}>
          {n.children.map((cid, idx) => (
            <React.Fragment key={cid}>
              <ChildWrapper nodeId={cid}>
                <LayoutRenderer nodeId={cid} />
              </ChildWrapper>
              {/* Add resizer between row children, but not after the last */}
              {!isColumn && idx < n.children.length - 1 && (
                <RowResizerWrapper
                  rowNodeId={n.id}
                  childNodeIds={n.children}
                  index={idx}
                />
              )}
            </React.Fragment>
          ))}
        </Shell>
      );
    }

    case NodeKind.BlockRef: {
      const leaf = node as BlockRefNode;
      return (
        <DocBlock nodeId={leaf.id}>
          <BlockFactory instanceId={leaf.instanceId} />
        </DocBlock>
      );
    }

    default:
      return null;
  }
}

export default React.memo(LayoutRenderer);
