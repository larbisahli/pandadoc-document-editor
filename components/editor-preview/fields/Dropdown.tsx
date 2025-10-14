import { memo, useMemo, useRef } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { generateAvatarColors } from "@/utils/colors";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { ChevronDown } from "lucide-react";

function Dropdown({ instanceId }: BaseFieldProps) {
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
      style={{
        background: color.bgRgba,
        borderColor: color.ringHex,
        color: color.textHex,
      }}
      className="flex h-full w-full items-center justify-between rounded-[2px] border p-1 text-sm font-medium"
    >
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        Please select...
      </span>
      <div className="h-[18px] w-[18px]">
        <ChevronDown size={18} className="mr-2" />
      </div>
    </div>
  );
}

export default memo(Dropdown);
