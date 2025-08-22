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
  ProductCard = "product_card",
}

// Field Template Kinds
export enum FieldKind {
  TextField = "textField",
  Signature = "signature",
  Initials = "initials",
  checkbox = "checkbox",
  Stamp = "stamp",
}
