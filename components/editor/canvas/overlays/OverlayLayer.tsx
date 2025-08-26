import { selectPageOverlayIds } from "@/lib/features/layout/layoutSlice";
import { useAppSelector } from "@/lib/hooks";
import { memo, useCallback, useRef } from "react";
import OverlayFactory from "./OverlayFactory";
import { usePage } from "../context/PageContext";
import OverlayDropSurface from "./OverlayDropSurface";
import { browserZoomLevel } from "./helpers";
import { OverlayId } from "@/interfaces/common";

function OverlayLayer() {
  const { pageId } = usePage();
  const surfaceRef = useRef<HTMLDivElement>(null);

  const overlayIds = useAppSelector((state) =>
    selectPageOverlayIds(state, pageId),
  );

  const handleOnCommit = useCallback(
    (overlayId: OverlayId, position: { offsetX: number; offsetY: number }) => {
      // TODO Dispatch to store
      console.log(">>>>>>>>>", { overlayId, position });
    },
    [],
  );

  if (!overlayIds.length) return null;

  return (
    <OverlayDropSurface
      surfaceRef={surfaceRef as React.RefObject<HTMLElement>}
      scale={browserZoomLevel}
      onCommit={handleOnCommit}
    >
      {overlayIds.map((overlayId) => (
        <OverlayFactory key={overlayId} overlayId={overlayId} />
      ))}
    </OverlayDropSurface>
  );
}

export default memo(OverlayLayer);
