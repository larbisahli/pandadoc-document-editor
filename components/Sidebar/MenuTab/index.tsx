import classNames from "classnames";
import { CirclePlus, Palette, Paperclip, Shapes } from "lucide-react";
import React, { ReactElement, useState } from "react";

interface MenuListProps {
  item: {
    id: string;
    label: string;
    icon: () => React.ReactNode;
  };
  activeTabId: string;
  handleTabClick: (id: string) => void;
}

export const menuListsData = [
  {
    id: "menu-content",
    label: "Content",
    icon: () => (
      <CirclePlus strokeWidth={1.7} className="text-muted" size={20} />
    ),
  },
  {
    id: "menu-content-library",
    label: "Content library",
    icon: () => <Shapes strokeWidth={1.7} className="text-muted" size={20} />,
  },
  {
    id: "menu-design",
    label: "Design",
    icon: () => <Palette strokeWidth={1.7} className="text-muted" size={20} />,
  },
  {
    id: "menu-attachments",
    label: "Attachments",
    icon: () => (
      <Paperclip strokeWidth={1.7} className="text-muted" size={20} />
    ),
  },
];

const MenuTab = ({ item, handleTabClick, activeTabId }: MenuListProps) => {
  const isSelected = item.id === activeTabId;
  return (
    <div
      role="tab"
      id={`tab-${item.id}`}
      aria-controls={`panel-${item.id}`}
      aria-selected={isSelected}
      onClick={() => handleTabClick(item.id)}
      className="hover:bg-hover relative flex h-11 cursor-pointer items-center select-none"
    >
      <div
        aria-label=""
        className={classNames(
          "relative flex h-full w-12 min-w-12 items-center justify-center",
          isSelected &&
            "after:absolute after:top-1/2 after:right-0 after:block after:h-[28px] after:w-[3px] after:-translate-y-1/2 after:bg-blue-500 after:content-['']",
        )}
      >
        {item.icon()}
      </div>
      <div className="mr-2">
        <p className="text-muted text-sm">{item.label}</p>
      </div>
    </div>
  );
};

export default MenuTab;
