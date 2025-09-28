import { OverlayId, PageId } from "@/interfaces/common";
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

export const insertFieldCommitted = createAction<InsertFieldPayload>(
  "editor/insertFieldCommitted",
);
export const dropApplied = createAction<DropEvent>("layout/dropApplied");
export const updateFieldSize = createAction<UpdateFieldSizeType>(
  "overlay/updateFieldSize",
);
