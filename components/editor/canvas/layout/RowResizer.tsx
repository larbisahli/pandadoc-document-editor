import clsx from "clsx";
import * as React from "react";

type Props = {
  onResize?: (delta: number) => void;
  onResizeEnd?: (delta: number) => void;
};

function RowResizer({ onResize, onResizeEnd }: Props) {
  const startXRef = React.useRef<number | null>(null);
  const lastDeltaRef = React.useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    lastDeltaRef.current = 0;

    const onMove = (event: MouseEvent) => {
      if (startXRef.current == null) return;
      const delta = event.clientX - startXRef.current;
      lastDeltaRef.current = delta;
      onResize?.(delta);
    };

    const onUp = () => {
      if (startXRef.current != null) {
        onResizeEnd?.(lastDeltaRef.current);
      }
      startXRef.current = null;
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

export default React.memo(RowResizer);
