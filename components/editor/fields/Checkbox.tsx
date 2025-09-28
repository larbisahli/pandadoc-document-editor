import { memo, useMemo, useRef, useState } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { generateAvatarColors } from "@/utils/colors";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";

function Checkbox({ overlayId, instanceId }: BaseFieldProps) {
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
        borderColor: color.ringHex,
        color: color.textHex,
      }}
      className={clsx(
        "relative flex h-full w-full rounded-[2px] border p-1 outline-none",
        active && "z-50 ring-1 ring-current! ring-inset",
      )}
    >
      <input type="checkbox" className="h-full w-full" />
    </div>
  );
}

export default memo(Checkbox);
