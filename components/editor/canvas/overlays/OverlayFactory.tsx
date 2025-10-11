import { useAppSelector } from "@/lib/hooks";
import React from "react";
import { OverlayId } from "@/interfaces/common";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { selectOverlayById } from "@/lib/features/overlay/overlaySlice";
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

  if (!template?.kind) return null;

  const Component = FIELD_COMPONENTS[template?.kind];

  if (!Component) {
    return null;
  }

  return (
    <DraggableOverlay overlayId={overlayId}>
      <ResizableFieldWrapper overlayId={overlayId}>
        <Component overlayId={overlayId} instanceId={instance?.id} />
      </ResizableFieldWrapper>
    </DraggableOverlay>
  );
}

export default React.memo(FieldFactory);
