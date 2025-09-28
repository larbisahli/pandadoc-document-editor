import { CalendarDays } from "lucide-react";
import { memo, useMemo, useRef, useState } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { useClickOutside } from "../hooks/useClickOutside";
import { generateAvatarColors } from "@/utils/colors";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import clsx from "clsx";

function Date({ overlayId, instanceId }: BaseFieldProps) {
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

  return (
    <div
      ref={fieldRef}
      onClick={() => setActive(true)}
      style={{
        background: color.bgRgba,
        borderColor: color.ringHex,
        color: color.textHex,
      }}
      className={clsx(
        "relative flex h-full w-full items-center justify-between rounded-[2px] border p-1 text-sm font-medium",
        active && "z-50 ring-1 ring-current! ring-inset",
      )}
    >
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        Select date
      </span>
      <div className="h-[18px] w-[18px]">
        <CalendarDays size={18} />
      </div>
    </div>
  );
}

export default memo(Date);
