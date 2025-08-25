import { PageId } from "@/interfaces/common";
import { selectPageOverlayIds } from "@/lib/features/layout/layoutSlice";
import { useAppSelector } from "@/lib/hooks";
import { memo } from "react";
import OverlayFactory from "./OverlayFactory";
import { usePage } from "../context/PageContext";

interface OverlayLayerProps {
  pageId: PageId;
}

function OverlayLayer() {
  const { pageId } = usePage();

  const overlayIds = useAppSelector((state) =>
    selectPageOverlayIds(state, pageId),
  );

  if (!overlayIds.length) return null;

  return (
    <div
      data-node-type="overlayLayer"
      className="even pointer-none: pointer-events-none absolute inset-0"
    >
      {overlayIds.map((overlayId) => (
        <OverlayFactory key={overlayId} overlayId={overlayId} />
      ))}
    </div>
  );
}

export default memo(OverlayLayer);
