import { PageId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { OverlayItem } from "@/interfaces/overlay";
import { TemplateType } from "@/interfaces/template";
import { AppDispatch, RootState } from "@/lib/store";
import { newInstanceId, newOverlayId } from "@/utils/ids";
import { insertFieldCommitted, InsertFieldPayload } from "./actions";

interface InsertFieldFlowType {
  pageId: PageId;
  offsetX: number;
  offsetY: number;
  instance: Omit<InstanceType, "id" | "templateId"> &
    Partial<Pick<InstanceType, "id" | "templateId">>;
  template: TemplateType;
  overlay: Omit<OverlayItem, "id" | "instanceId"> &
    Partial<Pick<OverlayItem, "id" | "instanceId">>;
}

export const insertFieldFlow =
  (args: InsertFieldFlowType) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    // You can validate IDs, generate defaults, permissions, etc. here

    const { template, instance, overlay, offsetX, offsetY, pageId } = args;

    // Generate IDs
    const instanceId = newInstanceId();
    const overlayId = newOverlayId();

    const payload: InsertFieldPayload = {
      pageId,
      template,
      instance: {
        ...instance,
        id: instanceId,
        templateId: template?.id,
      },
      overlay: {
        ...overlay,
        id: overlayId,
        instanceId,
        position: {
          offsetX,
          offsetY,
        },
      },
    };
    dispatch(insertFieldCommitted(payload));
  };
