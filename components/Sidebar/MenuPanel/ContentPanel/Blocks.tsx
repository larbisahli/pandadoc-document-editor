import { DropPayload } from "@/interfaces/dnd";
import { BlockKind, Templates, TemplateTypes } from "@/interfaces/enum";
import {
  ImageIcon,
  LetterText,
  LucideProps,
  ScissorsLineDashed,
  SquarePlay,
  TableOfContents,
} from "lucide-react";
import React from "react";

export interface ContentBlockType {
  id: string;
  label: string;
  icon: (props: LucideProps) => React.JSX.Element;
  dragPayload: DropPayload;
}

export const contentBlocks: ContentBlockType[] = [
  {
    id: "block-text",
    label: "Text",
    icon: (props) => <LetterText {...props} />,
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
