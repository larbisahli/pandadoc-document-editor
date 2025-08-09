import { X } from "lucide-react";
import { useSideMenu } from "..";

type Props = {
  label: string;
};

const MenuHeader = ({ label }: Props) => {
  const { handlePanelToggle } = useSideMenu();
  return (
    <div className="flex min-h-[35px] items-center pr-[10px] pl-4">
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-600">{label}</div>
      </div>
      <div className="flex items-center justify-center pl-[10px]">
        <button
          onClick={handlePanelToggle}
          className="hover:bg-hover cursor-pointer rounded p-[3px]"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default MenuHeader;
