"use client";
import { memo, useRef } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import * as React from "react";

// https://github.com/TanStack/table
// https://www.npmjs.com/package/react-table
function TableBlock({ nodeId, instanceId }: BaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={blockRef} className="group relative">
      <div className="flex flex-col">Table</div>
    </div>
  );
}

export default memo(TableBlock);
