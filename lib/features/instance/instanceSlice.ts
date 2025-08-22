import { InstanceId, TemplateId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { InstanceType } from "@/interfaces/instance";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";

type InstanceSliceState = Normalized<InstanceType>;

const initialState: InstanceSliceState = {
  byId: {
    ["inst-title"]: {
      id: "inst-title" as InstanceId,
      templateId: "tpl-text" as TemplateId,
      data: {
        content: "",
      },
      props: { variant: "h1" },
      contentStyle: {},
      layoutStyle: {},
    },
    ["inst-intro"]: {
      id: "inst-intro" as InstanceId,
      templateId: "tpl-text" as TemplateId,
      data: {
        content: "",
      },
    },
    ["inst-hero"]: {
      id: "inst-hero" as InstanceId,
      templateId: "tpl-image" as TemplateId,
      data: {
        content: "",
      },
    },
    ["fld-sign"]: {
      id: "fld-sign" as InstanceId,
      templateId: "tpl-signature" as TemplateId,
      data: {
        content: "",
      },
    },
  },
  allIds: ["inst-title", "inst-intro", "inst-hero"],
};

export const instancesSlice = createAppSlice({
  name: "instances",
  initialState,
  reducers: (create) => ({
    addInstance: create.reducer(
      (state, action: PayloadAction<{ title: string }>) => {},
    ),
  }),
  selectors: {
    selectInstancesById: (state) => state.byId,
  },
});

export const { addInstance } = instancesSlice.actions;

export const { selectInstancesById } = instancesSlice.selectors;

// Parametric selector
export const selectInstance = createSelector(
  [selectInstancesById, (_: RootState, instanceId: InstanceId) => instanceId],
  (instances, instanceId) => instances[instanceId],
);
