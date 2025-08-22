import React, { memo } from "react";

interface Props {
  children: React.ReactNode;
}

function DocBlock({ children }: Props) {
  return (
    <div data-node-type="docBlock" className="docBlock">
      {children}
    </div>
  );
}

export default memo(DocBlock);
