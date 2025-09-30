import { DocumentId, PageId } from "@/interfaces/common";
import { DocumentMeta } from "@/interfaces/document";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { addBlankPage, deletePageAction } from "../editor/actions";

type DocumentSliceState = DocumentMeta;

// Default blank page
const initialState: DocumentSliceState = {
  id: "doc_aabwbtdbgk5c" as DocumentId,
  title: "Simple invoice",
  pageIds: ["page_n261uo3yzqhq"] as PageId[],
};

export const documentSlice = createAppSlice({
  name: "document",
  initialState,
  reducers: (create) => ({
    updateDocTitle: create.reducer(
      (state, action: PayloadAction<{ title: string }>) => {
        state.title = action.payload.title;
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(addBlankPage, (state, action) => {
        const { pageId, beforePageId, afterPageId } = action.payload;
        let index = state.pageIds.length;
        if (beforePageId) {
          const i = state.pageIds.indexOf(beforePageId);
          if (i !== -1) index = i;
        } else if (afterPageId) {
          const j = state.pageIds.indexOf(afterPageId);
          if (j !== -1) index = j + 1;
        }
        state.pageIds.splice(index, 0, pageId);
      })
      .addCase(deletePageAction, (state, action) => {
        const { pageId } = action.payload;
        const idx = state.pageIds.indexOf(pageId);
        if (idx === -1) return;
        state.pageIds.splice(idx, 1);
      });
  },
  selectors: {
    selectDocTitle: (state) => state.title,
  },
});

export const { updateDocTitle } = documentSlice.actions;

export const { selectDocTitle } = documentSlice.selectors;

const selectDoc = (state: RootState) => state.document;

/**
 * Returns the same array reference until allIds changes
 * Re-renders would happen if we return a new object/array
 * each time because new references fail ===
 */
export const selectDocPageIds = createSelector(selectDoc, (doc) => doc.pageIds);
