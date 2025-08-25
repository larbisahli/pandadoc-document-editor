import { NodeId } from "@/interfaces/common";
import { selectRowItemLayoutStyle } from "@/lib/features/layout/layoutSlice";
import { useAppSelector } from "@/lib/hooks";
import React, { memo } from "react";
import { usePage } from "../../context/PageContext";

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
  console.log("RowItem >>>>>", { nodeId });

  return (
    <div
      id={nodeId}
      data-node-type="item-row"
      className="item-row flex w-full overflow-hidden bg-purple-400 px-[13px] py-2"
      style={{ width: `${(basePct as number).toFixed(2)}%` }}
    >
      {children}
    </div>
  );
}

export default memo(RowItem);
