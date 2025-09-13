import { OverlayId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { PencilLine } from "lucide-react";
import { memo } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function Signature({ overlayId, instance }: Props) {
  return (
    <div className="relative flex h-full w-full border border-orange-500 outline-none">
      <div className="flex h-full w-full items-center justify-center bg-orange-200/50 font-medium text-orange-700">
        <PencilLine className="mr-1" size={16} />
        Signature
      </div>
    </div>
  );
}

export default memo(Signature);
