import { OverlayId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { CalendarDays, Upload } from "lucide-react";
import { memo } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function CollectFiles({ overlayId, instance }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center border border-green-500 bg-green-200/30 p-1 text-sm font-semibold text-gray-800 opacity-70 outline-none">
      <Upload size={18} className="mr-2" />
      <span>Click to upload file</span>
    </div>
  );
}

export default memo(CollectFiles);
