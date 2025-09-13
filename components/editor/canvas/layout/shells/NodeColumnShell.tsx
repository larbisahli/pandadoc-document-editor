import { NodeId } from "@/interfaces/common";
import React, { memo } from "react";

interface Props {
  children: React.ReactNode;
  parentId: NodeId | null;
}

function NodeColumnShell({ children, parentId }: Props) {
  return (
    <div
      data-node-type="node-column"
      className="h-full w-full bg-amber-300 p-2"
    >
      <div
        data-node-type="col"
        className="col flex w-full flex-col bg-blue-300 p-2"
      >
        {children}
      </div>
    </div>
  );
}

export default memo(NodeColumnShell);
