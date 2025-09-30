import { InstanceId, NodeId, OverlayId, PageId } from "@/interfaces/common";
import { DropEvent } from "@/interfaces/dnd";
import { Templates } from "@/interfaces/enum";
import { InstanceType } from "@/interfaces/instance";
import { OverlayItem } from "@/interfaces/overlay";
import { createAction } from "@reduxjs/toolkit";

export type InsertFieldPayload = {
  pageId: PageId;
  instance: InstanceType;
  overlay: OverlayItem;
};

export interface UpdateFieldSizeType {
  template: { id: Templates };
  overlay: { id: OverlayId };
  width: number;
  height: number;
}

export interface AddBlankPageType {
  pageId: PageId;
  rootId: NodeId;
  nodeId: NodeId;
  instanceId: InstanceId;
  beforePageId: PageId | false;
  afterPageId: PageId | false;
}

export interface DeleteBlockRefType {
  pageId: PageId;
  nodeId: NodeId;
  instanceId: InstanceId;
}

export const insertFieldCommitted = createAction<InsertFieldPayload>(
  "document/insertFieldCommitted",
);
export const dropApplied = createAction<DropEvent>("layout/dropApplied");
export const updateFieldSize = createAction<UpdateFieldSizeType>(
  "overlay/updateFieldSize",
);
export const addBlankPage = createAction<AddBlankPageType>(
  "document/addBlankPage",
);
export const deleteBlockRefAction = createAction<DeleteBlockRefType>(
  "document/deleteBlockRefAction",
);
export const deletePageAction = createAction<{
  pageId: PageId;
  instanceIds: string[];
  overlayIds: string[];
}>("document/deletePageAction");
