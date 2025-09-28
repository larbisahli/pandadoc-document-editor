"use client";

import React, { memo } from "react";
import { useAppSelector } from "@/lib/hooks";
import DocumentPage from "./pages/DocumentPage";
import { selectDocPageIds } from "@/lib/features/document/documentSlice";
import { usePageVisibilityObserver } from "../hooks/usePageVisibilityObserver";

const DocumentCanvas = () => {
  const pageIds = useAppSelector(selectDocPageIds);

  // This help us know what document page is currently visible
  usePageVisibilityObserver(pageIds, {
    root: null,
    majorityThreshold: 0.5,
    debounceMs: 80, // smooth out rapid changes
  });

  return (
    <div
      id="document-canvas"
      className="relative"
      role="region"
      aria-label="Document canvas"
    >
      {pageIds.map((pageId) => (
        <DocumentPage key={pageId} pageId={pageId} />
      ))}
    </div>
  );
};

export default memo(DocumentCanvas);
