import { memo } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";

function TableContentBlock({ props }: BaseBlockProps) {
  return <div className="bg-blue-200">table of content</div>;
}

export default memo(TableContentBlock);
