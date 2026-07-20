export interface CameraFilter {
  keyword: string;

  status: "all" | "online" | "offline";

  alert: "all" | "critical" | "warning" | "none";
}
