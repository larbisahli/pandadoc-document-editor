import {
  ImageIcon,
  LetterText,
  LucideProps,
  SquarePlay,
  TableOfContents,
} from "lucide-react";
import React from "react";
import { DragPayload } from "@/dnd/payload";

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
      type: "palette.block",
      data: { templateId: "tpl-text" },
    },
  },
  {
    id: "block-image",
    label: "Image",
    icon: (props) => <ImageIcon {...props} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-image" },
    },
  },
  {
    id: "block-video",
    label: "Video",
    icon: (props) => <SquarePlay {...props} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-video" },
    },
  },
  {
    id: "block-table-content",
    label: "Table of contents",
    icon: (props) => <TableOfContents {...props} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-video" },
    },
  },
];
