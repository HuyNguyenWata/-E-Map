import type { Camera, CreateCameraInput } from "../types/camera";
import type { CameraAlert, AlertType, AlertSeverity } from "../types/alert";
import type { Zone, CreateZoneInput } from "../types/zone";
import type { SystemHealth } from "../types/systemHealth";
import type { AlertStats } from "../types/alertStats";
import type { ZoneAlertStat } from "../types/zoneStats";
import type { RecordingSegment } from "../types/recording";
import type { LoginResponse } from "../types/auth";
import type { CreatePlateEntryInput, LicensePlateEntry, PlateDetection } from "../types/anpr";
import type { AttendanceSummary, FaceDetection, FaceSettings, Person } from "../types/face";
import type { BehaviorDetection, BehaviorSettings, BehaviorType } from "../types/behavior";
import type { ManagedUser, Role, CreateUserInput, UpdateUserInput } from "../types/user";
import type { FavoriteView, CreateFavoriteViewInput } from "../types/favorite";
import type { VideoBookmark, CreateBookmarkInput } from "../types/bookmark";
import { API_BASE_URL } from "./config";
import { getToken, notifyUnauthorized } from "./authToken";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  });

  if (res.status === 401) {
    notifyUnauthorized();
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }

  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function exportBackup(): Promise<Blob> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/backup/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    notifyUnauthorized();
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }
  if (!res.ok) {
    throw new Error(`Xuất backup thất bại: ${res.status} ${res.statusText}`);
  }

  return res.blob();
}

