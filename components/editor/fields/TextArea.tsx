import { TextDataType } from "@/interfaces/common";
import {
  selectInstance,
  updateInstanceDataField,
} from "@/lib/features/instance/instanceSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import clsx from "clsx";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { BaseFieldProps } from "../canvas/overlays/FieldRegistry";
import { useClickOutside } from "../hooks/useClickOutside";
import { generateAvatarColors } from "@/utils/colors";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { Copy, CopyPlus, SlidersHorizontal, Trash2 } from "lucide-react";
import { setActiveInstance } from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { isFreshSince } from "@/utils";
import { deleteField } from "@/lib/features/thunks/overlayThunks";
import ActionsTooltipPortalWrapper from "@/components/ui/ActionsTooltip/ActionsTooltipPortalWrapper";

function TextArea({ overlayId, instanceId }: BaseFieldProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const instance = useAppSelector((state) => selectInstance(state, instanceId));

  const dispatch = useAppDispatch();

  const byId = useAppSelector(selectRecipientsById);
  const fieldRecipient = instance?.recipientId
    ? byId[instance.recipientId]
    : undefined;

  const content = ((instance.data as TextDataType).content || "") as string;

  const [value, setValue] = useState<string>(content);
  const [active, setActive] = useState(false);
  const [, startTransition] = useTransition();

  const color = useMemo(
    () => generateAvatarColors(fieldRecipient?.color, 0.9),
    [fieldRecipient?.color],
  );

  const onOutside = useCallback(() => {
    setActive(false);
    dispatch(setActiveInstance(null));
  }, [dispatch]);

  useClickOutside(fieldRef, onOutside, { enabled: active });

  // Focus once when freshly dropped
  useEffect(() => {
    if (!isFreshSince(instance?.createdAt)) return;
    startTransition(() => {
      setActive(true);
    });
  }, [instance?.createdAt]);

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
    if (active && inputRef.current) {
      inputRef.current.focus();
    }
  }, [active]);

  const handleOnclick = () => {
    handleResizePoint("visible");
    setActive(true);
  };

  const handleResizePoint = (visibility: string) => {
    const ele = document.getElementById(`resize-point-${overlayId}`);
    if (ele) ele.style.visibility = visibility;
  };

  const handleDelete = () => {
    dispatch(
      deleteField({
        overlayId,
        instanceId,
      }),
    );
  };

  const handleContentProperty = () => {};

  return (
    <div
      ref={fieldRef}
      onClick={handleOnclick}
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
          !active && "pointer-events-none",
        )}
      />
      {!active && !value && <div className="p-1 text-sm">Enter value</div>}
      <ActionsTooltipPortalWrapper
        nodeId={overlayId}
        open={active}
        anchorRef={fieldRef}
        offset={10}
      >
        <ActionsTooltip
          active={active}
          actions={[
            {
              key: "font",
              label: "Who needs to fill this out?",
              icon: () => <div className="text-gray-200">14</div>,
              onSelect: handleContentProperty,
              line: true,
            },
            {
              key: "recipient",
              label: "Who needs to fill this out?",
              icon: () => (
                <div className="flex items-center justify-center">
                  <div
                    style={{ background: color.ringHex }}
                    className="mr-1 h-2 w-2 rounded-full"
                  ></div>
                  Sender
                </div>
              ),
              onSelect: handleContentProperty,
              line: true,
            },
            {
              key: "copy-block",
              label: "Copy (⌘+C)",
              icon: () => <Copy size={22} />,
              onSelect: handleContentProperty,
            },
            {
              key: "duplicate-block",
              label: "Duplicate block",
              icon: () => <CopyPlus size={22} />,
              onSelect: handleContentProperty,
            },
            {
              key: "content-property",
              label: "Properties",
              icon: () => <SlidersHorizontal size={22} />,
              onSelect: handleContentProperty,
            },
            {
              key: "delete",
              label: "Delete",
              icon: () => <Trash2 size={22} />,
              danger: true,
              onSelect: handleDelete,
            },
          ]}
        />
      </ActionsTooltipPortalWrapper>
    </div>
  );
}

export default memo(TextArea);
