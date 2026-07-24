import { useEffect } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Circle as CircleGeom, Point } from "ol/geom";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import { useOlMap } from "../map/MapContext";

interface Props {
  center: [number, number]; // [lat, lng]
  radius: number; // mét
}

// ol/geom/Circle nhận bán kính theo đơn vị hệ chiếu bản đồ — với Web Mercator
// (đang dùng ở MapView), đơn vị này xấp xỉ mét ở các vĩ độ vừa phải, khớp
// đúng ý nghĩa "radius" (mét) mà Leaflet Circle cũng dùng, nên không cần quy đổi.
function ZoneCircle({ center, radius }: Props) {
  const map = useOlMap();

  useEffect(() => {
    const [lat, lng] = center;
    const projCenter = fromLonLat([lng, lat]);

    const circleFeature = new Feature(new CircleGeom(projCenter, radius));
    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({ color: "#f97316", width: 2, lineDash: [6, 6] }),
        fill: new Fill({ color: "rgba(249, 115, 22, 0.12)" }),
      }),
    );

    const centerFeature = new Feature(new Point(projCenter));
    centerFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          stroke: new Stroke({ color: "#f97316", width: 2 }),
          fill: new Fill({ color: "#f97316" }),
        }),
      }),
    );

    const layer = new VectorLayer({
      source: new VectorSource({ features: [circleFeature, centerFeature] }),
    });
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, center, radius]);

  return null;
}

export default ZoneCircle;
