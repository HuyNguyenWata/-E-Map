export type VcaLineMode = "counting" | "tripwire";

export interface VcaLine {
  id: number;
  cameraId: number;
  name: string;
  start: [number, number];
  end: [number, number];
  mode: VcaLineMode;
  crossCountAtoB: number;
  crossCountBtoA: number;
}

export interface CreateVcaLineInput {
  name: string;
  start: [number, number];
  end: [number, number];
  mode: VcaLineMode;
}

export interface VcaZone {
  id: number;
  cameraId: number;
  name: string;
  polygon: [number, number][];
  alertOnIntrusion: boolean;
  alertOnLoitering: boolean;
  loiterSeconds: number;
}

export interface CreateVcaZoneInput {
  name: string;
  polygon: [number, number][];
  alertOnIntrusion: boolean;
  alertOnLoitering: boolean;
  loiterSeconds: number;
}

export interface VcaCameraConfig {
  cameraId: number;
  lines: VcaLine[];
  zones: VcaZone[];
}
