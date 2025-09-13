// Template types
export enum TemplateTypes {
  Field = "field",
  Block = "block",
}

// Layout direction of a container
export enum NodeDirection {
  Row = "row",
  Column = "column",
}

// Node Layout Kinds
export enum NodeKind {
  Container = "container",
  BlockRef = "blockRef",
}

// Block Template Kinds
export enum BlockKind {
  Text = "text",
  Image = "image",
  Video = "video",
  TableOfContents = "table_of_contents",
  PageBreak = "page_break",
}

// Field Template Kinds
export enum FieldKind {
  TextArea = "textarea",
  Signature = "signature",
  Initials = "initials",
  Checkbox = "checkbox",
  Stamp = "stamp",
}

export enum Templates {
  Text = "tpl-text",
  Textarea = "tpl-textarea",
  Image = "tpl-image",
  Video = "tpl-video",
  PageBreak = "tpl-page-break",
  Signature = "tpl-signature",
  Initials = "tpl-initials",
  Checkbox = "tpl-checkbox",
  Stamp = "tpl-stamp",
  TableOfContents = "tpl-table-of-contents",
}

export enum DropSide {
  Left = "left",
  Right = "right",
  Top = "top",
  Bottom = "bottom",
}
