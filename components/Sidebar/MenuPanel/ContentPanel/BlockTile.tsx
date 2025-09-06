import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { ContentBlockType } from "./Blocks";
import React, { useCallback, useState } from "react";
import { WithDraggable } from "@/dnd";

interface BlockTileProps {
  block: ContentBlockType;
}

const BlockTile = ({ block }: BlockTileProps) => {
  const [draggedTileId, setDraggedTileId] = useState("");
  const Icon = block.icon;

  const getDragPayload = useCallback(
    () => block.dragPayload,
    [block.dragPayload],
  );

  const handleOnDragEnd = useCallback(() => {
    setDraggedTileId("");
  }, []);

  const handleOnDragStart = useCallback(
    (e: React.DragEvent) => {
      setDraggedTileId(block.id);
      const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
      ghost.style.background = "#fefefe";
      ghost.style.border = "1px solid #cdcdcd";
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 0, 0);
      // Cleanup
      setTimeout(() => document.body.removeChild(ghost), 0);
    },
    [block.id],
  );

  return (
    <WithDraggable
      handleOnDragStart={handleOnDragStart}
      handleOnDragEnd={handleOnDragEnd}
      getDragPayload={getDragPayload}
      className="h-[50px] max-w-[118px]"
    >
      <div
        className={clsx(
          "shadow-sms relative flex cursor-move items-center rounded-[3px] border border-gray-200",
          draggedTileId === block.id ? "opacity-40 shadow-xs" : "group",
        )}
      >
        <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#76767629] group-hover:flex">
          <GripVertical
            strokeWidth={1.2}
            size={15}
            className="text-[#1f1f1fc5]"
          />
        </div>
        <div className="flex h-full w-full justify-between bg-[#76767614] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#76767614] group-hover:pr-[6px] group-hover:pl-[24px]">
          <span className="text-xs leading-[12px] font-semibold text-gray-700">
            {block.label}
          </span>
          <div className="group-hover:hidden">
            <Icon strokeWidth={1.5} size={20} className="text-[#313131c5]" />
          </div>
        </div>
      </div>
    </WithDraggable>
  );
};

export default BlockTile;
