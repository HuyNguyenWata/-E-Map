export type Permission =
  | "ViewLive"
  | "ViewPlayback"
  | "ExportRecording"
  | "ManageCameras"
  | "ManageZones"
  | "ManageAnprList"
  | "ManageFaceEnrollment"
  | "ManageBehaviorSettings"
  | "ResolveAlerts"
  | "ManageUsers"
  | "ManageVca";

export interface AuthUser {
  username: string;
  roleName: string;
  permissions: Permission[];
  // true khi đăng nhập ở chế độ xem demo (offline, không có backend) — xem
  // loginDemo() trong AuthContext.
  isDemo?: boolean;
}

export interface LoginResponse {
  token: string;
  username: string;
  roleName: string;
  permissions: Permission[];
}
