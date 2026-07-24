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
