import React, { memo } from "react";

interface Props {
  id: string;
  activeTabId: string;
  children: React.ReactNode;
}

const MenuPanel = ({ id, activeTabId, children }: Props) => {
  const isVisible = id === activeTabId;
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isVisible}
    >
      {isVisible && children}
    </div>
  );
};

export default memo(MenuPanel);
