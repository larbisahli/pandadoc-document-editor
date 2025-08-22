import { ImageDataType } from "@/interfaces/common";
import { memo } from "react";

interface Props extends ImageDataType {
  props?: Record<string, unknown>;
}

function ImageBlock({ props }: Props) {
  return <div>image</div>;
}

export default memo(ImageBlock);
