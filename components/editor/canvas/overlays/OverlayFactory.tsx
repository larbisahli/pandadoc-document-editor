import { useAppSelector } from "@/lib/hooks";
import React from "react";
import { OverlayId } from "@/interfaces/common";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { selectOverlayById } from "@/lib/features/overlay/overlaySlice";
import { browserZoomLevel } from "./helpers";
import ResizableFieldWrapper from "./ResizableFieldWrapper";
import DraggableOverlay from "./DraggableOverlay";
import { FIELD_COMPONENTS } from "./FieldRegistry";

interface FieldRendererProps {
  overlayId: OverlayId;
}

function FieldFactory({ overlayId }: FieldRendererProps) {
  const overlay = useAppSelector((state) =>
    selectOverlayById(state, overlayId),
  );
  const instance = useAppSelector((state) =>
    selectInstance(state, overlay?.instanceId),
  );
  const template = useAppSelector((state) =>
    selectTemplate(state, instance?.templateId),
  );

  if (!overlay || !instance || !template?.kind) return null;

  const Component = FIELD_COMPONENTS[template.kind];

  if (!Component) {
    return null;
  }

  const { position, style, settings } = overlay;
  const canResizeWidth = settings?.resizeWidth as boolean;
  const canResizeHeight = settings?.resizeHeight as boolean;
  const width = style?.width ?? undefined;
  const height = style?.height ?? undefined;
  const offsetX = position?.offsetX ?? 0;
  const offsetY = position?.offsetY ?? 0;

  return (
    <DraggableOverlay
      overlayId={overlayId}
      offsetX={offsetX}
      offsetY={offsetY}
      scale={browserZoomLevel}
    >
      <ResizableFieldWrapper
        canResizeWidth={canResizeWidth}
        canResizeHeight={canResizeHeight}
        overlayId={overlayId}
        width={width}
        height={height}
        scale={browserZoomLevel}
      >
        <Component overlayId={overlayId} instance={instance} />
      </ResizableFieldWrapper>
    </DraggableOverlay>
  );
}

export default React.memo(FieldFactory);
