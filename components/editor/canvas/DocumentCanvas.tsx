"use client";

import Tooltip from "@/components/ui/Tooltip";
import { Ellipsis, Plus } from "lucide-react";
import TextBlock from "../blocks/TextBlock";

const DocumentCanvas = () => {
  return (
    <>
      {/* Content-1 */}
      <div>
        <div className="relative mb-0">
          <div className="">
            {/* Content-head */}
            <div className="mx-auto min-h-[45px] px-2 py-[4px]">
              <div className="relative flex h-[24px] items-center justify-between">
                <p className="text-muted text-sm">3 pages</p>
                <Tooltip content="Add content" placement="bottom">
                  <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
                    <Plus size={20} />
                  </button>
                </Tooltip>
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
                    <div className="p-5">
                      <TextBlock />
                    </div>
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
                <Tooltip content="Add content" placement="bottom">
                  <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
                    <Plus size={20} />
                  </button>
                </Tooltip>
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
                <Tooltip content="Add content" placement="bottom">
                  <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
                    <Plus size={20} />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentCanvas;
