import { OverlayId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { memo } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function Radio({ overlayId, instance }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center border border-green-500 bg-green-200/30 p-1 text-sm text-gray-800 opacity-70 outline-none">
      <div className="my-1 flex items-center justify-center">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm border border-gray-900 bg-white">
          <div className="h-[20px] w-[20px] rounded-full border"></div>
        </div>
        <span className="mx-1 font-normal">Option 1</span>
      </div>
      <div className="my-1 flex items-center justify-center">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm border border-gray-900 bg-white">
          <div className="h-[20px] w-[20px] rounded-full border"></div>
        </div>
        <span className="mx-1 font-normal">Option 2</span>
      </div>
    </div>
  );
}

export default memo(Radio);
