import { InstanceId, OverlayId } from "./common";

// ** Overlay → “Where does it appear on the page?” (layout/position/size).
// Visual representation of an instance on a page
export interface OverlayItem {
  id: OverlayId;
  instanceId: InstanceId;
  position: {
    offsetX: number;
    offsetY: number;
  };
  style: {
    width: number;
    height: number;
    fontSize?: number;
    color?: string;
  };
  settings?: Record<string, unknown>;
}
