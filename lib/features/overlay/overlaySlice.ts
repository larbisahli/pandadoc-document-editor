import { InstanceId, OverlayId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { OverlayItem } from "@/interfaces/overlay";
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
  },
  allIds: ["fld-title"],
};

export const overlaySlice = createAppSlice({
  name: "overlays",
  initialState,
  reducers: (create) => ({
    addFiled: create.reducer(
      (state, action: PayloadAction<{ title: string }>) => {},
    ),
  }),
});

export const { addFiled } = overlaySlice.actions;

export const selectOverlayById = createSelector(
  [
    (state: RootState) => state.overlays.byId,
    (_: RootState, overlayId: OverlayId) => overlayId,
  ],
  (byId, overlayId) => byId[overlayId],
);
