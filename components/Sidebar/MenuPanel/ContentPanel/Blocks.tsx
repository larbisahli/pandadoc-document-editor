import { DragPayload } from "@/interfaces/dnd";
import { TemplateTypes } from "@/interfaces/enum";
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
  dragPayload: DragPayload;
}

export const contentBlocks: ContentBlockType[] = [
  {
    id: "block-text",
    label: "Text",
    icon: (props) => <LetterText {...props} />,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: { templateId: "tpl-text" },
    },
  },
  {
    id: "block-image",
    label: "Image",
    icon: (props) => <ImageIcon {...props} />,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: { templateId: "tpl-image" },
    },
  },
  {
    id: "block-video",
    label: "Video",
    icon: (props) => <SquarePlay {...props} />,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: { templateId: "tpl-video" },
    },
  },
  {
    id: "block-table-content",
    label: "Table of contents",
    icon: (props) => <TableOfContents {...props} />,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: { templateId: "tpl-video" },
    },
  },
  {
    id: "block-page-break",
    label: "Page break",
    icon: (props) => <ScissorsLineDashed {...props} />,
    dragPayload: {
      kind: TemplateTypes.Block,
      data: { templateId: "tpl-page-break" },
    },
  },
];
