import { TemplateId } from "./common";
import { BlockKind, FieldKind, TemplateTypes } from "./enum";

export type TemplateType = BlockTemplateType | FieldTemplateType;

export interface BlockTemplateType {
  id: TemplateId;
  type: TemplateTypes.Block;
  kind: BlockKind;
  requiredSlots: string[]; // e.g. ["content"] or ["src","alt"]
  optionalSlots?: string[];
}

export interface FieldTemplateType {
  id: TemplateId;
  type: TemplateTypes.Field;
  kind: FieldKind;
  valueSchema?: Record<string, unknown>;
  propsSchema?: Record<string, unknown>;
}
