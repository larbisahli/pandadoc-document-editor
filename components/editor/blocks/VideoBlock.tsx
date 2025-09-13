import { memo } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";

function VideoBlock({ props }: BaseBlockProps) {
  return <div className="bg-blue-200">video</div>;
}

export default memo(VideoBlock);
