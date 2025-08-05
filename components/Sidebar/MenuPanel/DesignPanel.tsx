import { X } from "lucide-react";
import React from "react";

interface Props {
  handleDisplayPanelToggle: () => void;
}

const DesignPanel = ({ handleDisplayPanelToggle }: Props) => {
  return (
    <>
      <div className="flex min-h-[35px] items-center pr-[10px] pl-4">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-600">Design</div>
        </div>
        <div className="flex items-center justify-center pl-[10px]">
          <button
            onClick={handleDisplayPanelToggle}
            className="hover:bg-hover cursor-pointer rounded p-[3px]"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center px-4">Menu Design</div>
    </>
  );
};

export default DesignPanel;
