import {
  preloadImageBlock,
  preloadTableBlock,
  preloadTableOfContentsBlock,
  preloadTextBlock,
  preloadVideoBlock,
} from "@/components/editor/canvas/blocks/BlockRegistry";
import { DropPayload } from "@/interfaces/dnd";
import { BlockKind, Templates, TemplateTypes } from "@/interfaces/enum";
import {
  ImageIcon,
  LetterText,
  LucideProps,
  ScissorsLineDashed,
  SquarePlay,
  Table,
  TableOfContents,
} from "lucide-react";
import React from "react";

export interface ContentBlockType {
  id: string;
  label: string;
  icon: (props: LucideProps) => React.JSX.Element;
  dragPayload: DropPayload;
  componentPreload?: () => void;
}

export const contentBlocks: ContentBlockType[] = [
  {
    id: "block-text",
    label: "Text",
    icon: (props) => <LetterText {...props} />,
    componentPreload: preloadTextBlock,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: {
        instance: {
          templateId: Templates.Text,
          data: {
            content: { type: "doc", content: [{ type: "paragraph" }] },
          },
        },
        template: {
          id: Templates.Text,
          type: TemplateTypes.Block,
          kind: BlockKind.Text,
        },
      },
    },
  },
  {
    id: "block-image",
    label: "Image",
    icon: (props) => <ImageIcon {...props} />,
    componentPreload: preloadImageBlock,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: {
        instance: {
          templateId: Templates.Image,
          data: {
            content: "My Image content",
          },
        },
        template: {
          id: Templates.Image,
          type: TemplateTypes.Block,
          kind: BlockKind.Image,
        },
      },
    },
  },
  {
    id: "block-video",
    label: "Video",
    icon: (props) => <SquarePlay {...props} />,
    componentPreload: preloadVideoBlock,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: {
        instance: {
          templateId: Templates.Video,
          data: {
            content: "My Video content",
          },
        },
        template: {
          id: Templates.Video,
          type: TemplateTypes.Block,
          kind: BlockKind.Video,
        },
      },
    },
  },
  {
    id: "block-table-content",
    label: "Table of contents",
    icon: (props) => <TableOfContents {...props} />,
    componentPreload: preloadTableOfContentsBlock,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: {
        instance: {
          templateId: Templates.TableOfContents,
          data: {
            content: "My Table of contents content",
          },
        },
        template: {
          id: Templates.TableOfContents,
          type: TemplateTypes.Block,
          kind: BlockKind.TableOfContents,
        },
      },
    },
  },
  {
    id: "block-table",
    label: "Table",
    icon: (props) => <Table {...props} />,
    componentPreload: preloadTableBlock,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: {
        instance: {
          templateId: Templates.Table,
          data: {
            content: "Page break",
          },
        },
        template: {
          id: Templates.Table,
          type: TemplateTypes.Block,
          kind: BlockKind.Table,
        },
      },
    },
  },
  {
    id: "block-page-break",
    label: "Page break",
    icon: (props) => <ScissorsLineDashed {...props} />,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: {
        instance: {
          templateId: Templates.PageBreak,
          data: {
            content: "Page break",
          },
        },
        template: {
          id: Templates.PageBreak,
          type: TemplateTypes.Block,
          kind: BlockKind.PageBreak,
        },
      },
    },
  },
];
