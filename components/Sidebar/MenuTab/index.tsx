import clsx from "clsx";
import React from "react";
import { SidebarItem } from "../sidebarData";
import Tooltip from "@/components/ui/Tooltip";

interface MenuListProps {
  item: SidebarItem;
  activeTabId: string;
  handleTabClick: (id: string) => void;
}

const MenuTab = ({ item, handleTabClick, activeTabId }: MenuListProps) => {
  const isSelected = item.id === activeTabId;
  const Icon = item.icon;

  const iconContainer = clsx(
    "relative flex h-full w-12 min-w-12 items-center justify-center",
    isSelected &&
      "after:absolute after:top-1/2 after:right-0 after:block after:h-[28px] after:w-[3px] after:-translate-y-1/2 after:bg-blue-primary after:content-['']",
  );

  const iconWrapper = clsx("text-muted", isSelected && "text-blue-primary!");

  return (
    <div
      role="tab"
      id={`tab-${item.id}`}
      aria-controls={`panel-${item.id}`}
      aria-selected={isSelected}
      onClick={() => handleTabClick(item.id)}
      className="hover:bg-hover relative flex h-11 cursor-pointer items-center select-none"
    >
      <Tooltip content={item.label} placement="left">
        <div className={iconContainer}>
          <Icon strokeWidth={1.7} className={iconWrapper} size={20} />
        </div>
      </Tooltip>
      <div className="mr-2">
        <p className="text-muted text-sm">{item.label}</p>
      </div>
    </div>
  );
};

export default MenuTab;
