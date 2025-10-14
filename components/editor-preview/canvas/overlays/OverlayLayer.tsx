import { selectPageOverlayIds } from "@/lib/features/layout/layoutSlice";
import { useAppSelector } from "@/lib/hooks";
import { memo, useRef } from "react";
import OverlayFactory from "./OverlayFactory";
import OverlayDropSurface from "./OverlayDropSurface";
import { usePage } from "../../context/PageContext";

function OverlayLayer() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const { pageId } = usePage();
  const overlayIds = useAppSelector((state) =>
    selectPageOverlayIds(state, pageId),
  );

  return (
    <OverlayDropSurface
      surfaceRef={surfaceRef as React.RefObject<HTMLDivElement>}
    >
      {overlayIds.map((overlayId) => (
        <OverlayFactory key={overlayId} overlayId={overlayId} />
      ))}
    </OverlayDropSurface>
  );
}

export default memo(OverlayLayer);
