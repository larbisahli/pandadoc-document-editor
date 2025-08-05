import {
  CirclePlus,
  LucideIcon,
  Palette,
  Paperclip,
  Shapes,
} from "lucide-react";
import React from "react";
import ContentPanel from "./MenuPanel/ContentPanel";
import ContentLibraryPanel from "./MenuPanel/ContentLibraryPanel";
import DesignPanel from "./MenuPanel/DesignPanel";
import AttachmentsPanel from "./MenuPanel/AttachmentsPanel";

export interface SidebarItem {
  id: string;
  label: string;
  icon: (props: React.ComponentProps<LucideIcon>) => React.JSX.Element;
  component: React.FC<{ handleDisplayPanelToggle: () => void }>;
}

export const menuListsData: SidebarItem[] = [
  {
    id: "menu-content",
    label: "Content",
    icon: (props) => <CirclePlus {...props} />,
    component: ContentPanel,
  },
  {
    id: "menu-content-library",
    label: "Content library",
    icon: (props) => <Shapes {...props} />,
    component: ContentLibraryPanel,
  },
  {
    id: "menu-design",
    label: "Design",
    icon: (props) => <Palette {...props} />,
    component: DesignPanel,
  },
  {
    id: "menu-attachments",
    label: "Attachments",
    icon: (props) => <Paperclip {...props} />,
    component: AttachmentsPanel,
  },
];
