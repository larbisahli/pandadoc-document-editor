import { InstanceId, NodeId, OverlayId, PageId } from "@/interfaces/common";
import { LayoutMultiPageState } from "@/interfaces/document";
import { NodeDirection, NodeKind } from "@/interfaces/enum";
import { BlockRefNode, ContainerNode, LayoutNode } from "@/interfaces/layout";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";

type LayoutSliceState = LayoutMultiPageState;

const initialState: LayoutSliceState = {
  pages: {
    ["page_1"]: {
      rootId: "root_1" as NodeId,
      byId: {
        ["root_1"]: {
          id: "root_1" as NodeId,
          kind: "container" as NodeKind,
          direction: "column" as NodeDirection,
          children: ["rowTop", "rowBottom"] as NodeId[],
          layoutStyle: {},
        },
        ["rowTop"]: {
          id: "rowTop" as NodeId,
          kind: "container" as NodeKind,
          direction: "row" as NodeDirection,
          children: ["colTopLeft", "colTopMiddle", "colTopRight"] as NodeId[],
          layoutStyle: {},
        },
        ["rowBottom"]: {
          id: "rowBottom" as NodeId,
          kind: "container" as NodeKind,
          direction: "row" as NodeDirection,
          children: ["colBottomLeft", "colBottomRight"] as NodeId[],
          layoutStyle: {},
        },
        ["colTopLeft"]: {
          id: "colTopLeft" as NodeId,
          kind: "container" as NodeKind,
          direction: "column" as NodeDirection,
          children: ["titleLeaf", "introLeaf", "titleLeaf2"] as NodeId[],
          layoutStyle: {
            width: "33.33%",
          },
        },
        ["colBottomLeft"]: {
          id: "colBottomLeft" as NodeId,
          kind: "container" as NodeKind,
          direction: "column" as NodeDirection,
          children: ["titleLeaf", "introLeaf", "titleLeaf2"] as NodeId[],
          layoutStyle: {
            width: "50%",
          },
        },
        ["colBottomRight"]: {
          id: "colBottomRight" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {
            width: "50%",
          },
        },
        ["titleLeaf"]: {
          id: "titleLeaf" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {},
        },
        ["titleLeaf2"]: {
          id: "titleLeaf2" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {},
        },
        ["introLeaf"]: {
          id: "introLeaf" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-intro" as InstanceId,
          layoutStyle: {},
        },
        ["colTopRight"]: {
          id: "colTopRight" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
          layoutStyle: {
            width: "33.33%",
          },
        },
        ["colTopMiddle"]: {
          id: "colTopMiddle" as NodeId,
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
