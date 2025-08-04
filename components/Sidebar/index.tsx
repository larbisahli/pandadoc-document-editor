"use client";
import { useState } from "react";
import classNames from "classnames";
import MenuTab, { menuListsData } from "./MenuTab";
import MenuPanel from "./MenuPanel";
import ContentLibraryPanel from "./MenuPanel/ContentLibraryPanel";
import ContentPanel from "./MenuPanel/ContentPanel";
import DesignPanel from "./MenuPanel/DesignPanel";
import AttachmentsPanel from "./MenuPanel/AttachmentsPanel";

const SidebarComponent = () => {
  const [activeTabId, setActiveTabId] = useState(menuListsData[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
  };

  return (
    <div className="border-primary relative z-[2] h-full w-[330px] min-w-[330px] overflow-hidden border-l shadow">
      <nav role="tablist" aria-orientation="vertical" className="h-full">
        {menuListsData?.map((item) => (
          <MenuTab
            key={item.id}
            activeTabId={activeTabId}
            handleTabClick={handleTabClick}
            item={item}
          />
        ))}
      </nav>
      <section className="border-primary absolute top-0 right-0 z-[1] h-full w-[282px] overflow-hidden border-l bg-white">
        <MenuPanel id="menu-content" activeTabId={activeTabId}>
          <ContentLibraryPanel />
        </MenuPanel>
        <MenuPanel id="menu-content-library" activeTabId={activeTabId}>
          <ContentPanel />
        </MenuPanel>
        <MenuPanel id="menu-design" activeTabId={activeTabId}>
          <DesignPanel />
        </MenuPanel>
        <MenuPanel id="menu-attachments" activeTabId={activeTabId}>
          <AttachmentsPanel />
        </MenuPanel>
      </section>
    </div>
  );
};

export default SidebarComponent;
