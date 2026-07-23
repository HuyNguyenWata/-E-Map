export type BehaviorType = "crowd" | "weapon";

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
}
