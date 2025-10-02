"use client";

import RichEditorToolbar from "@/components/ui/RichEditorToolbar";
import Tooltip from "@/components/ui/Tooltip";
import { Files, Plus, Redo, Undo } from "lucide-react";

const EditorToolbar = () => {
  return (
    <div className="bg-white">
      <div className="border-primary relative flex min-h-[35px] items-center border-b px-4">
        <div className="flex items-center">
          <Tooltip
            content="Show documents"
            placement="bottom"
            customClass="-translate-x-1/4!"
          >
            <button className="flex items-center rounded-sm bg-gray-100 p-1 hover:bg-gray-200">
              <Files strokeWidth={1.5} size={20} />
              <span className="text-sm">1</span>
            </button>
          </Tooltip>
          <Tooltip content="Add document" placement="bottom">
            <button className="ml-1 flex items-center rounded-[2px] p-1 px-[4px] hover:bg-gray-100">
              <Plus strokeWidth={1.5} size={20} />
              <span className="text-muted px-1 text-sm font-semibold">
                Document
              </span>
            </button>
          </Tooltip>
          <div className="mr-[2px] ml-[8px] h-[28px] w-[1px] bg-gray-200"></div>
          <HistoryBar />
        </div>
        <div className="flex-1">
          <RichEditorToolbar />
        </div>
        <div className="ml-auto rounded-[2px] bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          Editing
        </div>
      </div>
    </div>
  );
};

function HistoryBar() {
  return (
    <div className="text-muted relative flex items-center">
      <Tooltip content="Undo Ctrl+Z" placement="bottom">
        <button className="m-1 rounded-[4px] p-1 hover:bg-gray-100">
          <Undo strokeWidth={2.5} size={20} />
        </button>
      </Tooltip>
      <Tooltip content="Redo Ctrl+Y" placement="bottom">
        <button className="m-1 rounded-[4px] p-1 hover:bg-gray-100">
          <Redo strokeWidth={2.5} size={20} />
        </button>
      </Tooltip>
    </div>
  );
}

export default EditorToolbar;
