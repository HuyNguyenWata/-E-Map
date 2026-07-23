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
