import { DocumentId, PageId } from "./common";
import { InstanceType } from "./instance";
import { PageLayout } from "./layout";
import { OverlayItem } from "./overlay";
import { RecipientType } from "./recipient";
import { TemplateType } from "./template";

export interface Normalized<T> {
  byId: Record<string, T>;
  // allIds: string[];
}

/**
 *  Document meta + Root model
 */
export interface DocumentMeta {
  id: DocumentId;
  title: string;
  pageIds: PageId[]; // ordered pages
}

/** All pages in the document: { pageId: PageLayout } */
export type PagesMap = Record<string, PageLayout>;

export interface LayoutMultiPageState {
  pages: PagesMap;
  visiblePageId: PageId | null;
}

// Document Root
export interface DocumentModel {
  document: DocumentMeta;
  layout: LayoutMultiPageState;
  instances: Normalized<InstanceType>;
  templates: Normalized<TemplateType>;
  overlays: Normalized<OverlayItem>;
  recipients: Normalized<RecipientType>;
}
