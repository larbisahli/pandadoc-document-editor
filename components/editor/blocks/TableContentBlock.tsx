import { memo, useEffect, useRef, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
import BorderWrapper from "./BorderWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { Trash2 } from "lucide-react";
import { usePage } from "../canvas/context/PageContext";
import { deleteBlockRef } from "@/lib/features/thunks/documentThunks";

function TableContentBlock({ nodeId, instanceId }: BaseBlockProps) {
  const { pageId } = usePage();
  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const dispatch = useAppDispatch();

  const blockRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useClickOutside(blockRef, () => setActive(false));

  // useEffect(() => {
  //   if(!instance?.data?.content) {
  //     setActive(true)
  //   }
  // }, [])

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
    <div
      ref={blockRef}
      className="group relative"
      onClick={() => setActive(true)}
    >
      <BorderWrapper active={active}>
        <div
          className={clsx("flex flex-col", !active && "pointer-events-none")}
        >
          <button className="cursor-default! p-1 text-left hover:bg-gray-100">
            Content 1:
          </button>
          <button className="cursor-default! p-1 text-left hover:bg-gray-100">
            Content 2:
          </button>
          <button className="cursor-default! p-1 text-left hover:bg-gray-100">
            Content 3:
          </button>
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

export default memo(TableContentBlock);
