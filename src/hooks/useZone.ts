import { useMemo } from "react";

import { zones } from "../data/zones";

import type { Camera } from "../types/camera";

export default function useZone(cameras: Camera[]) {
  const zoneList = useMemo(() => {
    return zones.map((zone) => ({
      ...zone,
      cameras: cameras.filter((camera) => camera.zoneId === zone.id),
    }));
  }, [cameras]);

  return {
    zones: zoneList,
  };
}
