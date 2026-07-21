import { useMemo } from "react";

import type { Camera } from "../types/camera";
import { distance } from "../utils/distance";

export default function useRadiusCameras(
  cameras: Camera[],
  center: [number, number] | null,
  radius: number,
) {
  const camerasInRadius = useMemo(() => {
    if (!center) {
      return [];
    }

    return cameras.filter(
      (camera) =>
        distance(center[0], center[1], camera.latitude, camera.longitude) <=
        radius,
    );
  }, [cameras, center, radius]);

  return {
    camerasInRadius,
  };
}
