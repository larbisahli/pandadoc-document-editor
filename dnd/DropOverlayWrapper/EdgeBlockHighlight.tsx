import clsx from "clsx";
import { SideEnum } from "./useEdgeHover";
import { memo } from "react";

const BASE =
  "absolute z-50 pointer-events-none transition-colors duration-150 bg-[#5b6cd4]";
const LINES: Array<[SideEnum, string]> = [
  [SideEnum.TOP, "w-[99%] h-[2px] top-0 left-0 right-0 mx-auto -translate-y-2"],
  [
    SideEnum.LEFT,
    "h-[99%] w-[2px] top-0 left-0 bottom-0 my-auto -translate-x-2",
  ],
  [
    SideEnum.RIGHT,
    "h-[99%] w-[2px] top-0 right-0 bottom-0 my-auto translate-x-2",
  ],
  [
    SideEnum.BOTTOM,
    "w-[99%] h-[2px] bottom-0 left-0 right-0 mx-auto translate-y-2",
  ],
];

function EdgeBlockHighlight({ side }: { side: string | null }) {
  return (
    <>
      {LINES.map(([position, className]) => (
        <div
          key={position}
          className={clsx(
            BASE,
            className,
            side === position ? "opacity-100" : "opacity-30",
          )}
        />
      ))}
    </>
  );
}

export default memo(EdgeBlockHighlight);
