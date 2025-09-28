import { memo, useRef, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
import BorderWrapper from "./BorderWrapper";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";

function TableContentBlock({ instanceId }: BaseBlockProps) {
  const instance = useAppSelector((state) => selectInstance(state, instanceId));

  const blockRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useClickOutside(blockRef, () => setActive(false));

  return (
    <div
      ref={blockRef}
      className="group relative"
      onClick={() => setActive(true)}
    >
      <BorderWrapper active={active}>
        <div
          className={clsx("flex flex-col", !active && "pointer-events-none")}
        >
          <button className="cursor-default! p-1 text-left hover:bg-gray-100">
            Content 1:
          </button>
          <button className="cursor-default! p-1 text-left hover:bg-gray-100">
            Content 2:
          </button>
          <button className="cursor-default! p-1 text-left hover:bg-gray-100">
            Content 3:
          </button>
        </div>
      </BorderWrapper>
    </div>
  );
}

export default memo(TableContentBlock);
