import { InstanceId, OverlayId } from "./common";
import { RecipientType } from "./recipient";

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
  recipient: RecipientType;
}
