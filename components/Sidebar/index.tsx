"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import MenuTab from "./MenuTab";
import MenuPanel from "./MenuPanel";
import { menuListsData } from "./sidebarData";

type SidebarContextType = {
  activeTabId: string;
  handlePanelToggle: () => void;
  handleActiveTab: (id: string) => void;
};

const SidebarCtx = createContext<SidebarContextType | null>(null);

export const useSideMenu = () => {
  const ctx = useContext(SidebarCtx);
  if (!ctx)
    throw new Error("useSideMenu must be used within <SidebarComponent>");
  return ctx;
};

const SidebarComponent = () => {
  const [activeTabId, setActiveTabId] = useState(menuListsData[0]?.id);
  const [displayPanel, setDisplayPanel] = useState(true);

  const handleActiveTab = useCallback((id: string) => {
    startTransition(() => {
      setActiveTabId(id);
      setDisplayPanel(true);
    });
  }, []);

  const handlePanelToggle = useCallback(() => {
    setDisplayPanel((prevValue) => !prevValue);
  }, []);

  const ctx = useMemo(
    () => ({ activeTabId, handlePanelToggle, handleActiveTab }),
    [activeTabId, handlePanelToggle, handleActiveTab],
  );

  const sideBarContainer = clsx(
    "border-primary relative z-[2] h-full border-l bg-gree-400",
    {
      "w-[330px] min-w-[330px]": displayPanel,
      "w-[48px] min-w-[48px]": !displayPanel,
    },
  );

  const sidePanelContainer = clsx(
    "absolute top-0 right-0 bottom-0 z-[1] overflow-auto",
    "border-primary border-l bg-white h-full w-[282px]",
    { hidden: !displayPanel },
  );

  return (
    <SidebarCtx.Provider value={ctx}>
      <div className={sideBarContainer}>
        <nav role="tablist" aria-orientation="vertical" className="h-full">
          {menuListsData?.map((item) => (
            <MenuTab key={item.id} item={item} />
          ))}
        </nav>
        <section className={sidePanelContainer}>
          {menuListsData.map(({ id, component: Component }) => (
            <MenuPanel key={id} id={id} className="h-full w-full py-1">
              <Component />
            </MenuPanel>
          ))}
        </section>
      </div>
    </SidebarCtx.Provider>
  );
};

export default SidebarComponent;
