import { selectPageOverlayIds } from "@/lib/features/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { memo, useCallback, useRef } from "react";
import OverlayFactory from "./OverlayFactory";
import { usePage } from "../context/PageContext";
import OverlayDropSurface from "./OverlayDropSurface";
import { browserZoomLevel, clampPlacementToPageBounds } from "./helpers";
import { OverlayId } from "@/interfaces/common";
import { updateFiledPosition } from "@/lib/features/overlay/overlaySlice";
import { DropPayload } from "@/interfaces/dnd";
import { PALETTE_DATA_FORMAT } from "@/dnd";
import { insertFieldFlow } from "@/lib/features/thunks/overlayThunks";

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

  const handleOnDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      // TODO WORK ON OVERLAY PAYLOAD
      const data = e.dataTransfer.getData(PALETTE_DATA_FORMAT);
      if (!data) return;
      const payload = JSON.parse(data) as DropPayload;

      const {
        data: { overlay, instance },
        style,
      } = payload;

      // Measure pointer offset within the drop target
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      // Determine field size (use whatever your payload provides)
      const fieldW = style?.width as number;
      const fieldH = style?.height as number;

      const clamped = clampPlacementToPageBounds(
        pageId,
        rawX,
        rawY,
        fieldW,
        fieldH,
      );

      if (!clamped || clamped?.outside) return;

      // Or proceed with clamped coordinates to always keep the field fully inside:
      dispatch(
        insertFieldFlow({
          pageId,
          instance,
          overlay: {
            ...overlay,
            position: {
              offsetX: clamped.x,
              offsetY: clamped.y,
            },
            style: {
              width: fieldW,
              height: fieldH,
            },
          },
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
      onDropHandler={handleOnDrop}
    >
      {overlayIds.map((overlayId) => (
        <OverlayFactory key={overlayId} overlayId={overlayId} />
      ))}
    </OverlayDropSurface>
  );
}

export default memo(OverlayLayer);
