import { NodeId, PageId } from "./common";
import { DropSide, TemplateTypes } from "./enum";
import { InstanceType } from "./instance";
import { OverlayItem } from "./overlay";
import { TemplateType } from "./template";

export interface DropPayload {
  kind: TemplateTypes;
  data: {
    template?: Omit<TemplateType, "id"> & Partial<Pick<TemplateType, "id">>;
    instance?: Omit<InstanceType, "id"> & Partial<Pick<InstanceType, "id">>;
    overlay?: Omit<OverlayItem, "id" | "instanceId" | "recipientId"> &
      Partial<Pick<OverlayItem, "id" | "instanceId">>;
  };
  style?: {
    width: number;
    height: number;
  };
}

export type DropEvent = {
  pageId: PageId;
  nodeId?: NodeId; // node under cursor
  side: DropSide | null; // side relative to node
  payload: DropPayload;
  forceRoot?: boolean;
};
