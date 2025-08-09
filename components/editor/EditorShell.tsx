"use client";

import DocumentCanvas from "./canvas/DocumentCanvas";
import EditorToolbar from "./toolbar/EditorToolbar";

const EditorShell = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#efedec]">
      <EditorToolbar />
      <div className="relative flex-1 overflow-auto">
        <div className="mx-auto table px-6">
          {/* Title */}
          <div className="w-[816px] px-2 pt-4">
            <span className="text-lg font-semibold">Sample Invoice</span>
          </div>
          <DocumentCanvas />
        </div>
      </div>
    </div>
  );
};

export default EditorShell;
