import { TiptapRegistry } from "@/components/editor/ui/RichEditor/tiptapRegistry";
import { Formats } from "@/interfaces/rich-editor";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const setColor = createAsyncThunk(
  "editor/setColor",
  async ({ editorId, color }: { editorId: string; color: string | null }) => {
    const ed = TiptapRegistry.get(editorId);
    if (!ed) return;
    const c = ed.chain().focus();
    if (color) {
      c.setColor(color).run();
    } else {
      c.unsetColor().run();
    }
  },
);

export const setFontFamily = createAsyncThunk(
  "editor/setFontFamily",
  async ({ editorId, family }: { editorId: string; family: string | null }) =>
    TiptapRegistry.get(editorId)
      ?.chain()
      .focus()
      .setMark("textStyle", { fontFamily: family || null })
      .run(),
);

export const setFontSize = createAsyncThunk(
  "editor/setFontSize",
  async ({ editorId, size }: { editorId: string; size: string | null }) => {
    if (size) {
      TiptapRegistry.get(editorId)?.chain().focus().setFontSize(size).run();
    }
  },
);

export const setLink = createAsyncThunk(
  "editor/setLink",
  async ({ editorId, href }: { editorId: string; href: string }) =>
    TiptapRegistry.get(editorId)
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href })
      .run(),
);

export const unsetLink = createAsyncThunk(
  "editor/unsetLink",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().unsetLink().run(),
);

export const toggleBold = createAsyncThunk(
  "editor/toggleBold",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().toggleBold().run(),
);

export const toggleItalic = createAsyncThunk(
  "editor/toggleItalic",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().toggleItalic().run(),
);

export const toggleUnderline = createAsyncThunk(
  "editor/toggleUnderline",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().toggleUnderline().run(),
);

export const setHeading = createAsyncThunk(
  "editor/setHeading",
  async ({
    editorId,
    level,
  }: {
    editorId: string;
    level: Formats["heading"];
  }) => {
    const ed = TiptapRegistry.get(editorId);
    if (!ed) return;
    const c = ed.chain().focus();
    if (level) {
      c.setHeading({ level }).run();
    } else {
      c.setParagraph().run();
    }
  },
);

export const toggleHighlight = createAsyncThunk(
  "editor/toggleHighlight",
  async ({ editorId, color }: { editorId: string; color?: string }) => {
    const ed = TiptapRegistry.get(editorId);
    if (!ed) return;
    ed.chain()
      .focus()
      .toggleHighlight(color ? { color } : undefined)
      .run();
  },
);

export const toggleOrdered = createAsyncThunk(
  "editor/toggleOrdered",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().toggleOrderedList().run(),
);

export const toggleBullet = createAsyncThunk(
  "editor/toggleBullet",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().toggleBulletList().run(),
);

export const setAlign = createAsyncThunk(
  "editor/setAlign",
  async ({
    editorId,
    value,
  }: {
    editorId: string;
    value: "left" | "center" | "right" | "justify";
  }) => TiptapRegistry.get(editorId)?.chain().focus().setTextAlign(value).run(),
);

export const undo = createAsyncThunk(
  "editor/undo",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().undo().run(),
);

export const redo = createAsyncThunk(
  "editor/redo",
  async ({ editorId }: { editorId: string }) =>
    TiptapRegistry.get(editorId)?.chain().focus().redo().run(),
);
