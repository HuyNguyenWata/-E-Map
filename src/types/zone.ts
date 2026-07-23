export interface Zone {
  id: number;

  name: string;

  description: string;

  color: string;

  polygon: [number, number][];

  isAnprWatched: boolean;
}

export interface CreateZoneInput {
  name: string;
  description: string;
  color: string;
  polygon: [number, number][];
}
