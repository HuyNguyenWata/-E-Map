import { useEffect } from "react";
import HeatmapOlLayer from "ol/layer/Heatmap";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { useOlMap } from "../map/MapContext";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";

interface Props {
  cameras: Camera[];
  alerts: CameraAlert[];
}

const WEIGHT_KEY = "weight";

function HeatmapLayer({ cameras, alerts }: Props) {
  const map = useOlMap();

  useEffect(() => {
    const counts = cameras.map(
      (camera) => alerts.filter((alert) => alert.cameraId === camera.id).length,
    );
    const maxCount = Math.max(1, ...counts);

    const features = cameras.map((camera, i) => {
      const feature = new Feature(new Point(fromLonLat([camera.longitude, camera.latitude])));
      // ol/layer/Heatmap muốn weight trong khoảng 0-1 (khác leaflet.heat nhận
      // thẳng số nguyên) — chuẩn hoá theo giá trị lớn nhất, camera không có
      // alert vẫn có 1 chấm mờ nhỏ (0.2 tương đối) giống hành vi bản Leaflet cũ.
      const raw = counts[i] || 0.2;
      feature.set(WEIGHT_KEY, Math.min(1, raw / maxCount));
      return feature;
    });

    const layer = new HeatmapOlLayer({
      source: new VectorSource({ features }),
      weight: (feature) => feature.get(WEIGHT_KEY) as number,
      radius: 22,
      blur: 24,
      // Khớp màu với HeatmapLegend.
      gradient: ["#3b82f6", "#22d3ee", "#a3e635", "#facc15", "#ef4444"],
    });

    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, cameras, alerts]);

  return null;
}

export default HeatmapLayer;
