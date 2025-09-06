import { PageId } from "@/interfaces/common";
import { InstanceType } from "@/interfaces/instance";
import { OverlayItem } from "@/interfaces/overlay";
import { TemplateType } from "@/interfaces/template";
import { createAction } from "@reduxjs/toolkit";

export type InsertFieldPayload = {
  pageId: PageId;
  instance: InstanceType;
  template: TemplateType;
  overlay: OverlayItem;
};

export const insertFieldCommitted = createAction<InsertFieldPayload>(
  "editor/insertFieldCommitted",
);
