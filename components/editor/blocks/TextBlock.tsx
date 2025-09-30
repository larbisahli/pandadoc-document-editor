import { memo, useCallback, useEffect, useRef, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import clsx from "clsx";
import BorderWrapper from "./BorderWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectInstance,
  updateInstanceDataField,
} from "@/lib/features/instance/instanceSlice";
import { TextDataType } from "@/interfaces/common";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { Trash2 } from "lucide-react";
import { deleteBlockRef } from "@/lib/features/editor/thunks/documentThunks";
import { usePage } from "../canvas/context/PageContext";

function TextBlock({ nodeId, instanceId }: BaseBlockProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const { pageId } = usePage();
  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const dispatch = useAppDispatch();

  const [active, setActive] = useState(false);
  const [value, setValue] = useState<string>("");

  // Set Init value
  useEffect(() => {
    if (divRef.current) {
      const text = (instance?.data as TextDataType)?.content ?? "";
      divRef.current.innerText = text;
      setValue(text);
      if (!text) {
        setActive(true);
      }
    }
  }, []);

  const handleFocusChange = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.type === "focus") {
      setActive(true);
    } else {
      if (divRef.current) {
        const text = (instance?.data as TextDataType)?.content ?? "";
        divRef.current.innerText = text;
        setValue(text);
      }
      setActive(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setValue(e.currentTarget.innerText);
  };

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

  useEffect(() => {
    if (active && divRef.current) {
      divRef.current.focus();
    }
  }, [active]);

  useEffect(() => {
    const id = setTimeout(() => {
      const text = (instance?.data as TextDataType)?.content ?? "";
      if (value !== text) onCommit(value);
    }, 300);
    return () => clearTimeout(id);
  }, [value, instance, onCommit]);

  const handleDelete = () => {
    dispatch(
      deleteBlockRef({
        pageId,
        nodeId,
        instanceId,
      }),
    );
  };

  return (
    <div className="group relative">
      <BorderWrapper active={active}>
        <div className="relative">
          <div
            ref={divRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={handleFocusChange}
            onBlur={handleFocusChange}
            onInput={handleInput}
            className={clsx(
              "w-full overflow-hidden outline-none",
              !active && "cursor-pointer",
            )}
          />
        </div>
      </BorderWrapper>
      <ActionsTooltip
        active={active}
        actions={[
          {
            key: "delete",
            label: "Delete",
            icon: <Trash2 size={18} />,
            danger: true,
            onSelect: handleDelete,
          },
        ]}
      />
    </div>
  );
}

export default memo(TextBlock);
