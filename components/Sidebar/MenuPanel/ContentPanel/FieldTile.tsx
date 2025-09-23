import clsx from "clsx";
import { GripVertical } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { FillableFieldType } from "./Fields";
import { WithDraggable } from "@/dnd";
import { TemplateTypes } from "@/interfaces/enum";

interface FieldTileProps {
  field: FillableFieldType;
}

const FieldTile = ({ field }: FieldTileProps) => {
  const [draggedTileId, setDraggedTileId] = useState("");
  const Icon = field.icon;
  const DragImagePreview = field.dragImagePreview;

  useEffect(() => {
    // Preload lazy component so we don't see lagging on drop
    requestIdleCallback(() => {
      void field?.handleComponentPreload?.();
    });
  }, [field]);

  const getDragPayload = useCallback(
    () => field.dragPayload,
    [field.dragPayload],
  );

  const handleOnDragStart = useCallback(
    (e: React.DragEvent) => {
      setDraggedTileId(field.id);
    },
    [field.id],
  );

  const handleOnDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedTileId("");
  }, []);

  return (
    <WithDraggable
      kind={TemplateTypes.Field}
      effectAllowed="move"
      dragImageSelector=".ghost"
      getDragPayload={getDragPayload}
      handleOnDragStart={handleOnDragStart}
      handleOnDragEnd={handleOnDragEnd}
    >
      <div
        className={clsx(
          "pointer-events-auto relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-orange-200",
          draggedTileId === field.id ? "opacity-40" : "group",
        )}
      >
        <DragImagePreview
          width={field.dragPayload.data.overlay?.style.width ?? 100}
          height={field.dragPayload.data.overlay?.style.height ?? 50}
        />
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
