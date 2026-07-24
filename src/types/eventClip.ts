export type EventClipStatus = "pending" | "ready" | "failed";

export interface EventClip {
  id: number;
  cameraId: number;
  cameraName: string;
  label: string;
  eventTime: string;
  durationSeconds: number;
  status: EventClipStatus;
  failureReason: string | null;
}
