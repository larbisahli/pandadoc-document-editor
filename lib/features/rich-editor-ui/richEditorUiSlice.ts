import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorUI, Formats } from "@/interfaces/rich-editor";
import { InstanceId } from "@/interfaces/common";
import { RootState } from "@/lib/store";

type EditorsState = {
  activeInstanceId: InstanceId | null;
  byId: Record<string, EditorUI>;
};

const initialState: EditorsState = {
  activeInstanceId: null,
  byId: {},
};

export const editorUiSlice = createSlice({
  name: "richEditorUi",
  initialState,
  reducers: {
    setActiveInstance(state, action: PayloadAction<InstanceId | null>) {
      state.activeInstanceId = action.payload;
    },
    ensureEditor(state, a: PayloadAction<{ editorId: string }>) {
      const { editorId } = a.payload;
      state.byId[editorId] ||= { selection: null, formats: {} };
    },
    setSelection(
      state,
      a: PayloadAction<{ editorId: string; selection: EditorUI["selection"] }>,
    ) {
      const { editorId, selection } = a.payload;
      if (state.byId[editorId]) state.byId[editorId].selection = selection;
    },
    setFormats(
      state,
      a: PayloadAction<{ editorId: string; formats: Formats }>,
    ) {
      const { editorId, formats } = a.payload;
      if (state.byId[editorId]) state.byId[editorId].formats = formats;
    },
  },
});

export const { setActiveInstance, ensureEditor, setSelection, setFormats } =
  editorUiSlice.actions;

const selectEditor = (store: RootState, id: string) =>
  store.richEditorUi.byId[id];

export const selectActiveInstanceId = (s: RootState) =>
  s.richEditorUi.activeInstanceId as InstanceId | null;

const EMPTY_FORMATS = Object.freeze({});

export const selectFormats = createSelector(
  [selectEditor],
  (ui) => ui?.formats ?? EMPTY_FORMATS,
);

export const makeSelectHighlightColor = createSelector(
  [selectEditor],
  (ui) => ui?.formats?.highlightColor ?? "",
);
