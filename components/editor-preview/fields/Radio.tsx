import { memo, useMemo, useRef } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { generateAvatarColors } from "@/utils/colors";

function Radio({ instanceId }: BaseFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);

  const instance = useAppSelector((state) => selectInstance(state, instanceId));

  const byId = useAppSelector(selectRecipientsById);
  const fieldRecipient = instance?.recipientId
    ? byId[instance.recipientId]
    : undefined;

  const color = useMemo(
    () => generateAvatarColors(fieldRecipient?.color, 0.9),
    [fieldRecipient?.color],
  );

  return (
    <div
      ref={fieldRef}
      draggable
      style={{
        background: color.bgRgba,
        borderColor: color.textHex,
        color: color.textHex,
      }}
      className="relative flex h-full w-full flex-col items-center justify-center rounded-[2px] border-2 border-dashed p-[5px] text-sm outline-none"
    >
      <div className="flex items-center justify-center">
        <div
          style={{
            background: color.bgRgba,
            borderColor: color.textHex,
          }}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-sm border"
        >
          <div className="h-[20px] w-[20px] rounded-full border bg-white"></div>
        </div>
        <span className="mx-1 font-normal text-gray-800">Option 1</span>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <div
          style={{
            background: color.bgRgba,
            borderColor: color.textHex,
          }}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-sm border"
        >
          <div className="h-[20px] w-[20px] rounded-full border bg-white"></div>
        </div>
        <span className="mx-1 font-normal text-gray-800">Option 2</span>
      </div>
    </div>
  );
}

export default memo(Radio);
