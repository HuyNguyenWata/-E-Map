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

  // Có giá trị khi StreamUrl do backend tự tính từ nguồn RTSP camera thật
  // (xem CamerasController) — null khi camera đang ở chế độ push thủ công.
  sourceRtspUrl?: string | null;

  signal: number;

  lastSeen: string;

  alert?: {
    type: AlertType;

    severity: AlertSeverity;
  };

  // Camera thuộc zone nào
  zoneId?: number;
}

export interface CreateCameraInput {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  streamUrl: string;
  sourceRtspUrl?: string;
  zoneId?: number | null;
}
