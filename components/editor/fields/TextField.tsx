import { FieldTextDataType } from "@/interfaces/common";
import { memo } from "react";

interface Props extends FieldTextDataType {
  props?: Record<string, unknown>;
}

function TextField({ props }: Props) {
  return (
    <div
      contentEditable={false}
      className="pointer-events-autos absolute z-50 h-[100px] w-[200px] border border-red-500 p-1 text-sm text-blue-600"
    >
      <textarea placeholder="Enter value" disabled className="w-full" />
    </div>
  );
}

export default memo(TextField);
