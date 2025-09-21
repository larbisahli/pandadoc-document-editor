import { OverlayId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { CalendarDays } from "lucide-react";
import { memo } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function Radio({ overlayId, instance }: Props) {
  return (
    <div className="relative flex h-full w-full items-center justify-between border border-green-500 bg-green-200/30 p-1 outline-none">
      <span className="text-xs text-black">Radio</span>
      <CalendarDays className="h-5 w-5 text-gray-600" />
    </div>
  );
}

export default memo(Radio);
