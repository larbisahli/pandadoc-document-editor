import { Normalized } from "@/interfaces/document";
import {
  BlockKind,
  FieldKind,
  Templates,
  TemplateTypes,
} from "@/interfaces/enum";
import { TemplateType } from "@/interfaces/template";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

type TemplateSliceState = Normalized<TemplateType>;

// Here add default templates and later you can add them on demand like network request
const initialState: TemplateSliceState = {
  byId: {
    [Templates.Text]: {
      id: Templates.Text,
      type: TemplateTypes.Block,
      kind: BlockKind.Text,
    },
    [Templates.Textarea]: {
      id: Templates.Textarea,
      type: TemplateTypes.Field,
      kind: FieldKind.TextArea,
      valueSchema: {},
      propsSchema: {},
    },
    [Templates.Image]: {
      id: Templates.Image,
      type: TemplateTypes.Block,
      kind: BlockKind.Image,
    },
    [Templates.Video]: {
      id: Templates.Video,
      type: TemplateTypes.Block,
      kind: BlockKind.Video,
    },
    [Templates.PageBreak]: {
      id: Templates.PageBreak,
      type: TemplateTypes.Block,
      kind: BlockKind.PageBreak,
    },
    [Templates.Signature]: {
      id: Templates.Signature,
      type: TemplateTypes.Field,
      kind: FieldKind.Signature,
    },
    [Templates.Initials]: {
      id: Templates.Initials,
      type: TemplateTypes.Field,
      kind: FieldKind.Initials,
    },
    [Templates.Checkbox]: {
      id: Templates.Checkbox,
      type: TemplateTypes.Field,
      kind: FieldKind.Checkbox,
    },
    [Templates.Stamp]: {
      id: Templates.Stamp,
      type: TemplateTypes.Field,
      kind: FieldKind.Stamp,
    },
    [Templates.TableOfContents]: {
      id: Templates.TableOfContents,
      type: TemplateTypes.Block,
      kind: BlockKind.TableOfContents,
    },
  },
};

export const templatesSlice = createAppSlice({
  name: "templates",
  initialState,
  reducers: {},
  selectors: {
    selectTemplatesById: (state) => state.byId,
  },
});

export const { selectTemplatesById } = templatesSlice.selectors;

// Parametric selector
export const selectTemplate = createSelector(
  [selectTemplatesById, (_: RootState, templateId: Templates) => templateId],
  (templates, templateId) => templates[templateId],
);
