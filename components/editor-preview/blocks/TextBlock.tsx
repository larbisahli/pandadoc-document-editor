"use client";
import React, { memo } from "react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { useAppSelector } from "@/lib/hooks";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import FontFamily from "@tiptap/extension-font-family";
import { FontSize } from "../ui/RichEditor/extensions/FontSize";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { TextDataType } from "@/interfaces/common";
import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";

export function getExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5] },
      bulletList: { keepMarks: true, keepAttributes: true },
      orderedList: { keepMarks: true },
      listItem: {},
    }),
    TextStyle, // required by Color / FontSize / FontFamily
    Color.configure({ types: ["textStyle"] }),
    Highlight.configure({
      multicolor: true, // allow custom colors
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
        class: "editor-link", // optional extra class
      },
    }),
    ListItem,
    BulletList,
    OrderedList,
    FontFamily,
    FontSize,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ];
}

function TextBlock({ instanceId }: BaseBlockProps) {
  const instance = useAppSelector((s) => selectInstance(s, instanceId));
  const content = (instance?.data as TextDataType)?.content as JSONContent;
  const previewHtml = generateHTML(
    content ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    getExtensions(),
  );
  // suppressHydrationWarning avoids React whining about replacing SSR HTML
  return (
    <div
      className="tiptap"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: previewHtml }}
    />
  );
}

export default memo(TextBlock);
