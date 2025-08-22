import { VideoDataType } from "@/interfaces/common";
import { memo } from "react";

interface Props extends VideoDataType {
  props?: Record<string, unknown>;
}

function VideoBlock({ props }: Props) {
  return <div>video</div>;
}

export default memo(VideoBlock);
