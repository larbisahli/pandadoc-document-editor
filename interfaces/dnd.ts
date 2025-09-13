import { NodeId, PageId } from "./common";
import { DropSide, TemplateTypes } from "./enum";
import { InstanceType } from "./instance";
import { OverlayItem } from "./overlay";

export interface DropPayload {
  kind: TemplateTypes;
  data: {
    instance?: Omit<InstanceType, "id"> & Partial<Pick<InstanceType, "id">>;
    overlay?: Omit<OverlayItem, "id" | "instanceId"> &
      Partial<Pick<OverlayItem, "id" | "instanceId">>;
  };
}

export type DropEvent = {
  pageId: PageId;
  nodeId: NodeId; // node under cursor
  side: DropSide | null; // side relative to node
  payload: DropPayload;
};
