import { OverlayId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { OverlayItem } from "@/interfaces/overlay";
import {
  insertFieldCommitted,
  updateFieldSize,
} from "@/lib/features/editor/actions";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";

type OverlaySliceState = Normalized<OverlayItem>;

const initialState: OverlaySliceState = { byId: {} };

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
  }),
  extraReducers: (builder) => {
    builder
      .addCase(insertFieldCommitted, (state, { payload }) => {
        const { overlay } = payload;
        state.byId[overlay.id] = overlay;
      })
      .addCase(updateFieldSize, (state, { payload }) => {
        const { overlay, width, height } = payload;
        state.byId[overlay.id].style = {
          ...state.byId[overlay.id].style,
          width,
          height,
        };
      });
  },
});

export const { updateFiledPosition } = overlaySlice.actions;

export const selectOverlayById = createSelector(
  [
    (state: RootState) => state.overlays.byId,
    (_: RootState, overlayId: OverlayId) => overlayId,
  ],
  (byId, overlayId) => byId[overlayId],
);
