import { memo, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { Image, Upload } from "lucide-react";

function ImageBlock({ props }: BaseBlockProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative">
      <div className="flex min-h-[64px] cursor-pointer items-center justify-center bg-[#f7f7f7] text-[#767676] active:bg-[#e7e7e7]">
        <div className="mx-2 text-[#626262]">
          {/* <Upload size={20}/> */}
          <Image size={20} />
        </div>
        <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
          Click to upload an image
        </div>
      </div>
      <div className="dropzone-active pointer-events-none absolute inset-[-7] rounded-[2px]"></div>
    </div>
  );
}

export default memo(ImageBlock);
