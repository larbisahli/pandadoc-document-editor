"use client";

import { Ellipsis, Files, Plus, Redo, Undo } from "lucide-react";

const EditorComponent = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#efedec]">
      {/* EditorHeader */}
      <div className="bg-white">
        <div className="border-primary relative flex min-h-[35px] items-center border-b px-4">
          <div className="flex items-center">
            <button className="flex items-center rounded-sm bg-gray-100 p-1 hover:bg-gray-200">
              <Files strokeWidth={1.5} size={20} />
              <span className="text-sm">1</span>
            </button>
            <button className="ml-1 flex items-center rounded-[2px] p-1 px-[4px] hover:bg-gray-100">
              <Plus strokeWidth={1.5} size={20} />
              <span className="text-muted px-1 text-sm font-semibold">
                Document
              </span>
            </button>
            <div className="mr-[2px] ml-[8px] h-[28px] w-[1px] bg-gray-200"></div>
            <div className="text-muted flex items-center">
              <button className="m-1 rounded-[4px] p-1 hover:bg-gray-100">
                <Undo strokeWidth={2.5} size={20} />
              </button>
              <button className="m-1 rounded-[4px] p-1 hover:bg-gray-100">
                <Redo strokeWidth={2.5} size={20} />
              </button>
            </div>
          </div>
          {/* <div className="flex-1 flex justify-end">

          </div> */}
          <div className="ml-auto rounded-[2px] bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            Editing
          </div>
        </div>
      </div>

      {/* EditorContent */}
      <div className="relative flex-1 overflow-auto">
        <div className="mx-auto table px-6">
          {/* Title */}
          <div className="w-[816px] px-2 pt-4">
            <span className="py-1 text-lg font-semibold">Sample Invoice</span>
          </div>
          {/* Content-1 */}
          <div>
            <div className="relative mb-0">
              <div className="">
                {/* Content-head */}
                <div className="mx-auto min-h-[48px] px-2 py-[14px]">
                  <div className="relative flex h-[24px] items-center justify-between">
                    <p className="text-muted text-sm">3 pages</p>
                    <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
                      <Plus size={20} />
                    </button>
                    <button className="text-muted rounded-[2px] p-[1px] hover:bg-gray-200">
                      <Ellipsis size={20} />
                    </button>
                  </div>
                </div>
                {/* Content-body */}
                <div>
                  <div className="bg-white">
                    <div className="outline-none">
                      <div className="flex min-h-[1065px] w-[816px] flex-col shadow-xl">
                        <div className="p-5">PDF</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Content-2 */}
          <div>
            <div className="relative mb-0">
              <div className="">
                {/* Content-head */}
                <div className="mx-auto min-h-[48px] px-2 py-[14px]">
                  <div className="relative flex h-[24px] items-center justify-between">
                    <p className="text-muted text-sm"></p>
                    <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
                      <Plus size={20} />
                    </button>
                    <button className="text-muted rounded-[2px] p-[1px] hover:bg-gray-200">
                      <Ellipsis size={20} />
                    </button>
                  </div>
                </div>
                {/* Content-body */}
                <div>
                  <div className="bg-white">
                    <div className="outline-none">
                      <div className="flex min-h-[1065px] w-[816px] flex-col shadow-xl">
                        <div className="p-5">PDF</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* last-content-foot */}
                <div className="mx-auto min-h-[48px] px-2 py-[14px]">
                  <div className="relative flex h-[24px] items-center justify-center">
                    <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorComponent;
