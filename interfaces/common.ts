// IDs
export type Id<T extends string> = string & { __brand: T };

export type DocumentId = Id<"doc">;
export type PageId = Id<"page">;
export type NodeId = Id<"node">;
export type InstanceId = Id<"inst">;
export type FieldId = Id<"fld">;
export type OverlayId = Id<"ov">;

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
