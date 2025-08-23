import clsx from "clsx";
import * as React from "react";

type Props = { onResize?: (delta: number) => void };

export default function RowResizer({ onResize }: Props) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;

    const onMove = (event: MouseEvent) => {
      const delta = event.clientX - startX;
      onResize?.(delta);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className={clsx(
        "relative cursor-ew-resize",
        "before:absolute before:left-[-1px] before:block before:content-['']",
        "before:h-full before:w-[3px] before:rounded-[2px]",
        "before:transition-colors group-hover/resizer:before:bg-[#24856752] active:before:bg-gray-400",
      )}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
    />
  );
}
