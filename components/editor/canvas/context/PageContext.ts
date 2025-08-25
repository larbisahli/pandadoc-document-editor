import { NodeId, PageId } from "@/interfaces/common";
import { createContext, useContext } from "react";

export const PageContext = createContext<{ pageId: PageId }>({
  pageId: "" as PageId,
});

export const usePage = () => useContext(PageContext);
