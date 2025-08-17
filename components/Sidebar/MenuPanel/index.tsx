import React from "react";
import { useSideMenu } from "..";

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const MenuPanel = ({ id, children, className }: Props) => {
  const { activeTabId } = useSideMenu();
  const isVisible = id === activeTabId;
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isVisible}
      className={className}
    >
      {isVisible && children}
    </div>
  );
};

export default MenuPanel;
