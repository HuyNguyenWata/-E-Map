export interface Person {
  id: number;
  fullName: string;
  description: string;
  photoBase64: string | null;
  createdAt: string;
}

export interface FaceDetection {
  id: number;
  personId: number | null;
  personName: string | null;
  similarity: number;
  cameraId: number | null;
  cameraName: string | null;
  detectedAt: string;
}

export interface AttendanceDay {
  date: string; // yyyy-MM-dd
  count: number;
}

export interface AttendanceSummary {
  personId: number;
  personName: string;
  daily: AttendanceDay[];
  total: number;
}
