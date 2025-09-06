import { TemplateTypes } from "./enum";
import { InstanceType } from "./instance";
import { OverlayItem } from "./overlay";
import { TemplateType } from "./template";

export interface DragPayload {
  kind: TemplateTypes;
  data: {
    instance: Omit<InstanceType, "id" | "templateId"> &
      Partial<Pick<InstanceType, "id" | "templateId">>;
    template: TemplateType;
    overlay: Omit<OverlayItem, "id" | "instanceId"> &
      Partial<Pick<OverlayItem, "id" | "instanceId">>;
  };
}
