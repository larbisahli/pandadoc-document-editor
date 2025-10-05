import { OverlayId, PageId } from "@/interfaces/common";
import { AppDispatch, RootState } from "@/lib/store";
import { newInstanceId, newOverlayId } from "@/utils/ids";

import { DropEvent } from "@/interfaces/dnd";
import { Templates } from "@/interfaces/enum";
import { OverlayItem } from "@/interfaces/overlay";
import { InstanceType } from "@/interfaces/instance";
import { createAction } from "@reduxjs/toolkit";

interface InsertFieldFlowType {
  pageId: PageId;
  instance: DropEvent["payload"]["data"]["instance"];
  overlay: DropEvent["payload"]["data"]["overlay"];
}

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
  "document/insertFieldCommitted",
);
export const updateFieldSize = createAction<UpdateFieldSizeType>(
  "overlay/updateFieldSize",
);

export const insertFieldFlow =
  (args: InsertFieldFlowType) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { instance, overlay, pageId } = args;

    // Get active recipient
    const state = getState();
    const selectedRecipientId = state.recipients.selectedId;

    // Generate IDs
    const instanceId = newInstanceId();
    const overlayId = newOverlayId();

    const payload: InsertFieldPayload = {
      pageId,
      instance: {
        ...instance!,
        id: instanceId,
        recipientId: selectedRecipientId,
      },
      overlay: {
        ...overlay!,
        id: overlayId,
        instanceId,
      },
    };

    dispatch(insertFieldCommitted(payload));
  };

export const updateFieldSizeFlow =
  (args: UpdateFieldSizeType) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updateFieldSize(args));
  };
