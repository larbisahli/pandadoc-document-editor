import Tooltip from "@/components/ui/Tooltip";
import { Plus } from "lucide-react";

const ContentFooter = () => {
  return (
    <div className="mx-auto min-h-[48px] px-2 py-[14px]">
      <div className="relative flex h-[24px] items-center justify-center">
        <Tooltip content="Add content" placement="bottom">
          <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
            <Plus size={20} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ContentFooter;
