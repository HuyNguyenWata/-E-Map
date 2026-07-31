export type BehaviorType =
  | "crowd"
  | "weapon"
  | "litter"
  | "lineCrossing"
  | "zoneIntrusion"
  | "loitering";

export interface BehaviorSettings {
  crowdThreshold: number;
}

export interface BehaviorDetection {
  id: number;
  type: BehaviorType;
  personCount: number | null;
  confidence: number | null;
  triggeredAlert: boolean;
  cameraId: number | null;
  cameraName: string | null;
  detectedAt: string;
  vcaLineId: number | null;
  vcaLineName: string | null;
  vcaZoneId: number | null;
  vcaZoneName: string | null;
  direction: string | null;
  dwellSeconds: number | null;
}

// Khung phương tiện (xe máy/ô tô/...) chỉ để vẽ live trên video — không phải
// lịch sử lưu DB (xem chú thích VehicleBoxDto phía backend), nên KHÔNG có id.
export type VehicleType = "car" | "motorcycle" | "bus" | "truck";

export interface VehicleBox {
  vehicleType: VehicleType;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface VehicleDetection {
  cameraId: number;
  vehicles: VehicleBox[];
}
