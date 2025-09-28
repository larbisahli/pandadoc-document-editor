import { TextDataType } from "@/interfaces/common";
import {
  selectInstance,
  updateInstanceDataField,
} from "@/lib/features/instance/instanceSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import clsx from "clsx";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useClickOutside } from "../hooks/useClickOutside";
import { generateAvatarColors } from "@/utils/colors";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";

function TextArea({ overlayId, instanceId }: BaseFieldProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const dispatch = useAppDispatch();

  const [active, setActive] = useState(false);
  useClickOutside(fieldRef, () => setActive(false));

  const content = (instance.data as TextDataType).content || "";

  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState<string>(content);

  const onCommit = useCallback(
    (value: string) => {
      dispatch(
        updateInstanceDataField({
          data: { content: value },
          instanceId,
        }),
      );
    },
    [dispatch, instanceId],
  );

  // Keep in sync on content changes
  useEffect(() => setValue(content as string), [content]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (value !== content) onCommit(value);
    }, 500);
    return () => clearTimeout(id);
  }, [value, content, onCommit]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleOnclick = () => {
    setIsActive(true);
    handleResizePoint("visible");
    setActive(true);
  };

  const handleResizePoint = (visibility: string) => {
    const ele = document.getElementById(`resize-point-${overlayId}`);
    if (ele) ele.style.visibility = visibility;
  };

  return (
    <div
      ref={fieldRef}
      onClick={handleOnclick}
      onMouseLeave={() => setIsActive(false)}
      onBlur={() => handleResizePoint("")}
      style={{
        borderColor: color.ringHex,
        background: active || value ? "transparent" : color.bgRgba,
        color: color.textHex,
      }}
      className={clsx(
        "relative flex h-full w-full rounded-[2px] border outline-none",
        active && "z-50 border-transparent! ring-2 ring-current ring-inset",
      )}
    >
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={clsx(
          "absolute inset-0 resize-none overflow-hidden p-[6px] text-sm text-black outline-none",
          !isActive && "pointer-events-none",
        )}
      />
      {!active && !value && <div className="p-1 text-sm">Enter value</div>}
    </div>
  );
}

export default memo(TextArea);
