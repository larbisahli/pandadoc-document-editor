import { BlockKind, FieldKind, Templates, TemplateTypes } from "./enum";

export type TemplateType = BlockTemplateType | FieldTemplateType;

export interface BlockTemplateType {
  id: Templates;
  type: TemplateTypes;
  kind: BlockKind;
}

export interface FieldTemplateType {
  id: Templates;
  type: TemplateTypes;
  kind: FieldKind;
  valueSchema?: Record<string, unknown>;
  propsSchema?: Record<string, unknown>;
}

export type TemplatesTypes =
  | "tpl-text"
  | "tpl-textarea"
  | "tpl-image"
  | "tpl-video"
  | "tpl-page-break"
  | "tpl-signature"
  | "tpl-initials"
  | "tpl-checkbox"
  | "tpl-stamp";
