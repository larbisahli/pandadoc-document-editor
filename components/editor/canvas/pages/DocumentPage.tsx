"use client";

import { useAppSelector } from "@/lib/hooks";
import { selectPageRootId } from "@/lib/features/layout/layoutSlice";
import { memo, useMemo } from "react";
import { PageId } from "@/interfaces/common";
import ContentControl from "../../ui/ContentControl";
import DocumentHeader from "./DocumentHeader";
import DocumentFooter from "./DocumentFooter";
import LayoutRenderer from "../layout/LayoutRenderer";
import OverlayLayer from "../overlays/OverlayLayer";
import { PageContext } from "../context/PageContext";
import { RootDropBoundary } from "./RootDropBoundary";

interface DocumentPageProps {
  pageId: PageId;
}

const DocumentPage = ({ pageId }: DocumentPageProps) => {
  const rootId = useAppSelector((state) => selectPageRootId(state, pageId));
  const value = useMemo(() => ({ pageId }), [pageId]);

  if (!rootId || !pageId) return null;

  return (
    <PageContext value={value}>
      <RootDropBoundary>
        <div className="relative h-full last:mb-[5px]">
          <div className="h-full">
            {/* Content-head */}
            <ContentControl />
            <div className="relative mx-auto flex h-full min-h-[1065px] w-[816px] flex-col bg-white shadow-lg transition-all will-change-transform">
              {/* Document-header */}
              <DocumentHeader />
              {/* Document-body */}
              <div
                data-node-type="pageContent"
                className="relative flex h-full flex-1 flex-col"
              >
                <div className="relative mx-[50px] flex h-full flex-1 flex-col">
                  <div
                    id={pageId}
                    data-node-type="page-root"
                    className="relative flex flex-1 flex-col outline-none"
                  >
                    {/* Flow layer: normal document layout */}
                    <LayoutRenderer nodeId={rootId} />
                    {/* Free layer: absolute overlays above flow */}
                    <OverlayLayer />
                  </div>
                </div>
              </div>
              {/* Document-footer */}
              <DocumentFooter />
            </div>
            <ContentControl renderIfLast />
          </div>
        </div>
      </RootDropBoundary>
    </PageContext>
  );
};

export default memo(DocumentPage);
