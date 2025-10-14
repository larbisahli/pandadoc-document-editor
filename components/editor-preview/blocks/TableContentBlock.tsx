import { memo, useRef } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import clsx from "clsx";

function TableContentBlock({ nodeId, instanceId }: BaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={blockRef} className="group relative">
      <div className={clsx("flex flex-col")}>
        <button className="cursor-default! p-1 text-left hover:bg-gray-100">
          Content 1:
        </button>
        <button className="cursor-default! p-1 text-left hover:bg-gray-100">
          Content 2:
        </button>
        <button className="cursor-default! p-1 text-left hover:bg-gray-100">
          Content 3:
        </button>
      </div>
    </div>
  );
}

export default memo(TableContentBlock);
