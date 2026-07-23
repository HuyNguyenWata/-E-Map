import type { Camera, CreateCameraInput } from "../types/camera";
import type { CameraAlert, AlertType, AlertSeverity } from "../types/alert";
import type { Zone, CreateZoneInput } from "../types/zone";
import type { SystemHealth } from "../types/systemHealth";
import type { AlertStats } from "../types/alertStats";
import type { ZoneAlertStat } from "../types/zoneStats";
import type { RecordingSegment } from "../types/recording";
import type { LoginResponse } from "../types/auth";
import type { CreatePlateEntryInput, LicensePlateEntry, PlateDetection } from "../types/anpr";
import type { AttendanceSummary, FaceDetection, Person } from "../types/face";
import type { BehaviorDetection, BehaviorSettings, BehaviorType } from "../types/behavior";
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
