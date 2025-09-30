import { InstanceId, OverlayId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { OverlayItem } from "@/interfaces/overlay";
import {
  deletePageAction,
  insertFieldCommitted,
  updateFieldSize,
} from "@/lib/features/editor/actions";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";

type OverlaySliceState = Normalized<OverlayItem>;

const initialState: OverlaySliceState = {
  byId: {
    ov_5c0v2vfbfd30: {
      position: {
        offsetX: 590,
        offsetY: 934,
      },
      style: {
        width: 117.49,
        height: 59.85,
      },
      settings: {},
      id: "ov_5c0v2vfbfd30" as OverlayId,
      instanceId: "inst_ula95gy1j4st" as InstanceId,
    },
    ov_520vspjf9j1a: {
      position: {
        offsetX: 557.48,
        offsetY: 895,
      },
      style: {
        width: 150,
        height: 26,
      },
      settings: {},
      id: "ov_520vspjf9j1a" as OverlayId,
      instanceId: "inst_u4864bhvokcy" as InstanceId,
    },
    ov_h3v6s8f5l4j9: {
      position: {
        offsetX: 8,
        offsetY: 937.7,
      },
      style: {
        width: 114.31,
        height: 56.16,
      },
      settings: {},
      id: "ov_h3v6s8f5l4j9" as OverlayId,
      instanceId: "inst_n7qobwtza7wr" as InstanceId,
    },
    ov_c9zmx9tew63h: {
      position: {
        offsetX: 8,
        offsetY: 895,
      },
      style: {
        width: 150,
        height: 26,
      },
      settings: {},
      id: "ov_c9zmx9tew63h" as OverlayId,
      instanceId: "inst_bju9zfz9yv7l" as InstanceId,
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
      })
      .addCase(deletePageAction, (state, { payload }) => {
        const { overlayIds } = payload;
        for (const id of overlayIds) {
          delete state.byId[id];
        }
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
