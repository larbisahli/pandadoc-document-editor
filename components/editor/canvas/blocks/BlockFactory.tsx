import { useAppSelector } from "@/lib/hooks";
import React from "react";
import { InstanceId, NodeId } from "@/interfaces/common";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { BLOCK_COMPONENTS } from "./BlockRegistry";

interface BlockRendererProps {
  instanceId: InstanceId;
  nodeId: NodeId;
}

function BlockFactory({ nodeId, instanceId }: BlockRendererProps) {
  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const template = useAppSelector((state) =>
    selectTemplate(state, instance?.templateId),
  );

  const Component = BLOCK_COMPONENTS[template.kind];

  if (!instance || !template?.kind) return null;

  if (!Component) {
    return null;
  }

  return <Component nodeId={nodeId} instanceId={instanceId} />;
}

export default React.memo(BlockFactory);
