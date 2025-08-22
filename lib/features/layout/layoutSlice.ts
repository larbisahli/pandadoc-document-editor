import { InstanceId, NodeId, OverlayId, PageId } from "@/interfaces/common";
import { LayoutMultiPageState } from "@/interfaces/document";
import { NodeDirection, NodeKind } from "@/interfaces/enum";
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
          children: ["rowTop"] as NodeId[],
        },
        ["rowTop"]: {
          id: "rowTop" as NodeId,
          kind: "container" as NodeKind,
          direction: "row" as NodeDirection,
          children: ["colTopLeft", "colTopRight"] as NodeId[],
        },
        ["colTopLeft"]: {
          id: "colTopLeft" as NodeId,
          kind: "container" as NodeKind,
          direction: "column" as NodeDirection,
          children: ["titleLeaf", "introLeaf", "titleLeaf2"] as NodeId[],
        },
        ["titleLeaf"]: {
          id: "titleLeaf" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
        },
        ["titleLeaf2"]: {
          id: "titleLeaf2" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
        },
        ["introLeaf"]: {
          id: "introLeaf" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-intro" as InstanceId,
        },
        ["colTopRight"]: {
          id: "colTopRight" as NodeId,
          kind: "blockRef" as NodeKind,
          instanceId: "inst-title" as InstanceId,
        },
      },
      overlayIds: ["ov-sign"] as OverlayId[],
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
  }),
  selectors: {
    selectAllPages: (state) => state.pages,
    selectPageById: (state, pageId: PageId) => state.pages[pageId],
    selectPageRootId: (state, pageId: PageId) => state.pages[pageId]?.rootId,
  },
});

export const { addNode } = layoutSlice.actions;

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
