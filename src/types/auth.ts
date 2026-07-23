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
  | "ManageUsers";

export interface AuthUser {
  username: string;
  roleName: string;
  permissions: Permission[];
}

export interface LoginResponse {
  token: string;
  username: string;
  roleName: string;
  permissions: Permission[];
}
