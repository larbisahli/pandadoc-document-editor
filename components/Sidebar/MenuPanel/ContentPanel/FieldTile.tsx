import clsx from "clsx";
import { GripVertical } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FillableFieldType } from "./Fields";
import { WithDraggable } from "@/components/dnd";
import { Templates, TemplateTypes } from "@/interfaces/enum";
import { useAppSelector } from "@/lib/hooks";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { FieldTemplateType } from "@/interfaces/template";
import { selectActiveRecipient } from "@/lib/features/recipient/recipientSlice";
import { generateAvatarColors, hexToRgba } from "@/utils/colors";

interface FieldTileProps {
  field: FillableFieldType;
  templateId: Templates;
}

const FieldTile = ({ field, templateId }: FieldTileProps) => {
  const template = useAppSelector((state) =>
    selectTemplate(state, templateId),
  ) as FieldTemplateType;

  const activeRecipient = useAppSelector(selectActiveRecipient);

  const [draggedTileId, setDraggedTileId] = useState("");

  const color = useMemo(
    () => generateAvatarColors(activeRecipient?.color, 0.5),
    [activeRecipient?.color],
  );

  const Icon = field.icon;
  const DragImagePreview = field.dragImagePreview;

  useEffect(() => {
    // Preload lazy component so we don't see lagging on drop
    requestIdleCallback(() => {
      void field?.componentPreload?.();
    });
  }, [field]);

  const getDragPayload = useCallback(
    () => ({
      ...field.dragPayload,
      style: {
        width: template.propsSchema.width!,
        height: template.propsSchema.height!,
      },
    }),
    [field.dragPayload, template],
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
        style={{ borderColor: color.ringHex }}
        className={clsx(
          "pointer-events-auto relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border",
          draggedTileId === field.id ? "opacity-40" : "group",
        )}
      >
        <DragImagePreview
          width={template.propsSchema?.width ?? 100}
          height={template.propsSchema?.height ?? 50}
        />
        <div
          style={{ background: hexToRgba(color.ringHex, 0.3) }}
          className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center group-hover:flex"
        >
          <GripVertical
            strokeWidth={1.2}
            size={15}
            style={{ color: color.textHex }}
          />
        </div>
        <div
          style={{ background: color.bgRgba }}
          className="flex h-full w-full justify-between px-[9px] py-[10px] transition-all duration-75 group-hover:pr-[6px] group-hover:pl-[24px]"
        >
          <span className="text-xs leading-[12px] font-semibold text-gray-700">
            {field.label}
          </span>
          <div className="group-hover:hidden">
            <Icon
              strokeWidth={1.5}
              size={20}
              style={{ color: color.textHex }}
            />
          </div>
        </div>
      </div>
    </WithDraggable>
  );
};

export default FieldTile;
