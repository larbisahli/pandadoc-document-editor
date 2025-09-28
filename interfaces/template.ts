import { BlockKind, FieldKind, Templates, TemplateTypes } from "./enum";

// ** Template → “What kind of field is this?” (rules, defaults).

// field/block definition blueprint.
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
  propsSchema: {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    resizeWidth: boolean;
    resizeHeight: boolean;
  };
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
  | "tpl-stamp"
  | "tpl-table-of-contents";
