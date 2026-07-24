import { useEffect } from "react";
import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { toLonLat } from "ol/proj";
import type { Polygon } from "ol/geom";
import type { DrawEvent } from "ol/interaction/Draw";
import { useOlMap } from "../map/MapContext";

interface Props {
  enabled: boolean;
  onCreated: (polygon: [number, number][]) => void;
}

function ZoneEditor({ enabled, onCreated }: Props) {
  const map = useOlMap();

  useEffect(() => {
    if (!enabled) return;

    const source = new VectorSource();
    const layer = new VectorLayer({ source });
    map.addLayer(layer);

    const draw = new Draw({ source, type: "Polygon" });

    const handleDrawEnd = (evt: DrawEvent) => {
      const geometry = evt.feature.getGeometry() as Polygon;
      const ring = geometry.getCoordinates()[0];

      // ol/geom/Polygon luôn đóng vòng (điểm cuối trùng điểm đầu) — Leaflet
      // getLatLngs() thì không, bỏ điểm trùng cuối để khớp đúng quy ước dữ
      // liệu cũ (tránh lưu thừa 1 đỉnh trùng lặp vào DB).
      const isClosed =
        ring.length > 1 &&
        ring[0][0] === ring[ring.length - 1][0] &&
        ring[0][1] === ring[ring.length - 1][1];
      const openRing = isClosed ? ring.slice(0, -1) : ring;

      const polygon = openRing.map((coord) => {
        const [lng, lat] = toLonLat(coord);
        return [lat, lng] as [number, number];
      });

      onCreated(polygon);
    };

    draw.on("drawend", handleDrawEnd);
    map.addInteraction(draw);

    return () => {
      draw.un("drawend", handleDrawEnd);
      map.removeInteraction(draw);
      map.removeLayer(layer);
    };
  }, [map, enabled, onCreated]);

  return null;
}

export default ZoneEditor;
