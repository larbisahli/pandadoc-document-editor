import { OverlayId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { CalendarDays } from "lucide-react";
import { memo } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function CollectFiles({ overlayId, instance }: Props) {
  return (
    <div className="relative flex h-full w-full items-center justify-between border border-green-500 bg-green-200/30 p-1 outline-none">
      <span className="text-xs text-black">CollectFiles</span>
    </div>
  );
}

export default memo(CollectFiles);
