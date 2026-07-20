import { useMemo } from "react";

import type { Camera } from "../types/camera";
import type { ZoneWithCamera } from "../types/zoneWithCamera";

export default function useZoneCamera(
  cameras: Camera[],
  selectedZone: ZoneWithCamera | null,
) {
  const zoneCameras = useMemo(() => {
    if (!selectedZone) {
      return cameras;
    }

    return cameras.filter((camera) => camera.zoneId === selectedZone.id);
  }, [cameras, selectedZone]);

  return {
    zoneCameras,
  };
}
