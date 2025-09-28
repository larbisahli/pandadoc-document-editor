import { PageId } from "@/interfaces/common";
import { AppDispatch, RootState } from "@/lib/store";
import { newInstanceId, newOverlayId } from "@/utils/ids";
import {
  insertFieldCommitted,
  InsertFieldPayload,
  updateFieldSize,
  UpdateFieldSizeType,
} from "../actions";
import { DropEvent } from "@/interfaces/dnd";

interface InsertFieldFlowType {
  pageId: PageId;
  instance: DropEvent["payload"]["data"]["instance"];
  overlay: DropEvent["payload"]["data"]["overlay"];
}

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
