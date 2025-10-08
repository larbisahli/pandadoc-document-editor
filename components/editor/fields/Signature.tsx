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
import { generateAvatarColors } from "@/utils/colors";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import {
  PencilLine,
  Copy,
  CopyPlus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { setActiveInstance } from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { isFreshSince } from "@/utils";

// https://github.com/uiwjs/react-signature

function Signature({ overlayId, instanceId }: BaseFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);

  const instance = useAppSelector((state) => selectInstance(state, instanceId));

  const dispatch = useAppDispatch();

  const byId = useAppSelector(selectRecipientsById);
  const fieldRecipient = instance?.recipientId
    ? byId[instance.recipientId]
    : undefined;

  const [active, setActive] = useState(false);
  const [, startTransition] = useTransition();

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

  const color = useMemo(
    () => generateAvatarColors(fieldRecipient?.color, 0.9),
    [fieldRecipient?.color],
  );

  const handleDelete = () => {
    // dispatch(deleteBlockRef({ pageId, nodeId, instanceId }));
  };

  const handleContentProperty = () => {};

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
      <ActionsTooltip
        active={active}
        actions={[
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
    </div>
  );
}

export default memo(Signature);
