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
import { generateAvatarColors } from "@/utils/colors";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { Copy, CopyPlus, SlidersHorizontal, Trash2 } from "lucide-react";
import { setActiveInstance } from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { isFreshSince } from "@/utils";
import { deleteField } from "@/lib/features/thunks/overlayThunks";

function Checkbox({ overlayId, instanceId }: BaseFieldProps) {
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
      onClick={() => setActive(true)}
      style={{
        borderColor: color.ringHex,
        color: color.textHex,
      }}
      className={clsx(
        "relative flex h-full w-full rounded-[2px] border p-1 outline-none",
        active && "z-50 ring-1 ring-current! ring-inset",
      )}
    >
      <div>
        <input type="checkbox" className="h-full w-full" />
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

export default memo(Checkbox);
