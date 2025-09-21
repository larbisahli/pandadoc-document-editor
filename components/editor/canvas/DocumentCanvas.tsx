"use client";

import React, { memo } from "react";
import { useAppSelector } from "@/lib/hooks";
import DocumentPage from "./pages/DocumentPage";
import EmptyDocument from "./pages/EmptyDocument";
import { selectDocPageIds } from "@/lib/features/document/documentSlice";

const DocumentCanvas = () => {
  const pageIds = useAppSelector(selectDocPageIds);

  // TODO Think about initial default blank page in redux state
  if (!pageIds?.length) {
    return <EmptyDocument />;
  }

  return (
    <div
      id="document-canvas" // Important
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
