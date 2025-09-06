import { selectPageOverlayIds } from "@/lib/features/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { memo, useCallback, useRef } from "react";
import OverlayFactory from "./OverlayFactory";
import { usePage } from "../context/PageContext";
import OverlayDropSurface from "./OverlayDropSurface";
import { browserZoomLevel } from "./helpers";
import { OverlayId } from "@/interfaces/common";
import { updateFiledPosition } from "@/lib/features/overlay/overlaySlice";
import { DragPayload } from "@/interfaces/dnd";
import { insertFieldFlow } from "@/lib/features/editor/thunks";

function OverlayLayer() {
  const surfaceRef = useRef<HTMLDivElement>(null);

  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  const overlayIds = useAppSelector((state) =>
    selectPageOverlayIds(state, pageId),
  );

  const handleOnCommit = useCallback(
    (overlayId: OverlayId, position: { offsetX: number; offsetY: number }) => {
      // TODO use thunk here
      dispatch(
        updateFiledPosition({
          overlayId,
          offsetX: position?.offsetX,
          offsetY: position?.offsetY,
        }),
      );
    },
    [dispatch],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      // TODO change this x-block-payload to x-field-payload
      const data = e.dataTransfer.getData("application/x-block-payload");
      if (!data) return;
      const payload = JSON.parse(data) as DragPayload;
      const { template, overlay, instance } = payload.data;

      // Measure position
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      dispatch(
        insertFieldFlow({
          pageId,
          offsetX,
          offsetY,
          template,
          overlay,
          instance,
        }),
      );
    },
    [dispatch, pageId],
  );

  return (
    <OverlayDropSurface
      surfaceRef={surfaceRef as React.RefObject<HTMLDivElement>}
      scale={browserZoomLevel}
      onCommit={handleOnCommit}
      onDropHandler={handleDrop}
    >
      {overlayIds.map((overlayId) => (
        <OverlayFactory key={overlayId} overlayId={overlayId} />
      ))}
    </OverlayDropSurface>
  );
}

export default memo(OverlayLayer);
