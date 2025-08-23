import { useAppDispatch } from "@/lib/hooks";
import { getResizeEffect } from "@/utils/resize";
import React, { memo } from "react";
import RowResizer from "./RowResizer";
import { NodeId, PageId } from "@/interfaces/common";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { updateLayoutCalculatedWidth } from "@/lib/features/layout/layoutSlice";

interface Props {
  nodeId: NodeId;
  pageId: PageId;
  nodeIds: NodeId[];
  index: number;
  setResizeEffect: React.Dispatch<React.SetStateAction<any>>;
}

function RowResizerWrapper({
  pageId,
  nodeId,
  nodeIds,
  index,
  setResizeEffect,
}: Props) {
  const dispatch = useAppDispatch();

  // Stable debounced dispatcher
  const onResizeDebounced = useDebouncedCallback(
    (effect) => {
      if (effect) {
        // LEFT
        const rowLeftEl = document.getElementById(
          effect?.leftId ?? "",
        ) as HTMLDivElement | null;
        // dispatch(updateLayoutCalculatedWidth({pageId, nodeId: effect?.leftId, width: rowLeftEl?.style.width}));
        // LEFT
        const rowRightEl = document.getElementById(
          effect?.rightId ?? "",
        ) as HTMLDivElement | null;
        // dispatch(updateLayoutCalculatedWidth({pageId, nodeId: effect?.rightId, width: rowRightEl?.style.width}));
        console.log(
          "resize effect",
          { pageId, nodeId: effect?.leftId, width: rowLeftEl?.style.width },
          { pageId, nodeId: effect?.rightId, width: rowRightEl?.style.width },
        );
      }
    },
    250,
    [nodeIds, index, dispatch],
  );

  return (
    <RowResizer
      onResize={(delta: number) => {
        const effect = getResizeEffect(nodeIds, index, delta);
        setResizeEffect(effect);
        onResizeDebounced(effect);
      }}
    />
  );
}

export default memo(RowResizerWrapper);
