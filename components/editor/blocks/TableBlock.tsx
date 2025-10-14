"use client";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
import BorderWrapper from "./BorderWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import {
  Copy,
  CopyPlus,
  ListPlus,
  LockKeyholeOpen,
  MessageSquarePlus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { usePage } from "../canvas/context/PageContext";
import { deleteBlockRef } from "@/lib/features/thunks/documentThunks";
import { setActiveInstance } from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { isFreshSince } from "@/utils";
import * as React from "react";
import DynamicEditableTable from "./PricingTable";
import ActionsTooltipPortalWrapper from "@/components/ui/ActionsTooltip/ActionsTooltipPortalWrapper";

// https://github.com/TanStack/table
// https://www.npmjs.com/package/react-table
function TableBlock({ nodeId, instanceId }: BaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);

  const { pageId } = usePage();

  const instance = useAppSelector((state) => selectInstance(state, instanceId));

  const dispatch = useAppDispatch();

  const [active, setActive] = useState(false);
  const [, startTransition] = useTransition();

  const onOutside = useCallback(() => {
    setActive(false);
    dispatch(setActiveInstance(null));
  }, [dispatch]);

  const ignoreSelectors = useMemo(
    () => [
      "[data-actions-toolbar]",
      "[data-rich-editor-toolbar]",
      "#richEditorToolbar",
    ],
    [],
  );

  useClickOutside(blockRef, onOutside, { enabled: active, ignoreSelectors });

  // Focus once when freshly dropped
  useEffect(() => {
    if (!isFreshSince(instance?.createdAt)) return;
    startTransition(() => {
      setActive(true);
    });
  }, [instance?.createdAt]);

  const handleDelete = () => {
    dispatch(
      deleteBlockRef({
        pageId,
        nodeId,
        instanceId,
      }),
    );
  };

  const handleContentProperty = () => {};

  return (
    <div
      ref={blockRef}
      className="group relative"
      onClick={() => setActive(true)}
    >
      <BorderWrapper active={active}>
        <div
          className={clsx("flex flex-col", !active && "pointer-events-none")}
        >
          <DynamicEditableTable />
        </div>
      </BorderWrapper>
      <ActionsTooltipPortalWrapper
        open={active}
        anchorRef={blockRef}
        offset={20}
      >
        <ActionsTooltip
          active={active}
          actions={[
            {
              key: "add-to-library",
              label: "Add to library",
              icon: () => <ListPlus size={22} />,
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
              key: "add-comment",
              label: "Add a comment",
              icon: () => <MessageSquarePlus size={22} />,
              onSelect: handleContentProperty,
              line: true,
            },
            {
              key: "content-property",
              label: "Properties",
              icon: () => <SlidersHorizontal size={22} />,
              onSelect: handleContentProperty,
            },
            {
              key: "restriction",
              label: "Restrict users from editing and/or removing this block",
              icon: () => <LockKeyholeOpen size={22} />,
              onSelect: handleContentProperty,
              line: true,
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

export default memo(TableBlock);
