import { NodeId } from "@/interfaces/common";
import React, { memo } from "react";

interface Props {
  nodeId: NodeId;
  children: React.ReactNode;
}

function NodeRowShell({ nodeId, children }: Props) {
  return (
    <div
      id={nodeId}
      data-node-type="node-row"
      className="group/resizer mx-[-13px] my-0 flex"
    >
      {children}
    </div>
  );
}

export default memo(NodeRowShell);
