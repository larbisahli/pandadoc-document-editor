import { useAppSelector } from "@/lib/hooks";
import { selectNodeById } from "@/lib/features/layout/layoutSlice";
import { NodeId, PageId } from "@/interfaces/common";
import { BlockRefNode, ContainerNode } from "@/interfaces/layout";
import { NodeDirection, NodeKind } from "@/interfaces/enum";
import RowItem from "./shells/RowItem";
import NodeColumnShell from "./shells/NodeColumnShell";
import NodeRowShell from "./shells/NodeRowShell";
import DocBlock from "./shells/DocBlock";
import BlockLeaf from "./leaves/BlockLeaf";
import RowResizer from "./RowResizer";
import { getResizeEffect } from "@/utils/resize";
import RowResizerWrapper from "./RowResizerWrapper";
import React, { useState } from "react";

interface LayoutRendererProps {
  nodeId: NodeId;
  pageId: PageId;
}

// TODO Create a context for page specific (pageId, ....)
function LayoutRenderer({ pageId, nodeId }: LayoutRendererProps) {
  const node = useAppSelector((state) => selectNodeById(state, pageId, nodeId));

  // TODO Create a type for this ResizerPayloadType
  const [resizeEffect, setResizeEffect] = useState<{
    leftId: NodeId;
    rightId: NodeId;
    leftDelta: number;
    rightDelta: number;
  } | null>(null);

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
              <ChildWrapper
                rowRootId={n.id}
                nodeId={cid}
                pageId={pageId}
                {...(!isColumn ? { resizeEffect } : {})}
              >
                <LayoutRenderer nodeId={cid} pageId={pageId} />
              </ChildWrapper>
              {/* Add resizer between row children, but not after the last */}
              {!isColumn && index < n.children.length - 1 && (
                <RowResizerWrapper
                  nodeId={nodeId}
                  pageId={pageId}
                  nodeIds={n.children}
                  index={index}
                  setResizeEffect={setResizeEffect}
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
