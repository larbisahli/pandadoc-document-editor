import { DropBlockOverlayWrapper } from "@/dnd";
import { NodeId } from "@/interfaces/common";
import { DropEvent, DropPayload } from "@/interfaces/dnd";
import { DropSide } from "@/interfaces/enum";
import React, { memo, useCallback } from "react";
import { usePage } from "../../context/PageContext";
import { useAppDispatch } from "@/lib/hooks";
import { dropCommitted } from "@/lib/features/thunks/layoutThunks";

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
        className="group/resizer mx-[-13px] my-0 flex"
      >
        {children}
      </div>
    </DropBlockOverlayWrapper>
  );
}

export default memo(NodeRowShell);
