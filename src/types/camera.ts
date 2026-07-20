import type { AlertType, AlertSeverity } from "./alert";

export type CameraStatus = "online" | "offline";

export interface Camera {
  id: number;

  name: string;

  latitude: number;

  longitude: number;

  address: string;

  status: CameraStatus;

  streamUrl: string;

  signal: number;

  lastSeen: string;

  alert?: {
    type: AlertType;

    severity: AlertSeverity;
  };

  // Camera thuộc zone nào
  zoneId?: number;
}
