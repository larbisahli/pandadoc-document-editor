import { memo, useRef } from "react";
import { YoutubeIcon } from "lucide-react";
import clsx from "clsx";
import YouTube from "react-youtube";

function VideoBlock() {
  const blockRef = useRef<HTMLDivElement>(null);

  const videoId = "69bkCjl4jkQ";
  const autoplay = 0;

  return (
    <div ref={blockRef} className="group relative z-10">
      {!videoId ? (
        <div
          className={clsx(
            "flex min-h-[64px] cursor-pointer items-center justify-center bg-[#f7f7f7] text-[#767676]",
          )}
        >
          <div className="mx-2 text-[#626262]">
            <YoutubeIcon size={20} />
          </div>
          <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
            Click to add a video
          </div>
        </div>
      ) : (
        <div>
          <YouTube
            videoId={videoId}
            opts={{
              height: "403",
              width: "100%",
              playerVars: { autoplay },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default memo(VideoBlock);
