import { PageId } from "@/interfaces/common";
import { DropEvent } from "@/interfaces/dnd";
import { InstanceType } from "@/interfaces/instance";
import { OverlayItem } from "@/interfaces/overlay";
import { createAction } from "@reduxjs/toolkit";

export type InsertFieldPayload = {
  pageId: PageId;
  instance: InstanceType;
  overlay: OverlayItem;
};

export const insertFieldCommitted = createAction<InsertFieldPayload>(
  "editor/insertFieldCommitted",
);

export const dropApplied = createAction<DropEvent>("layout/dropApplied");
