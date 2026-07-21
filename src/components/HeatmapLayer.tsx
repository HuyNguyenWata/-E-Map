import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet.heat";

import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";

interface Props {
  cameras: Camera[];

  alerts: CameraAlert[];
}

function HeatmapLayer({ cameras, alerts }: Props) {
  const map = useMap();

  useEffect(() => {
    const points = cameras.map((camera) => {
      const count = alerts.filter(
        (alert) => alert.cameraId === camera.id,
      ).length;

      return [camera.latitude, camera.longitude, count || 0.2] as [
        number,
        number,
        number,
      ];
    });

    const heatLayer = (L as any)
      .heatLayer(points, {
        radius: 40,

        blur: 30,

        maxZoom: 17,

        // Khớp màu với HeatmapLegend
        gradient: {
          0.2: "#3b82f6",
          0.4: "#22d3ee",
          0.6: "#a3e635",
          0.8: "#facc15",
          1.0: "#ef4444",
        },
      })
      .addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [cameras, alerts, map]);

  return null;
}

export default HeatmapLayer;
