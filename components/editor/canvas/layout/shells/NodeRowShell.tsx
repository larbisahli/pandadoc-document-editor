import { DropBlockOverlayWrapper } from "@/dnd";
import { NodeId } from "@/interfaces/common";
import { DropEvent, DropPayload } from "@/interfaces/dnd";
import { DropSide } from "@/interfaces/enum";
import { dropCommitted } from "@/lib/features/editor/thunks/layoutThunks";
import React, { memo, useCallback } from "react";
import { usePage } from "../../context/PageContext";
import { useAppDispatch } from "@/lib/hooks";

interface Props {
  nodeId: NodeId;
  children: React.ReactNode;
}

function NodeRowShell({ nodeId, children }: Props) {
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
    <DropBlockOverlayWrapper onDrop={handleDrop}>
      <div
        id={nodeId}
        data-node-type="node-row"
        className="group/resizer flex w-full bg-red-500 p-2"
      >
        {children}
      </div>
    </DropBlockOverlayWrapper>
  );
}

export default memo(NodeRowShell);
