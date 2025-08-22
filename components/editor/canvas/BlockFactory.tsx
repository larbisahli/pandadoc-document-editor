import { useAppSelector } from "@/lib/hooks";
import React from "react";
import {
  ImageBlock,
  TableContentBlock,
  TextBlock,
  VideoBlock,
} from "../blocks";
import { InstanceId } from "@/interfaces/common";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { selectTemplate } from "@/lib/features/template/templateSlice";
import { BlockKind } from "@/interfaces/enum";

interface BlockRendererProps {
  instanceId: InstanceId;
}

const BLOCK_COMPONENTS = {
  [BlockKind.Text]: TextBlock,
  [BlockKind.Image]: ImageBlock,
  [BlockKind.TableOfContents]: TableContentBlock,
  [BlockKind.Video]: VideoBlock,
} as const;

function BlockFactory({ instanceId }: BlockRendererProps) {
  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const template = useAppSelector((state) =>
    selectTemplate(state, instance?.templateId),
  );

  console.log({ instance, template });

  const Component =
    BLOCK_COMPONENTS[template.kind as keyof typeof BLOCK_COMPONENTS];

  if (!Component) {
    return null;
  }

  return <Component {...instance.data} props={{ ...instance.props }} />;
}

export default React.memo(BlockFactory);
