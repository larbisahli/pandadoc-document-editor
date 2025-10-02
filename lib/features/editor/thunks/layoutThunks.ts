import { DropEvent } from "@/interfaces/dnd";
import { AppDispatch, RootState } from "@/lib/store";
import { dropApplied } from "../actions";
import { newInstanceId } from "@/utils/ids";
import { requestFocusOnDrop } from "@/lib/features/ui/uiSlice";

export const dropCommitted =
  (dropEvent: DropEvent) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    // Put any orchestration/side-effects here if needed (analytics, sounds, etc.)
    // ⚡ Mutate a *copy* of byId (because we’re outside reducer)
    // const draft = structuredClone(page.byId);

    const instanceId = newInstanceId();

    // TODO work on the payload here i don't like it
    const payload = {
      ...dropEvent,
      payload: {
        data: {
          ...dropEvent.payload.data,
          instance: {
            ...dropEvent?.payload?.data?.instance,
            id: instanceId,
          },
        },
      },
    } as DropEvent;
    dispatch(dropApplied(payload));
    dispatch(requestFocusOnDrop({ instanceId }));
  };
