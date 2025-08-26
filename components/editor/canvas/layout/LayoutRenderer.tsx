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
import BlockLeaf from "./leaves/BlockLeaf";
import RowResizerWrapper from "./row-resizer/RowResizerWrapper";
import { usePage } from "../context/PageContext";

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
        <Shell id={n.id}>
          {n.children.map((cid, index) => (
            <React.Fragment key={cid}>
              <ChildWrapper nodeId={cid}>
                <LayoutRenderer nodeId={cid} />
              </ChildWrapper>
              {/* Add resizer between row children, but not after the last */}
              {!isColumn && index < n.children.length - 1 && (
                <RowResizerWrapper
                  rowRootId={n.id}
                  nodeId={cid}
                  nodeIds={n.children}
                  index={index}
                />
              )}
            </React.Fragment>
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
