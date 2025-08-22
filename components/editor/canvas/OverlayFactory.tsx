import { useAppSelector } from "@/lib/hooks";
import React from "react";
import { OverlayId } from "@/interfaces/common";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { FieldKind } from "@/interfaces/enum";
import TextField from "../fields/TextField";
import { selectOverlayById } from "@/lib/features/overlay/overlaySlice";

interface FieldRendererProps {
  overlayId: OverlayId;
}

const FIELD_COMPONENTS = {
  [FieldKind.TextField]: TextField,
} as const;

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

  console.log({ overlay, instance, template });

  const Component =
    FIELD_COMPONENTS[template.kind as keyof typeof FIELD_COMPONENTS];

  if (!Component) {
    return null;
  }

  return <Component {...instance.data} props={instance.props} />;
}

export default React.memo(FieldFactory);
