import { useCallback, useEffect, useMemo, useState } from "react";

import { createZoneApi, getZones, setZoneWatch } from "../api/client";

import type { Camera } from "../types/camera";
import type { CreateZoneInput, Zone } from "../types/zone";

export default function useZone(cameras: Camera[]) {
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    let cancelled = false;

    getZones()
      .then((data) => {
        if (!cancelled) setZones(data);
      })
      .catch((err) => console.error("Không tải được danh sách zone:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  const createZone = useCallback(async (input: CreateZoneInput) => {
    const zone = await createZoneApi(input);
    setZones((prev) => [...prev, zone]);
    return zone;
  }, []);

  const toggleZoneWatch = useCallback(async (zoneId: number, enabled: boolean) => {
    const updated = await setZoneWatch(zoneId, enabled);
    setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, ...updated } : z)));
    return updated;
  }, []);

  const zoneList = useMemo(() => {
    return zones.map((zone) => ({
      ...zone,
      cameras: cameras.filter((camera) => camera.zoneId === zone.id),
    }));
  }, [zones, cameras]);

  return {
    zones: zoneList,
    createZone,
    toggleZoneWatch,
  };
}
