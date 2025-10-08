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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import { useClickOutside } from "../hooks/useClickOutside";
import { generateAvatarColors } from "@/utils/colors";
import clsx from "clsx";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import {
  Upload,
  Copy,
  CopyPlus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { setActiveInstance } from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { isFreshSince } from "@/utils";

function CollectFiles({ overlayId, instanceId }: BaseFieldProps) {
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
        "flex h-full w-full items-center justify-center rounded-[2px] border p-1 text-sm font-medium",
        active && "z-50 ring-1 ring-current! ring-inset",
      )}
    >
      <div className="mr-2 h-[18px] w-[18px]">
        <Upload size={18} />
      </div>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        Click to upload file
      </span>
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

export default memo(CollectFiles);
