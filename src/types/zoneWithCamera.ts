import type { Camera } from "./camera";
import type { Zone } from "./zone";

export interface ZoneWithCamera extends Zone {
  cameras: Camera[];
}
