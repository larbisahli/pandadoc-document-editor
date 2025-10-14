import { NodeId } from "@/interfaces/common";
import React, { memo } from "react";

interface Props {
  children: React.ReactNode;
  nodeId: NodeId;
}

function DocBlock({ children }: Props) {
  return (
    <div data-node-type="docBlock" className="docBlock will-change-transform">
      {children}
    </div>
  );
}

export default memo(DocBlock);
