import { memo, useRef } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { Image as ImageIcon } from "lucide-react";

import clsx from "clsx";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import Image from "next/image";
import { ImageDataType } from "@/interfaces/common";

function ImageBlock({ instanceId }: BaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const data = instance.data as ImageDataType;

  return (
    <div ref={blockRef} className="group relative">
      <div
        ref={wrapperRef}
        role="button"
        tabIndex={0}
        className={clsx(
          "relative flex w-full cursor-pointer items-center justify-center overflow-hidden bg-[#f7f7f7] text-[#767676]",
          !data?.url && "min-h-[64px]",
        )}
        aria-label="Click to upload an image"
        // style={
        //   previewUrl && heightPx ? { height: `${heightPx}px` } : undefined
        // }
      >
        {!data?.url ? (
          <>
            <div className="mx-2 text-[#626262]">
              <ImageIcon size={20} />
            </div>
            <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
              Click to upload an image
            </div>
          </>
        ) : (
          <Image
            src={data?.url}
            priority
            alt="Selected image preview"
            width={data.width}
            height={data.height}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y6vYf8AAAAASUVORK5CYII="
            className="object-contain"
          />
        )}
      </div>
    </div>
  );
}

export default memo(ImageBlock);
