import { InstanceId, NodeId } from "@/interfaces/common";
import { BlockKind } from "@/interfaces/enum";
import dynamic from "next/dynamic";
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

// Static or lazy component imports
const TextBlockLoader = () => import("@/components/editor/blocks/TextBlock");
const ImageBlockLoader = () => import("@/components/editor/blocks/ImageBlock");
const VideoBlockLoader = () => import("@/components/editor/blocks/VideoBlock");
const TableOfContentsBlockLoader = () =>
  import("@/components/editor/blocks/TableContentBlock");
const TableBlockLoader = () => import("@/components/editor/blocks/TableBlock");

export const TextBlock = dynamic(TextBlockLoader, {
  loading: () => (
    <div
      className="h-20 w-full animate-pulse rounded-sm bg-gray-200"
      aria-hidden
    />
  ),
});
export const ImageBlock = dynamic(ImageBlockLoader, {
  loading: () => (
    <div
      className="h-40 w-full animate-pulse rounded-sm bg-gray-200"
      aria-hidden
    />
  ),
});
export const VideoBlock = dynamic(VideoBlockLoader, {
  loading: () => (
    <div
      className="h-40 w-full animate-pulse rounded-sm bg-gray-200"
      aria-hidden
    />
  ),
});
export const TableOfContentsBlock = dynamic(TableOfContentsBlockLoader, {
  loading: () => (
    <div
      className="h-40 w-full animate-pulse rounded-sm bg-gray-200"
      aria-hidden
    />
  ),
});
export const TableBlock = dynamic(TableBlockLoader, {
  loading: () => (
    <div
      className="h-40 w-full animate-pulse rounded-sm bg-gray-200"
      aria-hidden
    />
  ),
});

// warm the chunk on drag
export const preloadTextBlock = () => TextBlockLoader();
export const preloadImageBlock = () => ImageBlockLoader();
export const preloadVideoBlock = () => VideoBlockLoader();
export const preloadTableOfContentsBlock = () => TableOfContentsBlockLoader();
export const preloadTableBlock = () => TableBlockLoader();

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
  [BlockKind.TableOfContents]: TableOfContentsBlock,
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
