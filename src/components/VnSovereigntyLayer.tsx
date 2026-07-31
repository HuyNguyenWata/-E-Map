import { useEffect } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import type { FeatureLike } from "ol/Feature";
import { useOlMap } from "../map/MapContext";

// Nhãn "Quần đảo Hoàng Sa"/"Quần đảo Trường Sa" — luôn hiển thị rõ bất kể
// zoom, KHÔNG đi qua style.json/ol-mapbox-style (applyStyle chỉ áp dụng cho
// đúng 1 nguồn "openmaptiles" được chỉ định, source GeoJSON riêng này bị bỏ
// qua nếu gộp chung). OpenMapTiles xếp các đảo không dân cư này vào nhóm
// "place-other" (minzoom 15, dùng thuật toán dân số/tầm quan trọng) nên gần
// như không hiện ở mức zoom xem toàn Việt Nam — layer riêng này đảm bảo luôn
// thấy được, đúng như các bản đồ nhà nước Việt Nam vẫn thể hiện.
const GEOJSON_URL = `${new URL(import.meta.env.VITE_MAP_STYLE_URL ?? "", window.location.href).origin}/vn-sovereignty-labels.geojson`;

const MARKER_FILL = new Fill({ color: "#DA251D" });
const MARKER_STROKE = new Stroke({ color: "#FFFF00", width: 1.5 });
const LABEL_FILL = new Fill({ color: "#DA251D" });
const LABEL_HALO = new Stroke({ color: "#ffffff", width: 3 });
const SUBTITLE_FILL = new Fill({ color: "#7a1712" });
const SUBTITLE_HALO = new Stroke({ color: "#ffffff", width: 2.5 });

function sovereigntyStyle(feature: FeatureLike): Style[] {
  const name = feature.get("name") as string;
  const subtitle = feature.get("subtitle") as string;

  return [
    new Style({ image: new Circle({ radius: 5, fill: MARKER_FILL, stroke: MARKER_STROKE }) }),
    new Style({
      text: new Text({
        text: name,
        font: "bold 13px sans-serif",
        fill: LABEL_FILL,
        stroke: LABEL_HALO,
        offsetY: 16,
        textAlign: "center",
      }),
    }),
    new Style({
      text: new Text({
        text: subtitle,
        font: "11px sans-serif",
        fill: SUBTITLE_FILL,
        stroke: SUBTITLE_HALO,
        offsetY: 32,
        textAlign: "center",
      }),
    }),
  ];
}

function VnSovereigntyLayer() {
  const map = useOlMap();

  useEffect(() => {
    if (!import.meta.env.VITE_MAP_STYLE_URL) return;

    const source = new VectorSource({
      url: GEOJSON_URL,
      format: new GeoJSON(),
    });
    const layer = new VectorLayer({ source, style: sovereigntyStyle, declutter: true });
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
}

export default VnSovereigntyLayer;
