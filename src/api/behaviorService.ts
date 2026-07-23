import type { BehaviorDetection } from "../types/behavior";

// Service phân tích hành vi (Python) được gọi thẳng từ trình duyệt — giống cách
// gọi service ANPR/khuôn mặt — chỉ phù hợp khi service nằm trong mạng nội bộ tin cậy.
const BEHAVIOR_SERVICE_URL = import.meta.env.VITE_BEHAVIOR_SERVICE_URL ?? "http://localhost:8003";

export interface CrowdDetectResult {
  personCount: number;
  saved: BehaviorDetection | null;
}

export interface WeaponDetection {
  label: string;
  confidence: number;
}

export interface WeaponDetectResult {
  detections: WeaponDetection[];
  saved: BehaviorDetection | null;
}

export interface LitterCandidate {
  label: string;
  confidence: number;
}

export interface LitterDetectResult {
  candidates: LitterCandidate[];
  triggered: LitterCandidate[];
  saved: BehaviorDetection | null;
}

async function postImage<T>(path: string, file: File, cameraId?: number): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);

  const url = new URL(`${BEHAVIOR_SERVICE_URL}${path}`);
  if (cameraId !== undefined) url.searchParams.set("camera_id", String(cameraId));

  const res = await fetch(url.toString(), { method: "POST", body: formData });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Behavior service lỗi: ${res.status}`);
  }

  return (await res.json()) as T;
}

export function detectCrowd(file: File, cameraId?: number): Promise<CrowdDetectResult> {
  return postImage<CrowdDetectResult>("/detect-crowd", file, cameraId);
}

export function detectWeapon(file: File, cameraId?: number): Promise<WeaponDetectResult> {
  return postImage<WeaponDetectResult>("/detect-weapon", file, cameraId);
}

export function detectLitter(file: File, cameraId?: number): Promise<LitterDetectResult> {
  return postImage<LitterDetectResult>("/detect-litter", file, cameraId);
}
