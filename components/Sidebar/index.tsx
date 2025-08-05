"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";
import MenuTab from "./MenuTab";
import MenuPanel from "./MenuPanel";
import { menuListsData } from "./sidebarData";

const SidebarComponent = () => {
  const [activeTabId, setActiveTabId] = useState(menuListsData[0]?.id);
  const [displayPanel, setDisplayPanel] = useState(true);

  const handleTabClick = useCallback((id: string) => {
    setActiveTabId(id);
    setDisplayPanel(true);
  }, []);

  const handleDisplayPanelToggle = useCallback(() => {
    setDisplayPanel((prevValue) => !prevValue);
  }, []);

  const sideBarContainer = clsx(
    "border-primary relative z-[2] h-full soverflow-hidden border-l",
    {
      "w-[330px] min-w-[330px]": displayPanel,
      "w-[48px] min-w-[48px]": !displayPanel,
    },
  );

  const sidePanelContainer = clsx(
    "absolute top-0 right-0 z-[1] overflow-hidden",
    "border-primary border-l bg-white h-full w-[282px]",
    { hidden: !displayPanel },
  );

  return (
    <div className={sideBarContainer}>
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
      <section className={sidePanelContainer}>
        {menuListsData.map(({ id, component: Component }) => (
          <MenuPanel key={id} id={id} activeTabId={activeTabId}>
            <Component handleDisplayPanelToggle={handleDisplayPanelToggle} />
          </MenuPanel>
        ))}
      </section>
    </div>
  );
};

export default SidebarComponent;
