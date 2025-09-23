import { OverlayId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { CalendarDays, ChevronDown } from "lucide-react";
import { memo } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function Dropdown({ overlayId, instance }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-between border border-green-500 bg-green-200/30 text-sm font-semibold text-gray-800 opacity-70 outline-none">
      <span className="px-1">Please select...</span>
      <ChevronDown size={18} className="mr-2" />
    </div>
  );
}

export default memo(Dropdown);
