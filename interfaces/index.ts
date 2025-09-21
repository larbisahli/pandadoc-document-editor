export type Content = {
  id: number;
  name: string;
};

export interface CustomSvgProps {
  width: number;
  height: number;
  className?: string;
}

export type Rect = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
};
export type PageSize = { width: number; height: number };
export type Guides = { x: number[]; y: number[] };
