import { AppDispatch, RootState } from "@/lib/store";
import { newInstanceId, newNodeId, newPageId } from "@/utils/ids";
import { InstanceId, NodeId, PageId } from "@/interfaces/common";
import { collectIdsFromLayoutPage } from "./helpers";
import { createAction } from "@reduxjs/toolkit";

export interface AddBlankPageType {
  pageId: PageId;
  rootId: NodeId;
  nodeId: NodeId;
  instanceId: InstanceId;
  beforePageId: PageId | false;
  afterPageId: PageId | false;
}

export interface DeleteBlockRefType {
  pageId: PageId;
  nodeId: NodeId;
  instanceId: InstanceId;
}

export interface DeletePageRefType {
  pageId: PageId;
  instanceIds: string[];
  overlayIds: string[];
}

export const addBlankPage = createAction<AddBlankPageType>(
  "document/addBlankPage",
);
export const deleteBlockRefAction = createAction<DeleteBlockRefType>(
  "document/deleteBlockRefAction",
);
export const deletePageAction = createAction<DeletePageRefType>(
  "document/deletePageAction",
);

export const insertBlankPage =
  (event: { targetPageId: PageId; isLast: boolean }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const pageId = newPageId();
    const rootId = newNodeId();
    const nodeId = newNodeId();
    const instanceId = newInstanceId();
    const payload = {
      pageId,
      rootId,
      instanceId,
      nodeId,
      beforePageId: !event.isLast && event.targetPageId,
      afterPageId: event.isLast && event.targetPageId,
    };
    dispatch(addBlankPage(payload));
  };

export const deleteBlockRef =
  (payload: { pageId: PageId; nodeId: NodeId; instanceId: InstanceId }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(deleteBlockRefAction(payload));
  };

export const deletePage =
  (payload: { pageId: PageId }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    // --- Safeguards ---
    const allPages = Object.keys(state.layout.pages); // ordered list
    if (!allPages.length) return; // nothing to do

    const { pageId } = payload;
    if (!allPages.includes(pageId)) {
      console.warn(`[deletePage] pageId not in document.pages: ${pageId}`);
      return;
    }

    // Prevent deleting the last remaining page
    if (allPages.length <= 1) {
      console.warn(
        "[deletePage] safeguard: refusing to delete the only remaining page",
      );
      return;
    }

    const layoutPage = state.layout.pages[pageId];
    const { overlayIds, instanceIds } = collectIdsFromLayoutPage(
      layoutPage,
      state.overlays,
    );

    dispatch(
      deletePageAction({
        pageId: payload?.pageId,
        instanceIds,
        overlayIds,
      }),
    );
  };
