import { TextDataType } from "@/interfaces/common";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { useAppSelector } from "@/lib/hooks";
import { memo, useEffect, useMemo, useState } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { generateAvatarColors } from "@/utils/colors";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";

function TextArea({ instanceId }: BaseFieldProps) {
  const instance = useAppSelector((state) => selectInstance(state, instanceId));

  const byId = useAppSelector(selectRecipientsById);
  const fieldRecipient = instance?.recipientId
    ? byId[instance.recipientId]
    : undefined;

  const content = ((instance.data as TextDataType).content || "") as string;

  const [value, setValue] = useState<string>(content);

  const color = useMemo(
    () => generateAvatarColors(fieldRecipient?.color, 0.9),
    [fieldRecipient?.color],
  );

  // Keep in sync on content changes
  useEffect(() => setValue(content as string), [content]);

  return (
    <div
      style={{
        borderColor: color.ringHex,
        color: color.textHex,
      }}
      className="relative flex h-full w-full rounded-[2px] border outline-none"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="absolute inset-0 resize-none overflow-hidden p-[6px] text-sm text-black outline-none"
      />
      {!value && <div className="p-1 text-sm">Enter value</div>}
    </div>
  );
}

export default memo(TextArea);
