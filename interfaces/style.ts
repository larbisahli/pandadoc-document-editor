export interface ContentStyleType {
  align?: "left" | "right";
  width?: number;
  height?: number;
}

export interface LayoutStyleType {
  backgroundColor?: string;
  width?: string;
  height?: string;
  minHeight?: number;
  margin?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  padding?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}
