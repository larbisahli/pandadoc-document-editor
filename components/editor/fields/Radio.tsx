import { memo, useEffect, useMemo, useRef, useState } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { useClickOutside } from "../hooks/useClickOutside";
import { generateAvatarColors } from "@/utils/colors";
import clsx from "clsx";
import { Plus } from "lucide-react";

function Radio({ overlayId, instanceId }: BaseFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);

  const instance = useAppSelector((state) => selectInstance(state, instanceId));

  const byId = useAppSelector(selectRecipientsById);
  const fieldRecipient = instance?.recipientId
    ? byId[instance.recipientId]
    : undefined;

  const [active, setActive] = useState(true);
  useClickOutside(fieldRef, () => setActive(false));

  const color = useMemo(
    () => generateAvatarColors(fieldRecipient?.color, 0.9),
    [fieldRecipient?.color],
  );

  useEffect(() => {
    const element = document.getElementById(`resizer-${overlayId}`);
    if (element) {
      element.style.width = "auto";
      element.style.height = "auto";
    }
  }, [overlayId]);

  return (
    <div
      ref={fieldRef}
      onMouseDownCapture={() => setActive(true)}
      draggable
      style={{
        background: color.bgRgba,
        borderColor: color.textHex,
        color: color.textHex,
      }}
      className={clsx(
        "relative flex h-full w-full flex-col items-center justify-center rounded-[2px] border-2 border-dashed p-[5px] text-sm outline-none",
        !active && "border-0 border-transparent! bg-transparent!",
        active && "z-50",
      )}
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
      {active && (
        <div className="flex w-full">
          <button className="p-1">
            <Plus size={20} className="text-blue-600" />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(Radio);
