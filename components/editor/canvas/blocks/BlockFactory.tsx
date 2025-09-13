import { useAppSelector } from "@/lib/hooks";
import React from "react";
import { InstanceId } from "@/interfaces/common";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { BLOCK_COMPONENTS } from "./BlockRegistry";

interface BlockRendererProps {
  instanceId: InstanceId;
}

function BlockFactory({ instanceId }: BlockRendererProps) {
  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const template = useAppSelector((state) =>
    selectTemplate(state, instance?.templateId),
  );

  const Component = BLOCK_COMPONENTS[template.kind];

  if (!instance || !template?.kind) return null;

  if (!Component) {
    return null;
  }

  return <Component instance={instance} />;
}

export default React.memo(BlockFactory);
