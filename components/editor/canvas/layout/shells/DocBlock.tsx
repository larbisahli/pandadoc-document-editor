import { DropBlockOverlayWrapper } from "@/dnd";
import { NodeId } from "@/interfaces/common";
import React, { memo, useCallback } from "react";
import { usePage } from "../../context/PageContext";
import { useAppDispatch } from "@/lib/hooks";
import { DropEvent, DropPayload } from "@/interfaces/dnd";
import { DropSide } from "@/interfaces/enum";
import { dropCommitted } from "@/lib/features/thunks/layoutThunks";

interface Props {
  children: React.ReactNode;
  nodeId: NodeId;
}

function DocBlock({ nodeId, children }: Props) {
  const { pageId } = usePage();
  const dispatch = useAppDispatch();

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
    <DropBlockOverlayWrapper
      dataNodeType="docBlock"
      className="docBlock will-change-transform"
      onDrop={handleDrop}
    >
      {children}
    </DropBlockOverlayWrapper>
  );
}

export default memo(DocBlock);
