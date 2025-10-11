import { defaultTemplates } from "@/core/templates";
import { Normalized } from "@/interfaces/document";
import { Templates } from "@/interfaces/enum";
import { FieldTemplateType, TemplateType } from "@/interfaces/template";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";
import { updateFieldSizeAction } from "../thunks/overlayThunks";

type TemplateSliceState = Normalized<TemplateType>;

// Here add default templates and later you can add them on demand like network request
const initialState: TemplateSliceState = {
  byId: defaultTemplates,
};

export const templatesSlice = createAppSlice({
  name: "templates",
  initialState,
  reducers: {},
  selectors: {
    selectTemplatesById: (state) => state.byId,
  },
  extraReducers: (builder) => {
    builder.addCase(updateFieldSizeAction, (state, { payload }) => {
      const { template, width, height } = payload;
      (state.byId[template.id] as FieldTemplateType).propsSchema.width = width;
      (state.byId[template.id] as FieldTemplateType).propsSchema.height =
        height;
    });
  },
});

export const { selectTemplatesById } = templatesSlice.selectors;

// Parametric selector
export const selectTemplate = createSelector(
  [selectTemplatesById, (_: RootState, templateId: Templates) => templateId],
  (templates, templateId) => templates[templateId],
);
