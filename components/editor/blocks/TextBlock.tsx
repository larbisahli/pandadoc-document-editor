import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  ensureEditor,
  setActiveInstance,
  setFormats,
  setSelection,
} from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { TiptapRegistry } from "../ui/RichEditor/tiptapRegistry";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import FontFamily from "@tiptap/extension-font-family";
import { FontSize } from "../ui/RichEditor/extensions/FontSize";
import { usePage } from "../canvas/context/PageContext";
import {
  consumePendingFocus,
  selectPendingFocusInstanceId,
} from "@/lib/features/ui/uiSlice";
import {
  saveInstanceEditorRaw,
  selectInstance,
} from "@/lib/features/instance/instanceSlice";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { useClickOutside } from "../hooks/useClickOutside";
import BorderWrapper from "./BorderWrapper";
import { deleteBlockRef } from "@/lib/features/thunks/documentThunks";
import { TextDataType } from "@/interfaces/common";
import type { JSONContent } from "@tiptap/core";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { Trash2 } from "lucide-react";

function computeFormats(editor: Editor) {
  const is = (ext: string, attrs?: string) => editor.isActive(ext, attrs);

  let heading: 1 | 2 | 3 | 4 | 5 | boolean = false;
  for (const lvl of [1, 2, 3, 4, 5] as const) {
    if (editor.isActive("heading", { level: lvl })) {
      heading = lvl;
    }
  }

  const markAttrs = editor.getAttributes("highlight");
  const highlightColor = markAttrs?.color || "";

  const paraAttrs = editor.getAttributes("paragraph");
  const headAttrs = editor.getAttributes("heading");
  const textAttrs = editor.getAttributes("textStyle");
  const linkAttrs = editor.getAttributes("link");

  const align = headAttrs?.textAlign ?? paraAttrs?.textAlign ?? "left";

  return {
    bold: is("bold"),
    italic: is("italic"),
    underline: is("underline"),
    heading,
    list: is("orderedList") ? "ordered" : is("bulletList") ? "bullet" : false,
    align,
    color: textAttrs?.color || "",
    fontFamily: textAttrs?.fontFamily || "",
    fontSize: textAttrs?.fontSize || "",
    linkHref: linkAttrs?.href || "",
    highlight: editor.isActive("highlight"),
    highlightColor,
  };
}

function TextBlock({ nodeId, instanceId }: BaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);

  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  const pendingFocusId = useAppSelector(selectPendingFocusInstanceId);
  const instance = useAppSelector((s) => selectInstance(s, instanceId));

  const [active, setActive] = useState(false);

  const saveDebounced = useDebouncedCallback((json: JSONContent) => {
    dispatch(saveInstanceEditorRaw({ instanceId, raw: json }));
  }, 300);

  const editor = useEditor({
    content: (instance?.data as TextDataType)?.content ?? {
      type: "doc",
      content: [],
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      saveDebounced(json);
    },
    immediatelyRender: false, // important for SSR
    extensions: [
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
    ],
    onCreate: ({ editor }) => {
      TiptapRegistry.set(instanceId, editor);
      const sel = editor.state.selection;
      dispatch(
        setSelection({
          editorId: instanceId,
          selection: { from: sel.from, to: sel.to },
        }),
      );
      dispatch(
        setFormats({ editorId: instanceId, formats: computeFormats(editor) }),
      );
    },
    onSelectionUpdate: ({ editor }) => {
      const sel = editor.state.selection;
      dispatch(
        setSelection({
          editorId: instanceId,
          selection: { from: sel.from, to: sel.to },
        }),
      );
      dispatch(
        setFormats({ editorId: instanceId, formats: computeFormats(editor) }),
      );
    },
    onTransaction: ({ editor }) => {
      dispatch(
        setFormats({ editorId: instanceId, formats: computeFormats(editor) }),
      );
    },
  });

  // call this whenever you want to focus
  const requestEditorFocus = useCallback(() => {
    if (editor) {
      editor?.chain()?.focus()?.run();
    }
  }, [editor]);

  useEffect(() => {
    if (active) {
      requestEditorFocus();
    }
  }, [active, requestEditorFocus]);

  useEffect(() => {
    dispatch(ensureEditor({ editorId: instanceId }));
  }, [dispatch, instanceId]);

  useEffect(() => {
    return () => {
      if (editor) {
        TiptapRegistry.delete(instanceId);
        editor.destroy();
      }
    };
  }, [editor, instanceId]);

  const onActivate = useCallback(() => {
    dispatch(setActiveInstance(instanceId));
    setActive(true);
  }, [dispatch, instanceId]);

  // Focus once when freshly dropped
  useEffect(() => {
    if (pendingFocusId !== instanceId) return;
    const raf = requestAnimationFrame(() => {
      requestEditorFocus();
      onActivate();
      dispatch(consumePendingFocus({ instanceId }));
    });
    return () => cancelAnimationFrame(raf);
  }, [pendingFocusId, instanceId, dispatch, onActivate, requestEditorFocus]);

  // Outside click => blur selection UI, hide borders
  const onOutside = useCallback(() => {
    setActive(false);
    dispatch(setActiveInstance(null));
  }, [dispatch]);

  const ignoreSelectors = useMemo(
    () => ["[data-rich-editor-toolbar]", "#richEditorToolbar"],
    [],
  );

  useClickOutside(blockRef, onOutside, { enabled: active, ignoreSelectors });

  const handleDelete = () => {
    dispatch(deleteBlockRef({ pageId, nodeId, instanceId }));
  };

  console.log({ active });

  return (
    <div
      ref={blockRef}
      onClick={() => {
        onActivate();
        requestEditorFocus();
      }}
      onFocus={onActivate}
      className="group relatives"
    >
      <BorderWrapper active={active}>
        <div className="relative">
          <EditorContent editor={editor} className="tiptap" />
        </div>
      </BorderWrapper>
      <ActionsTooltip
        active={active}
        actions={[
          {
            key: "delete",
            label: "Delete",
            icon: <Trash2 size={18} />,
            danger: true,
            onSelect: handleDelete,
          },
        ]}
      />
    </div>
  );
}

export default TextBlock;
