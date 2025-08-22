// IDs
export type Id<T extends string> = string & { __brand: T };

export type DocumentId = Id<"doc">;
export type PageId = Id<"page">;
export type NodeId = Id<"node">;
export type InstanceId = Id<"instance">;
export type TemplateId = Id<"template">;
export type FieldId = Id<"field">;
export type OverlayId = Id<"overlay">;

export interface TextDataType {
  content?: string;
}

export interface ImageDataType {
  url?: string;
  alt?: string;
}

export interface VideoDataType {
  value?: { amount: number; currency: string };
}

export interface TableContentType {
  values?: string[];
}

export interface FieldTextDataType {
  content?: string;
}

export type DataType =
  | TextDataType
  | ImageDataType
  | VideoDataType
  | TableContentType
  | FieldTextDataType;
