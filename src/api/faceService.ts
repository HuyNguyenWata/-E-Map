import type { FaceDetection, Person } from "../types/face";

// Service khuôn mặt (Python) được gọi thẳng từ trình duyệt — giống cách gọi
// service ANPR — chỉ phù hợp khi service nằm trong mạng nội bộ tin cậy.
const FACE_SERVICE_URL = import.meta.env.VITE_FACE_SERVICE_URL ?? "http://localhost:8002";

export interface EnrollResult {
  person: Person;
  detScore: number;
}

export async function enrollPerson(
  fullName: string,
  description: string,
  file: File,
): Promise<EnrollResult> {
  const formData = new FormData();
  formData.append("full_name", fullName);
  formData.append("description", description);
  formData.append("file", file);

  const res = await fetch(`${FACE_SERVICE_URL}/enroll`, { method: "POST", body: formData });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Face service lỗi: ${res.status}`);
  }

  return (await res.json()) as EnrollResult;
}

export interface FaceDetectResult {
  boundingBox: { x1: number; y1: number; x2: number; y2: number };
  detScore: number;
  saved: FaceDetection;
}

export async function detectFacesInImage(
  file: File,
  cameraId?: number,
): Promise<FaceDetectResult[]> {
  const formData = new FormData();
  formData.append("file", file);

  const url = new URL(`${FACE_SERVICE_URL}/detect`);
  if (cameraId !== undefined) url.searchParams.set("camera_id", String(cameraId));

  const res = await fetch(url.toString(), { method: "POST", body: formData });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Face service lỗi: ${res.status}`);
  }

  const data = (await res.json()) as { detections: FaceDetectResult[] };
  return data.detections;
}
