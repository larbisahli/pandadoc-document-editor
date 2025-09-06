import { InstanceId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { Templates } from "@/interfaces/enum";
import { InstanceType } from "@/interfaces/instance";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";
import { insertFieldCommitted } from "@/lib/features/editor/actions";

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
    ["inst-intro"]: {
      id: "inst-intro" as InstanceId,
      templateId: Templates.Text,
      data: {
        content: "",
      },
    },
    ["inst-hero"]: {
      id: "inst-hero" as InstanceId,
      templateId: Templates.Image,
      data: {
        content: "",
      },
    },
    ["fld-sign"]: {
      id: "fld-sign" as InstanceId,
      templateId: Templates.Signature,
      data: {
        content: "",
      },
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
    builder.addCase(insertFieldCommitted, (state, { payload }) => {
      const { instance } = payload;
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
