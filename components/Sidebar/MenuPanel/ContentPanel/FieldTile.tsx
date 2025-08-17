import clsx from "clsx";
import { GripVertical } from "lucide-react";
import React, { useCallback, useState } from "react";
import { FillableFieldType } from "./FillableFields";
import { WithDraggable } from "@/dnd";

interface FieldTileProps {
  field: FillableFieldType;
}

const FieldTile = ({ field }: FieldTileProps) => {
  const [draggedTileId, setDraggedTileId] = useState("");
  const Icon = field.icon;
  const DragImagePreview = field.dragImagePreview;

  const getDragPayload = useCallback(
    () => field.dragPayload,
    [field.dragPayload],
  );

  return (
    <WithDraggable
      suppressHighlight
      dragImageSelector=".ghost"
      getDragPayload={getDragPayload}
    >
      <div
        draggable
        onDragStart={() => setDraggedTileId(field.id)}
        onDragEnd={() => setDraggedTileId("")}
        className={clsx(
          "shadow-sms relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-orange-200",
          draggedTileId === field.id ? "shadow-sms opacity-40" : "group",
        )}
      >
        <DragImagePreview />
        <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#cc5b0e29] group-hover:flex">
          <GripVertical
            strokeWidth={1.2}
            size={15}
            className="text-[#cc5a0ed6]"
          />
        </div>
        <div className="flex h-full w-full justify-between bg-[#cc5b0e14] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#f5b18414] group-hover:pr-[6px] group-hover:pl-[24px]">
          <span className="text-xs leading-[12px] font-semibold text-gray-700">
            {field.label}
          </span>
          <div className="group-hover:hidden">
            <Icon strokeWidth={1.5} size={20} className="text-[#cc5a0ed6]" />
          </div>
        </div>
      </div>
    </WithDraggable>
  );
};

export default FieldTile;
