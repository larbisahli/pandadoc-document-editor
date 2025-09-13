import { OverlayId, TextDataType } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { updateTextAreaFieldContent } from "@/lib/features/instance/instanceSlice";
import { useAppDispatch } from "@/lib/hooks";
import clsx from "clsx";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  overlayId: OverlayId;
  instance: InstanceType;
}

function TextArea({ overlayId, instance }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  const content = (instance.data as TextDataType).content || "";
  const instanceId = instance.id;

  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState<string>(content);

  const onCommit = useCallback(
    (value: string) => {
      dispatch(
        updateTextAreaFieldContent({
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
    if (isActive && ref.current) {
      ref.current.focus();
    }
  }, [isActive]);

  const handleOnclick = () => {
    setIsActive(true);
    handleResizePoint("visible");
  };

  const handleResizePoint = (visibility: string) => {
    const ele = document.getElementById(`resize-point-${overlayId}`);
    if (ele) ele.style.visibility = visibility;
  };

  return (
    <div
      onClick={handleOnclick}
      onMouseLeave={() => setIsActive(false)}
      onBlur={() => handleResizePoint("")}
      className="relative flex h-full w-full border border-orange-500 outline-none"
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
        className={clsx(
          "absolute inset-0 resize-none overflow-hidden p-1 text-sm text-black outline-none",
          !isActive && "pointer-events-none",
        )}
      />
    </div>
  );
}

export default memo(TextArea);
