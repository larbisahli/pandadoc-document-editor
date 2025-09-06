import { Normalized } from "@/interfaces/document";
import {
  BlockKind,
  FieldKind,
  Templates,
  TemplateTypes,
} from "@/interfaces/enum";
import { TemplateType } from "@/interfaces/template";
import { insertFieldCommitted } from "@/lib/features/editor/actions";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

type TemplateSliceState = Normalized<TemplateType>;

const initialState: TemplateSliceState = {
  byId: {
    [Templates.Text]: {
      id: Templates.Text,
      type: TemplateTypes.Block,
      kind: BlockKind.Text,
    },
    [Templates.Image]: {
      id: Templates.Image,
      type: TemplateTypes.Block,
      kind: BlockKind.Image,
    },
    [Templates.Signature]: {
      id: Templates.Signature,
      type: TemplateTypes.Field,
      kind: FieldKind.TextArea,
    },
  },
};

export const templatesSlice = createAppSlice({
  name: "templates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(insertFieldCommitted, (state, { payload }) => {
      const templateId = payload.template?.id;
      const template = state.byId[templateId] ?? payload.template;
      if (!state.byId[templateId]) {
        state.byId[templateId] = template;
      }
    });
  },
  selectors: {
    selectTemplatesById: (state) => state.byId,
  },
});

// export const { upsertTemplate } = templatesSlice.actions;

export const { selectTemplatesById } = templatesSlice.selectors;

// Parametric selector
export const selectTemplate = createSelector(
  [selectTemplatesById, (_: RootState, templateId: Templates) => templateId],
  (templates, templateId) => templates[templateId],
);
