import { DocumentId, PageId } from "@/interfaces/common";
import { DocumentMeta } from "@/interfaces/document";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";

type DocumentSliceState = DocumentMeta;

const initialState: DocumentSliceState = {
  id: "doc_1" as DocumentId,
  title: "Simple invoice",
  pageIds: ["page_1", "page_2"] as PageId[],
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
