import { NodeId, OverlayId, PageId } from "@/interfaces/common";
import { LayoutMultiPageState } from "@/interfaces/document";
import { NodeDirection, NodeKind } from "@/interfaces/enum";
import {
  dropApplied,
  insertFieldCommitted,
} from "@/lib/features/editor/actions";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { applyDrop } from "@/utils/layout-apply-drop";

type LayoutSliceState = LayoutMultiPageState;

const initialState: LayoutSliceState = {
  pages: {
    ["page_1"]: {
      rootId: "root_1" as NodeId,
      byId: {
        ["root_1"]: {
          id: "root_1" as NodeId,
          parentId: null,
          kind: "container" as NodeKind,
          direction: "column" as NodeDirection,
          children: [] as NodeId[],
          layoutStyle: {},
        },
      },
      overlayIds: [] as OverlayId[],
    },
  },
  visiblePageId: null,
};

export const layoutSlice = createAppSlice({
  name: "layout",
  initialState,
  reducers: (create) => ({
    setVisiblePageId: create.reducer(
      (state, action: PayloadAction<PageId | null>) => {
        state.visiblePageId = action.payload;
      },
    ),
    updateLayoutCalculatedWidth: create.reducer(
      (
        state,
        action: PayloadAction<{
          nodeId: NodeId;
          pageId: PageId;
          width?: string;
        }>,
      ) => {
        const width = action.payload.width;
        const nodeId = action.payload.nodeId;
        const pageId = action.payload.pageId;
        if (width) {
          state.pages[pageId].byId[nodeId].layoutStyle.width = width;
        }
      },
    ),
    // add: {
    //   reducer(state, action: PayloadAction<{ id: string; text: string }>) {
    //     state.push(action.payload);
    //   },
    //   prepare(text: string) {
    //     return { payload: { id: nanoid(), text } };
    //   }
    // },
  }),
  extraReducers: (builder) => {
    builder
      .addCase(insertFieldCommitted, (state, { payload }) => {
        const { pageId, overlay } = payload;
        const page = state.pages[pageId];
        if (page) {
          page.overlayIds.push(overlay.id);
        }
      })
      .addCase(dropApplied, (state, action) => {
        const dropEvent = action.payload;
        const page = state.pages[dropEvent.pageId];
        applyDrop(page.byId, dropEvent, page.rootId);
      });
  },
  selectors: {
    selectAllPages: (state) => state.pages,
    selectVisiblePageId: (state) => state.visiblePageId,
    selectPageById: (state, pageId: PageId) => state.pages[pageId],
    selectPageRootId: (state, pageId: PageId) => state.pages[pageId]?.rootId,
  },
});

export const { setVisiblePageId, updateLayoutCalculatedWidth } =
  layoutSlice.actions;

export const {
  selectVisiblePageId,
  selectPageRootId,
  selectPageById,
  selectAllPages,
} = layoutSlice.selectors;

/**
 * If neither byId nor nodeId changes, the memoized result is returned,
 * Don’t return new arrays/objects from selectors each time unless memoized with createSelector.
 */
export const selectNodeById = createSelector(
  [
    (state: RootState, pageId: PageId) => selectPageById(state, pageId)?.byId,
    (_: RootState, __: PageId, nodeId: NodeId) => nodeId,
  ],
  (byId, nodeId) => (byId ? byId[nodeId] : undefined),
);

export const selectPageOverlayIds = createSelector(
  (state: RootState, pageId: PageId) => selectPageById(state, pageId),
  (page) => page?.overlayIds ?? [],
);

export const selectRowItemLayoutStyle = createSelector(
  [
    (state: RootState, pageId: PageId) => selectPageById(state, pageId)?.byId,
    (_: RootState, __: PageId, nodeId: NodeId) => nodeId,
  ],
  (byId, nodeId) => {
    const node = byId?.[nodeId];
    if (!node) return undefined;
    return node?.layoutStyle;
  },
);
