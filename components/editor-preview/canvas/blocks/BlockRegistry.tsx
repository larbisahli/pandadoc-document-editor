import {
  ImageBlock,
  TableBlock,
  TableContentBlock,
  TextBlock,
  VideoBlock,
} from "@/components/editor-preview/blocks";
import { InstanceId, NodeId } from "@/interfaces/common";
import { BlockKind } from "@/interfaces/enum";
import React, { ComponentType } from "react";

export const BLOCK_KINDS = [
  BlockKind.Text,
  BlockKind.Image,
  BlockKind.Video,
  BlockKind.TableOfContents,
  BlockKind.Table,
] as const;

export const isFieldKind = (v: unknown): v is BlockKind =>
  typeof v === "string" && (BLOCK_KINDS as readonly string[]).includes(v);

export interface BaseBlockProps {
  instanceId: InstanceId;
  nodeId: NodeId;
}

export type AnyBlockComponent = ComponentType<BaseBlockProps>;

// Fallback for unknown kinds
const UnknownBlock: AnyBlockComponent = ({ overlayId }: any) => (
  <div className="text-xs text-red-600">Unknown block: {overlayId}</div>
);

type RegistryKind =
  | BlockKind.Text
  | BlockKind.Image
  | BlockKind.Video
  | BlockKind.TableOfContents
  | BlockKind.Table;

/* The registry (static map) */
const STATIC_REGISTRY: Record<RegistryKind, AnyBlockComponent> = {
  [BlockKind.Text]: TextBlock,
  [BlockKind.Image]: ImageBlock,
  [BlockKind.Video]: VideoBlock,
  [BlockKind.TableOfContents]: TableContentBlock,
  [BlockKind.Table]: TableBlock,
};

/* Runtime registry (extensible) */
/** If we want to allow plugins to register blocks at runtime. */
const RUNTIME_REGISTRY = new Map<BlockKind, AnyBlockComponent>();

export function registerField(kind: BlockKind, component: AnyBlockComponent) {
  RUNTIME_REGISTRY.set(kind, component);
}

// Lookup
export function getFieldComponent(kind?: string | null): AnyBlockComponent {
  if (!kind || !isFieldKind(kind)) return UnknownBlock;
  return (
    RUNTIME_REGISTRY.get(kind) ??
    STATIC_REGISTRY[kind as keyof typeof STATIC_REGISTRY] ??
    UnknownBlock
  );
}

// Under the hood calls getFieldComponent
export const BLOCK_COMPONENTS = new Proxy(STATIC_REGISTRY, {
  get(_target, prop) {
    return getFieldComponent(String(prop));
  },
}) as Record<string, AnyBlockComponent>;
