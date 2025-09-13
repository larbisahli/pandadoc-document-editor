import { InstanceId, NodeId, OverlayId, PageId } from "@/interfaces/common";
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
          children: ["rowTop", "rowBottom"] as NodeId[],
          layoutStyle: {},
        },
        ["rowTop"]: {
          id: "rowTop" as NodeId,
          parentId: "root_1" as NodeId,
          kind: "container" as NodeKind,
          direction: "row" as NodeDirection,
          children: ["colTopLeft", "colTopMiddle", "colTopRight"] as NodeId[],
          layoutStyle: {},
        },
        ["colTopRight"]: {
          id: "colTopRight" as NodeId,
          parentId: "rowTop" as NodeId,
          kind: "container" as NodeKind,
          direction: "row" as NodeDirection,
          children: ["colTopRight-left", "colTopRight-right"] as NodeId[],
          layoutStyle: {
            width: "33.33%",
          },
        },
        ["colTopRight-left"]: {
          id: "colTopRight-left" as NodeId,
          parentId: "colTopRight" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {
            width: "50%",
          },
        },
        ["colTopRight-right"]: {
          id: "colTopRight-right" as NodeId,
          parentId: "colTopRight" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {
            width: "50%",
          },
        },
        ["rowBottom"]: {
          id: "rowBottom" as NodeId,
          parentId: "root_1" as NodeId,
          kind: "container" as NodeKind,
          direction: "row" as NodeDirection,
          children: ["colBottomLeft", "colBottomRight"] as NodeId[],
          layoutStyle: {},
        },
        ["colTopLeft"]: {
          id: "colTopLeft" as NodeId,
          parentId: "rowTop" as NodeId,
          kind: "container" as NodeKind,
          direction: "column" as NodeDirection,
          children: ["titleLeaf", "introLeaf"] as NodeId[],
          layoutStyle: {
            width: "33.33%",
          },
        },
        ["colBottomLeft"]: {
          id: "colBottomLeft" as NodeId,
          parentId: "rowBottom" as NodeId,
          kind: "container" as NodeKind,
          direction: "column" as NodeDirection,
          children: ["titleLeaf2", "introLeaf2"] as NodeId[],
          layoutStyle: {
            width: "50%",
          },
        },
        ["colBottomRight"]: {
          id: "colBottomRight" as NodeId,
          parentId: "rowBottom" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {
            width: "50%",
          },
        },
        ["titleLeaf"]: {
          id: "titleLeaf" as NodeId,
          parentId: "colTopLeft" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {},
        },
        ["titleLeaf2"]: {
          id: "titleLeaf2" as NodeId,
          parentId: "colBottomLeft" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {},
        },
        ["introLeaf"]: {
          id: "introLeaf" as NodeId,
          parentId: "colTopLeft" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {},
        },
        ["introLeaf2"]: {
          id: "introLeaf2" as NodeId,
          parentId: "colBottomLeft" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {},
        },
        ["colTopMiddle"]: {
          id: "colTopMiddle" as NodeId,
          parentId: "rowTop" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {
            width: "33.33%",
          },
        },
      },
      overlayIds: [] as OverlayId[],
    },
  },
};

export const layoutSlice = createAppSlice({
  name: "layout",
  initialState,
  reducers: (create) => ({
    // add: {
    //   reducer(state, action: PayloadAction<{ id: string; text: string }>) {
    //     state.push(action.payload);
    //   },
    //   prepare(text: string) {
    //     // Generate ID here
    //     return { payload: { id: nanoid(), text } };
    //   }
    // },
    addNode: create.reducer(
      (state, action: PayloadAction<{ title: string }>) => {},
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
    selectPageById: (state, pageId: PageId) => state.pages[pageId],
    selectPageRootId: (state, pageId: PageId) => state.pages[pageId]?.rootId,
  },
});

export const { addNode, updateLayoutCalculatedWidth } = layoutSlice.actions;

export const { selectPageRootId, selectPageById, selectAllPages } =
  layoutSlice.selectors;

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

// export const selectNodeChildren = createSelector(
//   [
//     (state: RootState, pageId: PageId) => selectPageById(state, pageId)?.byId,
//     (_: RootState, __: PageId, nodeId: NodeId) => nodeId,
//   ],
//   (byId, nodeId) => {
//     const node = byId?.[nodeId];
//     if (!node) return undefined;
//     return (node as ContainerNode)?.children  ?? [];
//   }
// );
