"use client";

import React, { memo } from "react";
import { useAppSelector } from "@/lib/hooks";
import DocumentPage from "./pages/DocumentPage";
import { selectDocPageIds } from "@/lib/features/document/documentSlice";

const DocumentCanvas = () => {
  const pageIds = useAppSelector(selectDocPageIds);
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
