import { FieldTextDataType } from "@/interfaces/common";
import { memo } from "react";

interface Props extends FieldTextDataType {
  props?: Record<string, unknown>;
}

function TextField({ props }: Props) {
  return (
    <div className="pointer-events-auto absolute top-0 left-[100px] z-50 h-10 w-10 bg-purple-700">
      Text Field
    </div>
  );
}

export default memo(TextField);
