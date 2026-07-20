export type AlertType = "fire" | "smoke" | "person" | "vehicle" | "offline";

export type AlertSeverity = "info" | "warning" | "critical";

export interface CameraAlert {
  id: number;

  cameraId: number;

  cameraName: string;

  type: AlertType;

  severity: AlertSeverity;

  time: string;
}
