import Tooltip from "@/components/ui/Tooltip";
import { Ellipsis, Plus } from "lucide-react";

const ContentHeader = () => {
  return (
    <div className="mx-auto min-h-[45px] px-2 py-[4px]">
      <div className="relative flex h-[24px] items-center justify-between">
        {<p className="text-muted text-sm">3 pages</p>}
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
  );
};

export default ContentHeader;
