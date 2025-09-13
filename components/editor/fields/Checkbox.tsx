import { OverlayId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { memo } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function Checkbox({ overlayId, instance }: Props) {
  return (
    <div className="relative flex h-full w-full border border-orange-500 p-1 outline-none">
      <input type="checkbox" className="h-full w-full" />
    </div>
  );
}

export default memo(Checkbox);
