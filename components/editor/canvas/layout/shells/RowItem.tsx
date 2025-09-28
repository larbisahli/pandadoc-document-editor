import { NodeId } from "@/interfaces/common";
import { selectRowItemLayoutStyle } from "@/lib/features/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import React, { memo, useCallback } from "react";
import { usePage } from "../../context/PageContext";
import { DropBlockOverlayWrapper } from "@/dnd";
import { dropCommitted } from "@/lib/features/editor/thunks/layoutThunks";
import { DropSide } from "@/interfaces/enum";
import { DropEvent, DropPayload } from "@/interfaces/dnd";

interface Props {
  nodeId: NodeId;
  children: React.ReactNode;
}

function RowItem({ nodeId, children }: Props) {
  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  const layoutStyle = useAppSelector((state) =>
    selectRowItemLayoutStyle(state, pageId, nodeId),
  );

  const basePct = parseFloat(layoutStyle?.width ?? "0");

  const handleDrop = useCallback(
    (payload: DropPayload, side: DropSide | null) => {
      const dropEvent: DropEvent = {
        pageId,
        nodeId,
        side,
        payload,
      };
      dispatch(dropCommitted(dropEvent));
    },
    [dispatch, nodeId, pageId],
  );

  return (
    <div
      id={nodeId}
      data-node-type="item-row"
      className="item-row flex w-full px-[13px] py-0"
      style={{ width: `${(basePct as number).toFixed(2)}%` }}
    >
      <DropBlockOverlayWrapper onDrop={handleDrop}>
        {children}
      </DropBlockOverlayWrapper>
    </div>
  );
}

export default memo(RowItem);
