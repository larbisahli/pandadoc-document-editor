import { DataType, InstanceId, RecipientId } from "./common";
import { Templates } from "./enum";
import { ContentStyleType, LayoutStyleType } from "./style";

declare const __unixMsBrand: unique symbol;
export type UnixMs = number & { readonly [__unixMsBrand]: true };

// ** Instance → “What does this field contain in this document?” (the data).
// Logical field in a document (data + behavior, from template)
export interface InstanceType {
  id: InstanceId;
  templateId: Templates;
  data: DataType; // e.g. {content:".."} or {value:".."} or {url:".."}
  props?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  contentStyle?: ContentStyleType;
  layoutStyle?: LayoutStyleType;
  recipientId?: RecipientId;
  assignedAt?: string;
  assignedBy?: string;
  required?: boolean;
  createdAt?: UnixMs;
  updatedAt?: UnixMs;
}
