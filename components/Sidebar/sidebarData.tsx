import { CirclePlus, Palette, Shapes } from "lucide-react";
import React from "react";
import ContentPanel from "./MenuPanel/ContentPanel";
import ContentLibraryPanel from "./MenuPanel/ContentLibraryPanel";
import DesignPanel from "./MenuPanel/DesignPanel";
import VariablesPanel from "./MenuPanel/VariablesPanel";
import VariablesIcon from "../ui/icons/variables";
import { CustomSvgProps } from "@/interfaces";

export interface SidebarItem {
  id: string;
  label: string;
  icon: (props: CustomSvgProps) => React.JSX.Element;
  component: React.FC<unknown>;
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
    id: "menu-variables",
    label: "Variables",
    icon: (props: CustomSvgProps) => <VariablesIcon {...props} />,
    component: VariablesPanel,
  },
];
