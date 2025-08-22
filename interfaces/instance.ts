import { DataType, InstanceId, TemplateId } from "./common";

export interface InstanceType {
  id: InstanceId;
  templateId: TemplateId;
  data: DataType; // e.g. {content:".."} or {value:".."} or {url:".."}
  props?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  contentStyle?: {
    align?: "left" | "right";
    width?: number;
    height?: number;
  };
  layoutStyle?: {
    backgroundColor?: string;
    minHeight?: number;
    margin?: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    };
    padding?: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    };
  };
}
