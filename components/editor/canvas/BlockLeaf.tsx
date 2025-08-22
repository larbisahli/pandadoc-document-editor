import React, { memo } from "react";
import BlockFactory from "./BlockFactory";
import { InstanceId } from "@/interfaces/common";

interface Props {
  id: string;
  instanceId: InstanceId;
}

function BlockLeaf({ id, instanceId }: Props) {
  return (
    <div
      id={id}
      data-node-type="blockContent"
      className="h-fit w-full bg-gray-300 p-2"
    >
      <BlockFactory instanceId={instanceId} />
    </div>
  );
}

export default memo(BlockLeaf);
