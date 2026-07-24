import type { AlertType, AlertSeverity } from "./alert";

export type CameraStatus = "online" | "offline";

// A20/H8
export type RecordingMode = "continuous" | "scheduled" | "motionOnly";

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

  // A20/H8 — chế độ ghi hình.
  recordingMode: RecordingMode;
  recordingScheduleStartMinutes: number | null;
  recordingScheduleEndMinutes: number | null;
  motionRecordingSeconds: number;

  // Chỉ dùng khi GỬI update (không phải field trả về từ server) — xem
  // UpdateCameraDto phía backend: cần cờ riêng vì recordingScheduleStart/EndMinutes
  // null tự nó không phân biệt được "không đổi" với "xoá lịch".
  updateRecordingSchedule?: boolean;
}

export interface CreateCameraInput {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  streamUrl: string;
  sourceRtspUrl?: string;
  zoneId?: number | null;
  recordingMode?: RecordingMode;
  recordingScheduleStartMinutes?: number | null;
  recordingScheduleEndMinutes?: number | null;
  motionRecordingSeconds?: number;
}
