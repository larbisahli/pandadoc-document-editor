import { InstanceId, OverlayId } from "./common";

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
  settings?: unknown;
}
