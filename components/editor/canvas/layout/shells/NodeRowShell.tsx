import React, { memo } from "react";

interface Props {
  id: string;
  children: React.ReactNode;
}

function NodeRowShell({ id, children }: Props) {
  return (
    <div
      id={id}
      data-node-type="node-row"
      className="group/resizer flex bg-red-500 p-2"
    >
      {children}
    </div>
  );
}

export default memo(NodeRowShell);
