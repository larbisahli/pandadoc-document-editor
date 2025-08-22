import { TemplateId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { BlockKind, FieldKind, TemplateTypes } from "@/interfaces/enum";
import { TemplateType } from "@/interfaces/template";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";

type TemplateSliceState = Normalized<TemplateType>;

const initialState: TemplateSliceState = {
  byId: {
    ["tpl-text"]: {
      id: "tpl-text" as TemplateId,
      type: TemplateTypes.Block,
      kind: BlockKind.Text,
      requiredSlots: ["content"],
    },
    ["tpl-image"]: {
      id: "tpl-image" as TemplateId,
      type: TemplateTypes.Block,
      kind: BlockKind.Image,
      requiredSlots: ["src", "alt"],
    },
    ["tpl-signature"]: {
      id: "tpl-signature" as TemplateId,
      type: TemplateTypes.Field,
      kind: FieldKind.TextField,
    },
  },
  allIds: ["tpl-text", "tpl-image"],
};

export const templatesSlice = createAppSlice({
  name: "templates",
  initialState,
  reducers: (create) => ({
    addTemplate: create.reducer(
      (state, action: PayloadAction<{ title: string }>) => {},
    ),
  }),
  selectors: {
    selectTemplatesById: (state) => state.byId,
  },
});

export const { addTemplate } = templatesSlice.actions;

export const { selectTemplatesById } = templatesSlice.selectors;

// Parametric selector
export const selectTemplate = createSelector(
  [selectTemplatesById, (_: RootState, templateId: TemplateId) => templateId],
  (templates, templateId) => templates[templateId],
);