// Nhận thẳng nội dung text của file JSON đã xuất trước đó — không re-parse
// thành object ở frontend để tránh phải định nghĩa lại y hệt shape DTO backend.
export async function restoreBackup(backupJsonText: string): Promise<void> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/backup/restore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: backupJsonText,
  });

  if (res.status === 401) {
    notifyUnauthorized();
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Khôi phục thất bại: ${res.status} ${body}`);
  }
}

export interface ScheduledBackupFile {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
}

export function getScheduledBackups(): Promise<ScheduledBackupFile[]> {
  return request<ScheduledBackupFile[]>("/api/backup/scheduled");
}

export function runScheduledBackupNow(): Promise<ScheduledBackupFile> {
  return request<ScheduledBackupFile>("/api/backup/scheduled/run-now", { method: "POST" });
}

export function getRoles(): Promise<Role[]> {
  return request<Role[]>("/api/auth/roles");
}

export function getUsers(): Promise<ManagedUser[]> {
  return request<ManagedUser[]>("/api/auth/users");
}

export function createUser(input: CreateUserInput): Promise<ManagedUser> {
  return request<ManagedUser>("/api/auth/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateUser(id: number, input: UpdateUserInput): Promise<ManagedUser> {
  return request<ManagedUser>(`/api/auth/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteUser(id: number): Promise<void> {
  return request<void>(`/api/auth/users/${id}`, { method: "DELETE" });
}

export function getFavoriteCameras(): Promise<Camera[]> {
  return request<Camera[]>("/api/favorites/cameras");
}

export function addFavoriteCamera(cameraId: number): Promise<void> {
  return request<void>(`/api/favorites/cameras/${cameraId}`, { method: "POST" });
}

export function removeFavoriteCamera(cameraId: number): Promise<void> {
  return request<void>(`/api/favorites/cameras/${cameraId}`, { method: "DELETE" });
}

export function getFavoriteViews(): Promise<FavoriteView[]> {
  return request<FavoriteView[]>("/api/favorites/views");
}

export function createFavoriteView(input: CreateFavoriteViewInput): Promise<FavoriteView> {
  return request<FavoriteView>("/api/favorites/views", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteFavoriteView(id: number): Promise<void> {
  return request<void>(`/api/favorites/views/${id}`, { method: "DELETE" });
}

export function getBookmarks(cameraId?: number): Promise<VideoBookmark[]> {
  const query = cameraId !== undefined ? `?cameraId=${cameraId}` : "";
  return request<VideoBookmark[]>(`/api/bookmarks${query}`);
}

export function createBookmark(input: CreateBookmarkInput): Promise<VideoBookmark> {
  return request<VideoBookmark>("/api/bookmarks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteBookmark(id: number): Promise<void> {
  return request<void>(`/api/bookmarks/${id}`, { method: "DELETE" });
}

export interface DiscoveredDevice {
  ipAddress: string;
  deviceServiceUrl: string;
  scopes: string[];
}

// Timeout dài hơn mặc định (~4s quét mạng + margin) — không dùng request()
// chung vì cần override timeout ngầm định của fetch (không có timeout mặc
// định nên thực ra không cần, nhưng vẫn tách riêng cho rõ ý đây là API chậm).
export function discoverOnvifCameras(): Promise<DiscoveredDevice[]> {
  return request<DiscoveredDevice[]>("/api/discovery/onvif", { method: "POST" });
}

export function getCameras(): Promise<Camera[]> {
  return request<Camera[]>("/api/cameras");
}

export function getZones(): Promise<Zone[]> {
  return request<Zone[]>("/api/zones");
}

export function getAlerts(cameraId?: number, take = 50): Promise<CameraAlert[]> {
  const params = new URLSearchParams({ take: String(take) });
  if (cameraId !== undefined) params.set("cameraId", String(cameraId));

  return request<CameraAlert[]>(`/api/alerts?${params.toString()}`);
}

export function createAlert(
  cameraId: number,
  type: AlertType,
  severity: AlertSeverity,
): Promise<CameraAlert> {
  return request<CameraAlert>("/api/alerts", {
    method: "POST",
    body: JSON.stringify({ cameraId, type, severity }),
  });
}

export function resolveAlert(alertId: number): Promise<void> {
  return request<void>(`/api/alerts/${alertId}/resolve`, { method: "PUT" });
}

export function updateCameraApi(id: number, data: Partial<Camera>): Promise<Camera> {
  return request<Camera>(`/api/cameras/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function createCameraApi(data: CreateCameraInput): Promise<Camera> {
  return request<Camera>("/api/cameras", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteCameraApi(id: number): Promise<void> {
  return request<void>(`/api/cameras/${id}`, { method: "DELETE" });
}

export function createZoneApi(data: CreateZoneInput): Promise<Zone> {
  return request<Zone>("/api/zones", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getSystemHealth(): Promise<SystemHealth> {
  return request<SystemHealth>("/api/system/health");
}

export function getAlertStats(days = 7): Promise<AlertStats> {
  return request<AlertStats>(`/api/alerts/stats?days=${days}`);
}

export function getZoneStats(days = 7): Promise<ZoneAlertStat[]> {
  return request<ZoneAlertStat[]>(`/api/zones/stats?days=${days}`);
}

export function getCameraRecordings(cameraId: number): Promise<RecordingSegment[]> {
  return request<RecordingSegment[]>(`/api/cameras/${cameraId}/recordings`);
}

export interface ExportRecordingResult {
  blob: Blob;
  // Đoạn ghi hình quá dài (server giới hạn tối đa 15 phút/lần xuất) — có giá
  // trị này thì file tải về đã bị cắt ngắn, không phải toàn bộ segment gốc.
  truncatedToSeconds: number | null;
}

// Không dùng request<T>() vì response là file nhị phân (mp4), không phải JSON.
export async function exportRecording(
  cameraId: number,
  start: string,
  durationSeconds: number,
): Promise<ExportRecordingResult> {
  const token = getToken();
  const params = new URLSearchParams({ start, duration: String(durationSeconds) });

  const res = await fetch(`${API_BASE_URL}/api/cameras/${cameraId}/recordings/export?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    notifyUnauthorized();
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }
  if (res.status === 403) {
    throw new Error("Bạn không có quyền xuất video");
  }
  if (!res.ok) {
    throw new Error(`Xuất video thất bại: ${res.status} ${res.statusText}`);
  }

  const truncatedHeader = res.headers.get("X-Export-Truncated-Seconds");
  const blob = await res.blob();

  return { blob, truncatedToSeconds: truncatedHeader ? Number(truncatedHeader) : null };
}

export function setZoneWatch(zoneId: number, enabled: boolean): Promise<Zone> {
  return request<Zone>(`/api/anpr/zones/${zoneId}/watch`, {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
}

export function getPlateEntries(): Promise<LicensePlateEntry[]> {
  return request<LicensePlateEntry[]>("/api/anpr/entries");
}

export function createPlateEntry(data: CreatePlateEntryInput): Promise<LicensePlateEntry> {
  return request<LicensePlateEntry>("/api/anpr/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deletePlateEntry(id: number): Promise<void> {
  return request<void>(`/api/anpr/entries/${id}`, { method: "DELETE" });
}

export function getPlateDetections(plateNumber?: string, take = 50): Promise<PlateDetection[]> {
  const params = new URLSearchParams({ take: String(take) });
  if (plateNumber) params.set("plateNumber", plateNumber);

  return request<PlateDetection[]>(`/api/anpr/detections?${params.toString()}`);
}

export function getPeople(): Promise<Person[]> {
  return request<Person[]>("/api/faces/people");
}

export function deletePerson(id: number): Promise<void> {
  return request<void>(`/api/faces/people/${id}`, { method: "DELETE" });
}

export function getFaceDetections(personId?: number, take = 50): Promise<FaceDetection[]> {
  const params = new URLSearchParams({ take: String(take) });
  if (personId !== undefined) params.set("personId", String(personId));

  return request<FaceDetection[]>(`/api/faces/detections?${params.toString()}`);
}

export function getAttendanceSummary(days = 7): Promise<AttendanceSummary[]> {
  return request<AttendanceSummary[]>(`/api/faces/attendance/summary?days=${days}`);
}

// Không dùng request<T>() vì response là file nhị phân (xlsx), không phải JSON.
export async function exportAttendanceExcel(days = 7): Promise<Blob> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/faces/attendance/export?days=${days}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    notifyUnauthorized();
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }

  if (!res.ok) {
    throw new Error(`Xuất Excel thất bại: ${res.status} ${res.statusText}`);
  }

  return res.blob();
}

export function getFaceSettings(): Promise<FaceSettings> {
  return request<FaceSettings>("/api/faces/settings");
}

export function updateFaceSettings(settings: FaceSettings): Promise<FaceSettings> {
  return request<FaceSettings>("/api/faces/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export function getBehaviorSettings(): Promise<BehaviorSettings> {
  return request<BehaviorSettings>("/api/behavior/settings");
}

export function updateBehaviorSettings(settings: BehaviorSettings): Promise<BehaviorSettings> {
  return request<BehaviorSettings>("/api/behavior/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export function getBehaviorDetections(type?: BehaviorType, take = 50): Promise<BehaviorDetection[]> {
  const params = new URLSearchParams({ take: String(take) });
  if (type) params.set("type", type);

  return request<BehaviorDetection[]>(`/api/behavior/detections?${params.toString()}`);
}
