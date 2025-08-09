import React from "react";
import { useSideMenu } from "..";

interface Props {
  id: string;
  children: React.ReactNode;
}

const MenuPanel = ({ id, children }: Props) => {
  const { activeTabId } = useSideMenu();
  const isVisible = id === activeTabId;
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isVisible}
      className="py-1"
    >
      {isVisible && children}
    </div>
  );
};

export default MenuPanel;
