import { usePage } from "@/components/editor-preview/context/PageContext";
import { NodeId } from "@/interfaces/common";
import { selectRowItemLayoutStyle } from "@/lib/features/layout/layoutSlice";
import { useAppSelector } from "@/lib/hooks";
import React, { memo } from "react";

interface Props {
  nodeId: NodeId;
  children: React.ReactNode;
}

function RowItem({ nodeId, children }: Props) {
  const { pageId } = usePage();

  const layoutStyle = useAppSelector((state) =>
    selectRowItemLayoutStyle(state, pageId, nodeId),
  );

  const basePct = parseFloat(layoutStyle?.width ?? "0");

  return (
    <div
      id={nodeId}
      data-node-type="item-row"
      className="item-row flex w-full px-[13px] py-0"
      style={{ width: `${(basePct as number).toFixed(2)}%` }}
    >
      {children}
    </div>
  );
}

export default memo(RowItem);
