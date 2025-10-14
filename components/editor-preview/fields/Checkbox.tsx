import { memo, useMemo, useRef } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { generateAvatarColors } from "@/utils/colors";
import clsx from "clsx";

function Checkbox({ instanceId }: BaseFieldProps) {
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
        borderColor: color.ringHex,
        color: color.textHex,
      }}
      className={clsx(
        "relative flex h-full w-full rounded-[2px] border p-1 outline-none",
      )}
    >
      <div>
        <input type="checkbox" className="h-full w-full" />
      </div>
    </div>
  );
}

export default memo(Checkbox);
