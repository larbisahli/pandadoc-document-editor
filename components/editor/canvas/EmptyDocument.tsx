import { memo } from "react";

function EmptyDocument() {
  return (
    <div
      data-ui="empty-document"
      className="text-muted-foreground flex h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      No pages yet. Add a page to get started.
    </div>
  );
}

export default memo(EmptyDocument);
