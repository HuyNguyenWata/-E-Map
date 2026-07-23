export type AlertType = "fire" | "smoke" | "person" | "vehicle" | "offline" | "crowd" | "weapon";

export type AlertSeverity = "info" | "warning" | "critical";

export interface CameraAlert {
  id: number;

  cameraId: number;

  cameraName: string;

  type: AlertType;

  severity: AlertSeverity;

  time: string;
}
