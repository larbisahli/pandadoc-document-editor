import { InstanceId, NodeId, OverlayId, PageId } from "@/interfaces/common";
import { LayoutMultiPageState } from "@/interfaces/document";
import { NodeDirection, NodeKind } from "@/interfaces/enum";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { applyDrop } from "./layout-apply-drop";
import { detachFromParent } from "./helpers";
import { insertFieldCommitted } from "../thunks/overlayThunks";
import { dropApplied } from "../thunks/layoutThunks";
import {
  addBlankPage,
  deleteBlockRefAction,
  deletePageAction,
} from "../thunks/documentThunks";

type LayoutSliceState = LayoutMultiPageState;

const initialState: LayoutSliceState = {
  pages: {
    ["page_n261uo3yzqhq"]: {
      rootId: "root_ts7vv3b74iuk" as NodeId,
      byId: {
        root_ts7vv3b74iuk: {
          id: "root_ts7vv3b74iuk" as NodeId,
          parentId: null,
          kind: NodeKind.Container,
          direction: "column" as NodeDirection,
          children: ["node_qm5dtiyiavdu"] as NodeId[],
          layoutStyle: {},
        },
        node_qm5dtiyiavdu: {
          id: "node_qm5dtiyiavdu" as NodeId,
          kind: NodeKind.BlockRef,
          parentId: "root_ts7vv3b74iuk" as NodeId,
          instanceId: "inst_z0w6lgm234iq" as InstanceId,
          layoutStyle: {},
        },
      },
      overlayIds: [] as OverlayId[],
    },
  },
  visiblePageId: "page_n261uo3yzqhq" as PageId,
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
      })
      .addCase(addBlankPage, (state, action) => {
        const event = action.payload;
        state.pages[event.pageId] = {
          rootId: event?.rootId,
          byId: {
            [event?.rootId]: {
              id: event?.rootId as NodeId,
              parentId: null,
              kind: NodeKind.Container,
              direction: NodeDirection.Column,
              children: [event?.nodeId],
              layoutStyle: {},
            },
            [event?.nodeId]: {
              id: event?.nodeId,
              kind: NodeKind.BlockRef,
              parentId: event?.rootId,
              instanceId: event.instanceId,
              layoutStyle: {},
            },
          },
          overlayIds: [],
        };
      })
      .addCase(deleteBlockRefAction, (state, action) => {
        const { nodeId, pageId } = action.payload;

        const page = state.pages?.[pageId];
        if (!page) return;

        const node = page.byId?.[nodeId];
        if (!node) return;

        // Detach from parent and fix siblings/parent structure
        detachFromParent(page, nodeId);

        // Delete the node itself
        delete page.byId[nodeId];
      })
      .addCase(deletePageAction, (state, { payload }) => {
        const { pageId } = payload;
        const total = Object.keys(state.pages).length;

        if (!state.pages[pageId]) return;

        if (total <= 1) {
          // Only page present: keep it; you can log/warn in dev if desired.
          return;
        }

        // Remove the page layout
        delete state.pages[pageId];

        // If it was visible, pick a replacement (first remaining)
        if (state.visiblePageId === pageId) {
          const remaining = Object.keys(state.pages);
          state.visiblePageId = remaining[0] as PageId;
        }
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
