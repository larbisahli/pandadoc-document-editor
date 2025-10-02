import { InstanceId } from "@/interfaces/common";
import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  pendingFocusInstanceId: InstanceId | null; // one-shot request set on drop
};

const initialState: UIState = {
  pendingFocusInstanceId: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // called by DnD drop handler
    requestFocusOnDrop(
      state,
      action: PayloadAction<{ instanceId: InstanceId }>,
    ) {
      state.pendingFocusInstanceId = action.payload.instanceId;
    },
    // consumed by the block when it sees its id pending
    consumePendingFocus(
      state,
      action: PayloadAction<{ instanceId: InstanceId }>,
    ) {
      if (state.pendingFocusInstanceId === action.payload?.instanceId) {
        state.pendingFocusInstanceId = null;
      }
    },
  },
});

export const { requestFocusOnDrop, consumePendingFocus } = uiSlice.actions;

export const selectPendingFocusInstanceId = (s: RootState) =>
  s.ui.pendingFocusInstanceId as InstanceId | null;
