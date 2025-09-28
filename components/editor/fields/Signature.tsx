import { PencilLine } from "lucide-react";
import { memo, useMemo, useRef, useState } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { generateAvatarColors } from "@/utils/colors";
import { useAppSelector } from "@/lib/hooks";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";

function Signature({ overlayId, instanceId }: BaseFieldProps) {
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
        "relative flex h-full w-full rounded-[2px] border outline-none",
        active && "z-50 ring-1 ring-current! ring-inset",
      )}
    >
      <div className="flex h-full w-full items-center justify-center font-medium">
        <PencilLine className="mr-1" size={16} />
        Signature
      </div>
    </div>
  );
}

export default memo(Signature);
