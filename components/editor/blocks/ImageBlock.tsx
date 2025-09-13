import { memo } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";

function ImageBlock({ props }: BaseBlockProps) {
  return <div className="bg-blue-200">image</div>;
}

export default memo(ImageBlock);
