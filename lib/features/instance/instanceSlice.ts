import { InstanceId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { Templates } from "@/interfaces/enum";
import { InstanceType } from "@/interfaces/instance";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";
import {
  dropApplied,
  insertFieldCommitted,
} from "@/lib/features/editor/actions";

type InstanceSliceState = Normalized<InstanceType>;

const initialState: InstanceSliceState = {
  byId: {
    ["inst-title"]: {
      id: "inst-title" as InstanceId,
      templateId: Templates.Text,
      data: {
        content: "",
      },
      props: { variant: "h1" },
      contentStyle: {},
      layoutStyle: {},
    },
  },
};

export const instancesSlice = createAppSlice({
  name: "instances",
  initialState,
  reducers: (create) => ({
    updateTextAreaFieldContent: create.reducer(
      (
        state,
        action: PayloadAction<{
          data: { content: string };
          instanceId: InstanceId;
        }>,
      ) => {
        const { data, instanceId } = action.payload;
        if (instanceId) {
          state.byId[instanceId].data = data;
        }
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(dropApplied, (state, action) => {
        const instance = action.payload.payload.data.instance;
        const instanceId = instance!.id as InstanceId;
        state.byId[instanceId] = instance as InstanceType;
      })
      .addCase(insertFieldCommitted, (state, action) => {
        const { instance } = action.payload;
        state.byId[instance.id] = instance;
      });
  },
  selectors: {
    selectInstancesById: (state) => state.byId,
  },
});

export const { updateTextAreaFieldContent } = instancesSlice.actions;

export const { selectInstancesById } = instancesSlice.selectors;

// Parametric selector
export const selectInstance = createSelector(
  [selectInstancesById, (_: RootState, instanceId: InstanceId) => instanceId],
  (instances, instanceId) => instances[instanceId],
);
