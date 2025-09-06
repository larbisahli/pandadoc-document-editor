import { DataType, InstanceId } from "./common";
import { Templates } from "./enum";
import { ContentStyleType, LayoutStyleType } from "./style";

export interface InstanceType {
  id: InstanceId;
  templateId: Templates;
  data: DataType; // e.g. {content:".."} or {value:".."} or {url:".."}
  props?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  contentStyle?: ContentStyleType;
  layoutStyle?: LayoutStyleType;
}
