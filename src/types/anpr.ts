export type PlateListType = "whitelist" | "blacklist";

export interface LicensePlateEntry {
  id: number;
  plateNumber: string;
  listType: PlateListType;
  description: string;
  createdAt: string;
}

export interface CreatePlateEntryInput {
  plateNumber: string;
  listType: PlateListType;
  description: string;
}

export interface PlateDetection {
  id: number;
  plateNumber: string;
  confidence: number;
  cameraId: number | null;
  cameraName: string | null;
  latitude: number | null;
  longitude: number | null;
  detectedAt: string;
  matchedListType: PlateListType | null;
  inWatchedZone: boolean;
}

// B4 — vùng giám sát biển số vẽ tự do (polygon/circle) theo GPS, độc lập Zone.
export type AnprWatchAreaShape = "polygon" | "circle";

export interface AnprWatchArea {
  id: number;
  name: string;
  enabled: boolean;
  shape: AnprWatchAreaShape;
  polygon: [number, number][];
  centerLatitude: number | null;
  centerLongitude: number | null;
  radiusMeters: number | null;
}

export interface CreateAnprWatchAreaInput {
  name: string;
  shape: AnprWatchAreaShape;
  polygon?: [number, number][];
  centerLatitude?: number;
  centerLongitude?: number;
  radiusMeters?: number;
}
