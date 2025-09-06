import { InstanceId, OverlayId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { OverlayItem } from "@/interfaces/overlay";
import { insertFieldCommitted } from "@/lib/features/editor/actions";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";

type OverlaySliceState = Normalized<OverlayItem>;

const initialState: OverlaySliceState = {
  byId: {
    ["ov-sign"]: {
      id: "ov-sign" as OverlayId,
      instanceId: "fld-sign" as InstanceId,
      position: {
        offsetX: 18,
        offsetY: 129,
      },
      style: {
        width: 214,
        height: 106,
      },
    },
    ["ov-sign-1"]: {
      id: "ov-sign-1" as OverlayId,
      instanceId: "fld-sign" as InstanceId,
      position: {
        offsetX: 188,
        offsetY: 229,
      },
      style: {
        width: 214,
        height: 106,
      },
    },
  },
};

export const overlaySlice = createAppSlice({
  name: "overlays",
  initialState,
  reducers: (create) => ({
    updateFiledPosition: create.reducer(
      (
        state,
        action: PayloadAction<{
          overlayId: OverlayId;
          offsetX: number;
          offsetY: number;
        }>,
      ) => {
        const overlayId = action.payload.overlayId;
        const offsetX = action.payload.offsetX;
        const offsetY = action.payload.offsetY;
        if (overlayId) {
          state.byId[overlayId].position.offsetX = offsetX;
          state.byId[overlayId].position.offsetY = offsetY;
        }
      },
    ),
    updateOverlaySize: create.reducer(
      (
        state,
        action: PayloadAction<{
          overlayId: OverlayId;
          width: number;
          height: number;
        }>,
      ) => {
        const { overlayId, width, height } = action.payload;
        if (overlayId) {
          state.byId[overlayId].style.width = width;
          state.byId[overlayId].style.height = height;
        }
      },
    ),
  }),
  extraReducers: (builder) => {
    builder.addCase(insertFieldCommitted, (state, { payload }) => {
      const { overlay } = payload;
      state.byId[overlay.id] = overlay;
    });
  },
});

export const { updateFiledPosition, updateOverlaySize } = overlaySlice.actions;

export const selectOverlayById = createSelector(
  [
    (state: RootState) => state.overlays.byId,
    (_: RootState, overlayId: OverlayId) => overlayId,
  ],
  (byId, overlayId) => byId[overlayId],
);
