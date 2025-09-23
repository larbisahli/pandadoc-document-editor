import { memo, useRef, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { Upload, Youtube } from "lucide-react";
import clsx from "clsx";
import { useClickOutside } from "../hooks/useClickOutside";
import BorderWrapper from "./BorderWrapper";

function VideoBlock({ instance }: BaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useClickOutside(blockRef, () => setActive(false));

  return (
    <div
      ref={blockRef}
      onClick={() => setActive(true)}
      className="group relative"
    >
      <BorderWrapper active={active}>
        <div
          className={clsx(
            "flex min-h-[64px] cursor-pointer items-center justify-center bg-[#f7f7f7] text-[#767676]",
            active && "bg-[#e7e7e7]!",
          )}
        >
          <div className="mx-2 text-[#626262]">
            {active ? <Upload size={20} /> : <Youtube size={20} />}
          </div>
          <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
            Click to add a video
          </div>
        </div>
      </BorderWrapper>
    </div>
  );
}

export default memo(VideoBlock);
