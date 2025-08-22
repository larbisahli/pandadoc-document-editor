import { TableContentType } from "@/interfaces/common";
import { memo } from "react";

interface Props extends TableContentType {
  props?: Record<string, unknown>;
}

function TableContentBlock({ props }: Props) {
  return <div>table of content</div>;
}

export default memo(TableContentBlock);
