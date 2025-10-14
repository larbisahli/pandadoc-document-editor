"use client";

import DocumentCanvas from "./canvas/DocumentCanvas";
import EditorToolbar from "./toolbar/EditorToolbar";
import { selectDocTitle } from "@/lib/features/document/documentSlice";
import { useAppSelector } from "@/lib/hooks";

const EditorShell = () => {
  const title = useAppSelector(selectDocTitle);
  return (
    <div className="bg-dots flex h-full w-full flex-col overflow-hidden">
      <EditorToolbar />
      <div id="editor" className="relative flex-1 overflow-auto">
        <div className="mx-auto table px-6">
          {/* Title */}
          <div className="w-[816px] px-2 pt-4">
            <span className="text-xl font-semibold">{title}</span>
          </div>
          <DocumentCanvas />
        </div>
      </div>
    </div>
  );
};

export default EditorShell;
