import { PageId } from "@/interfaces/common";
import { AppDispatch, RootState } from "@/lib/store";
import { newInstanceId, newOverlayId } from "@/utils/ids";
import { insertFieldCommitted, InsertFieldPayload } from "../actions";
import { DropEvent } from "@/interfaces/dnd";

interface InsertFieldFlowType {
  pageId: PageId;
  offsetX: number;
  offsetY: number;
  instance: DropEvent["payload"]["data"]["instance"];
  overlay: DropEvent["payload"]["data"]["overlay"];
}

export const insertFieldFlow =
  (args: InsertFieldFlowType) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { instance, overlay, offsetX, offsetY, pageId } = args;

    // Generate IDs
    const instanceId = newInstanceId();
    const overlayId = newOverlayId();

    const payload: InsertFieldPayload = {
      pageId,
      instance: {
        ...instance!,
        id: instanceId,
      },
      overlay: {
        ...overlay!,
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
