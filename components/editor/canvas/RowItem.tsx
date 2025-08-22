import React, { memo } from "react";

interface Props {
  children: React.ReactNode;
}

function RowItem({ children }: Props) {
  return (
    <div
      data-node-type="item-row"
      className="mx-1 flex w-full bg-purple-400 px-[13px] py-2"
    >
      {children}
    </div>
  );
}

export default memo(RowItem);
