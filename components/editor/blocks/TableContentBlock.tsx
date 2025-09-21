import { memo } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";

function TableContentBlock({ props }: BaseBlockProps) {
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="cursor-default p-1 hover:bg-gray-100">Content 1:</div>
        <div className="cursor-default p-1 hover:bg-gray-100">Content 2:</div>
        <div className="cursor-default p-1 hover:bg-gray-100">Content 3:</div>
        <div className="cursor-default p-1 hover:bg-gray-100">Content 4:</div>
        <div className="cursor-default p-1 hover:bg-gray-100">Content 5:</div>
        <div className="cursor-default p-1 hover:bg-gray-100">Content 6:</div>
      </div>
      <div className="dropzone-active pointer-events-none absolute inset-[-7] rounded-[2px]"></div>
    </div>
  );
}

export default memo(TableContentBlock);
