import { memo, useMemo, useRef } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { generateAvatarColors } from "@/utils/colors";
import clsx from "clsx";
import { Upload } from "lucide-react";

function CollectFiles({ instanceId }: BaseFieldProps) {
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
      className={clsx(
        "flex h-full w-full items-center justify-center rounded-[2px] border p-1 text-sm font-medium",
      )}
    >
      <div className="mr-2 h-[18px] w-[18px]">
        <Upload size={18} />
      </div>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        Click to upload file
      </span>
    </div>
  );
}

export default memo(CollectFiles);
