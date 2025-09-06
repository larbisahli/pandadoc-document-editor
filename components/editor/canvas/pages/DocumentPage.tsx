"use client";

import { useAppSelector } from "@/lib/hooks";
import { selectPageRootId } from "@/lib/features/layout/layoutSlice";
import { memo } from "react";
import { PageId } from "@/interfaces/common";
import ContentHeader from "../../ui/ContentHeader";
import DocumentHeader from "./DocumentHeader";
import LayoutRenderer from "../layout/LayoutRenderer";
import OverlayLayer from "../overlays/OverlayLayer";
import { PageContext } from "../context/PageContext";

interface DocumentPageProps {
  pageId: PageId;
}

const DocumentPage = ({ pageId }: DocumentPageProps) => {
  const rootId = useAppSelector((state) => selectPageRootId(state, pageId));

  if (!rootId || !pageId) return null;

  return (
    <PageContext value={{ pageId }}>
      <div className="relative h-full">
        <div className="h-full">
          {/* Content-head */}
          <ContentHeader />
          <div className="flex min-h-[1065px] w-[816px] flex-col bg-white shadow-xl">
            {/* Document-header */}
            <div className="mx-[50px]">
              <DocumentHeader />
            </div>
            {/* Document-body */}
            <div
              data-node-type="pageContent"
              className="relative h-full flex-1"
            >
              <div className="absolute inset-0 mx-[50px]">
                <div
                  id={pageId}
                  data-node-type="layout-root"
                  className="relative flex h-full flex-col outline-none"
                >
                  {/* Flow layer: normal document layout */}
                  <LayoutRenderer nodeId={rootId} />
                  {/* Free layer: absolute overlays above flow */}
                  <div>LOOOOOL</div>
                  <OverlayLayer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContext>
  );
};

export default memo(DocumentPage);
