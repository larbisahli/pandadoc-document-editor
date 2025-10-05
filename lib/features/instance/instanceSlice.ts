import { DataType, InstanceId, TextDataType } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { InstanceType } from "@/interfaces/instance";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";
import { Templates } from "@/interfaces/enum";
import type { JSONContent } from "@tiptap/core";
import { dropApplied } from "../thunks/layoutThunks";
import { insertFieldCommitted } from "../thunks/overlayThunks";
import {
  addBlankPage,
  deleteBlockRefAction,
  deletePageAction,
} from "../thunks/documentThunks";

type InstanceSliceState = Normalized<InstanceType>;

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const initialState: InstanceSliceState = {
  byId: {
    inst_z0w6lgm234iq: {
      id: "inst_z0w6lgm234iq" as InstanceId,
      templateId: Templates.Text,
      data: {
        content: EMPTY_DOC,
      },
    },
  },
};

export const instancesSlice = createAppSlice({
  name: "instances",
  initialState,
  reducers: (create) => ({
    updateInstanceDataField: create.reducer(
      (
        state,
        action: PayloadAction<{
          data: DataType;
          instanceId: InstanceId;
        }>,
      ) => {
        const { data, instanceId } = action.payload;
        if (instanceId) {
          state.byId[instanceId].data = data;
        }
      },
    ),
    saveInstanceEditorRaw(
      state,
      { payload }: PayloadAction<{ instanceId: InstanceId; raw: JSONContent }>,
    ) {
      const instance = state.byId[payload.instanceId] as { data: TextDataType };
      if (!instance.data.content) return;
      instance.data.content = payload.raw;
    },
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
      })
      .addCase(addBlankPage, (state, action) => {
        const event = action.payload;
        state.byId[event.instanceId] = {
          id: event.instanceId,
          templateId: Templates.Text,
          data: {
            content: { type: "doc", content: [{ type: "paragraph" }] },
          },
        };
      })
      .addCase(deleteBlockRefAction, (state, action) => {
        const { instanceId } = action.payload;
        delete state.byId[instanceId];
      })
      .addCase(deletePageAction, (state, { payload }) => {
        const { instanceIds } = payload;
        for (const id of instanceIds) {
          delete state.byId[id];
        }
      });
  },
  selectors: {
    selectInstancesById: (state) => state.byId,
  },
});

export const { saveInstanceEditorRaw, updateInstanceDataField } =
  instancesSlice.actions;

export const { selectInstancesById } = instancesSlice.selectors;

// Parametric selector
export const selectInstance = createSelector(
  [selectInstancesById, (_: RootState, instanceId: InstanceId) => instanceId],
  (instances, instanceId) => instances[instanceId],
);

export const selectInstanceEditorRaw = (s: RootState, id: InstanceId) =>
  (s.instances.byId[id]?.data as TextDataType)?.content;
