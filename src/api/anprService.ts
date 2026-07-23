import type { PlateDetection } from "../types/anpr";

// Service ANPR (Python) được gọi thẳng từ trình duyệt — giống cách frontend
// gọi thẳng MediaMTX để lấy video — không đi qua lớp JWT của backend .NET.
// Chỉ phù hợp khi service này nằm trong mạng nội bộ tin cậy.
const ANPR_SERVICE_URL = import.meta.env.VITE_ANPR_SERVICE_URL ?? "http://localhost:8001";

export interface AnprDetectionResult {
  plateNumber: string;
  confidence: number;
  boundingBox: { x1: number; y1: number; x2: number; y2: number };
  saved: PlateDetection;
}

export async function detectPlatesInImage(
  file: File,
  cameraId?: number,
): Promise<AnprDetectionResult[]> {
  const formData = new FormData();
  formData.append("file", file);

  const url = new URL(`${ANPR_SERVICE_URL}/detect`);
  if (cameraId !== undefined) url.searchParams.set("camera_id", String(cameraId));

  const res = await fetch(url.toString(), { method: "POST", body: formData });

  if (!res.ok) {
    throw new Error(`ANPR service lỗi: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { detections: AnprDetectionResult[] };
  return data.detections;
}
