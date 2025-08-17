import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@/components/ui/tabs";
import React from "react";
import MenuHeader from "../MenuHeader";
import dynamic from "next/dynamic";
import { ContentLibraryPanelSkeleton } from "../Skeletons";

const RecentLibraryPanel = dynamic(() => import("./RecentLibrary"), {
  loading: () => <ContentLibraryPanelSkeleton />,
});

const FeaturedLibrary = dynamic(() => import("./FeaturedLibrary"), {
  loading: () => <ContentLibraryPanelSkeleton />,
});

const ContentLibraryPanel = () => {
  return (
    <>
      <MenuHeader label="Content Library highlights" />
      <div className="flex items-center justify-center">
        <Tabs defaultValue="overview" className="w-full">
          <TabList className="px-4">
            <Tab value="overview">Recent</Tab>
            <Tab value="details" className="ml-5">
              Featured
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="overview">
              <RecentLibraryPanel />
            </TabPanel>
            <TabPanel value="details">
              <FeaturedLibrary />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
};

export default ContentLibraryPanel;
