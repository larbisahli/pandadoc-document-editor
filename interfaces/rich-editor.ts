export type Formats = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  highlight?: boolean;
  heading?: 1 | 2 | 3 | 4 | 5 | boolean;
  align?: "left" | "center" | "right" | "justify";
  list?: "ordered" | "bullet" | boolean | string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  linkHref?: string;
  highlightColor?: string;
};

export type EditorUI = {
  // Current selection range
  selection: { from: number; to: number } | null;
  formats: Formats;
};
