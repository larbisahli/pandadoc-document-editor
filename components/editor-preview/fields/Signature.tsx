import { memo, useMemo, useRef } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { generateAvatarColors } from "@/utils/colors";
import { useAppSelector } from "@/lib/hooks";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { PencilLine } from "lucide-react";

function Signature({ instanceId }: BaseFieldProps) {
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
      className="relative flex h-full w-full rounded-[2px] border outline-none"
    >
      <div className="flex h-full w-full items-center justify-center font-medium">
        <PencilLine className="mr-1" size={16} />
        Signature
      </div>
    </div>
  );
}

export default memo(Signature);
