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
import { useClickOutside } from "../hooks/useClickOutside";
import { generateAvatarColors } from "@/utils/colors";
import { selectRecipientsById } from "@/lib/features/recipient/recipientSlice";
import clsx from "clsx";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import {
  CalendarDays,
  Copy,
  CopyPlus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { setActiveInstance } from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { isFreshSince } from "@/utils";
import { deleteField } from "@/lib/features/thunks/overlayThunks";
import ActionsTooltipPortalWrapper from "@/components/ui/ActionsTooltip/ActionsTooltipPortalWrapper";

// http://react-dates.github.io/react-dates/?path=/story/singledatepicker-sdp--default
function Date({ overlayId, instanceId }: BaseFieldProps) {
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

  const ignoreSelectors = useMemo(() => ["[data-actions-toolbar]"], []);

  useClickOutside(fieldRef, onOutside, { enabled: active, ignoreSelectors });

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
        background: color.bgRgba,
        borderColor: color.ringHex,
        color: color.textHex,
      }}
      className={clsx(
        "relative flex h-full w-full items-center justify-between rounded-[2px] border p-1 text-sm font-medium",
        active && "z-50 ring-1 ring-current! ring-inset",
      )}
    >
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        MM / DD / YYYY
      </span>
      <div className="h-[18px] w-[18px] text-gray-600">
        <CalendarDays size={18} />
      </div>
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

export default memo(Date);
