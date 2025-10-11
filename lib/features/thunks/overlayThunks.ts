import { InstanceId, OverlayId, PageId } from "@/interfaces/common";
import { AppDispatch, RootState } from "@/lib/store";
import { newInstanceId, newOverlayId } from "@/utils/ids";

import { DropEvent } from "@/interfaces/dnd";
import { Templates } from "@/interfaces/enum";
import { OverlayItem } from "@/interfaces/overlay";
import { InstanceType } from "@/interfaces/instance";
import { createAction } from "@reduxjs/toolkit";
import { nowUnixMs } from "@/utils";

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

export interface deleteFieldType {
  overlayId: OverlayId;
  instanceId: InstanceId;
}

export const insertFieldCommittedAction = createAction<InsertFieldPayload>(
  "document/insertFieldCommittedAction",
);
export const updateFieldSizeAction = createAction<UpdateFieldSizeType>(
  "overlay/updateFieldSizeAction",
);
export const deleteFieldAction = createAction<deleteFieldType>(
  "overlay/deleteFieldAction",
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
        createdAt: nowUnixMs(),
        updatedAt: nowUnixMs(),
      },
      overlay: {
        ...overlay!,
        id: overlayId,
        instanceId,
      },
    };

    dispatch(insertFieldCommittedAction(payload));
  };

export const updateFieldSizeFlow =
  (args: UpdateFieldSizeType) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updateFieldSizeAction(args));
  };

export const deleteField =
  (args: deleteFieldType) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(deleteFieldAction(args));
  };
