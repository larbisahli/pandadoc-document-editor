// Template types
export enum TemplateTypes {
  Field = "field",
  Block = "block",
  Content = "content",
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
  Table = "table",
}

// Field Template Kinds
export enum FieldKind {
  TextArea = "textarea",
  Signature = "signature",
  Initials = "initials",
  Checkbox = "checkbox",
  Date = "date",
  Stamp = "stamp",
  Dropdown = "dropdown",
  CollectFiles = "collect-files",
  Radio = "radio",
}

export enum Templates {
  Text = "tpl-text",
  Textarea = "tpl-textarea",
  Image = "tpl-image",
  Video = "tpl-video",
  PageBreak = "tpl-page-break",
  Table = "tpl-table",
  Signature = "tpl-signature",
  Initials = "tpl-initials",
  Checkbox = "tpl-checkbox",
  Date = "tpl-date",
  Stamp = "tpl-stamp",
  TableOfContents = "tpl-table-of-contents",
  Dropdown = "tpl-Dropdown",
  CollectFiles = "collect-files",
  Radio = "radio",
}

export enum DropSide {
  Left = "left",
  Right = "right",
  Top = "top",
  Bottom = "bottom",
}

export enum RecipientRoles {
  Signer = "signer",
  Viewer = "viewer",
  Approver = "approver",
  CC = "cc",
}
