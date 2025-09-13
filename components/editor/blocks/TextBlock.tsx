import { memo } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";

function TextBlock({ instance }: BaseBlockProps) {
  return <div className="bg-blue-200">Block</div>;
}

export default memo(TextBlock);
