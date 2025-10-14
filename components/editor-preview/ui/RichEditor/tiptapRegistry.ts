// module-scope singleton map
import type { Editor } from "@tiptap/react";

const map = new Map<string, Editor>();

export const TiptapRegistry = {
  set(id: string, editor: Editor) {
    map.set(id, editor);
  },
  delete(id: string) {
    map.delete(id);
  },
  get(id: string) {
    return map.get(id);
  },
};
