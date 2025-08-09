import clsx from "clsx";
import React from "react";
import { SidebarItem } from "../sidebarData";
import Tooltip from "@/components/ui/Tooltip";
import { useSideMenu } from "..";

interface MenuListProps {
  item: SidebarItem;
}

const MenuTab = ({ item }: MenuListProps) => {
  const { activeTabId, handleActiveTab } = useSideMenu();

  const isSelected = item.id === activeTabId;
  const Icon = item.icon;

  const iconContainer = clsx(
    "relative flex h-11 w-12 min-w-12 items-center justify-center",
    isSelected &&
      "after:absolute after:top-1/2 after:right-0 after:block after:h-[28px] after:w-[3px] after:-translate-y-1/2 after:bg-blue-primary after:content-['']",
  );

  const iconWrapper = clsx("text-gray-700", isSelected && "text-blue-primary!");

  return (
    <div
      role="tab"
      id={`tab-${item.id}`}
      aria-controls={`panel-${item.id}`}
      aria-selected={isSelected}
      onClick={() => handleActiveTab(item.id)}
      className="hover:bg-hover relative flex h-11 cursor-pointer items-center select-none"
    >
      <Tooltip content={item.label} placement="left">
        <div className={iconContainer}>
          <Icon width={20} height={20} className={iconWrapper} />
        </div>
      </Tooltip>
      <div className="mr-2">
        <p className="text-muted text-sm">{item.label}</p>
      </div>
    </div>
  );
};

export default MenuTab;
