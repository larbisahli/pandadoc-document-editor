import { DataType, InstanceId, TemplateId } from "./common";
import { ContentStyleType, LayoutStyleType } from "./style";

export interface InstanceType {
  id: InstanceId;
  templateId: TemplateId;
  data: DataType; // e.g. {content:".."} or {value:".."} or {url:".."}
  props?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  contentStyle?: ContentStyleType;
  layoutStyle?: LayoutStyleType;
}
