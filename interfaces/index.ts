export type Content = {
  id: number;
  name: string;
};

export interface CustomSvgProps {
  width: number;
  height: number;
  className?: string;
}

// -----------

// Field types
export type FieldType = "text" | "image" | "video" | "price" | "table";

// Field interface
export interface Field {
  id: string;
  type: FieldType;
  value: any;
}

// Block interface
export interface Block {
  id: string;
  type: "text" | "table" | "image" | "video";
  fieldIds: string[];
}

// Document
export interface Document {
  id: string;
  title: string;
  blockIds: string[];
}

// Normalized slices
export interface Normalized<T> {
  byId: Record<string, T>;
  allIds: string[];
}

// Full App State
export interface AppState {
  document: Document;
  blocks: Normalized<Block>;
  fields: Normalized<Field>;
  users: {
    currentUserId: string;
    byId: Record<string, { id: string; name: string }>;
  };
  history: {
    past: AppState[];
    future: AppState[];
  };
}
