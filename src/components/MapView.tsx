import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import type BaseLayer from "ol/layer/Base";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorTileLayer from "ol/layer/VectorTile";
import { applyStyle } from "ol-mapbox-style";
import { Attribution } from "ol/control";
import { fromLonLat } from "ol/proj";

import { MapContext } from "../map/MapContext";
import CameraCluster from "./CameraCluster";
import HeatmapLayer from "./HeatmapLayer";
import MapController from "./MapController";
import MapClickHandler from "./MapClickHandler";
import ZoneCircle from "./ZoneCircle";
import ZoneLayer from "./ZoneLayer";
import PlateRouteLayer from "./PlateRouteLayer";
import type { RoutePoint } from "./PlateRouteLayer";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { ZoneWithCamera } from "../types/zoneWithCamera";
import ZoneEditor from "./ZoneEditor";
import VnSovereigntyLayer from "./VnSovereigntyLayer";

interface Props {
  cameras: Camera[];
  alerts: CameraAlert[];
  onSelect: (camera: Camera) => void;
  showHeatmap: boolean;
  showCamera: boolean;
  onMapReady: (map: Map) => void;
  zones: ZoneWithCamera[];
  selectedZone: number | null;

  onSelectZone: (zone: ZoneWithCamera) => void;
  drawZone: boolean;

  onCreateZone: (polygon: [number, number][]) => void;

  drawAnprArea: boolean;
  onCreateAnprArea: (polygon: [number, number][]) => void;

  radiusMode: boolean;
  radiusCenter: [number, number] | null;
  radiusValue: number;
  onRadiusPick: (lat: number, lng: number) => void;

  routePoints: RoutePoint[];
}

const DEFAULT_CENTER: [number, number] = [106.700806, 10.776889]; // [lng, lat]
const DEFAULT_ZOOM = 15;

// Bản đồ nền tự host (xem ../../map-tile-server) — style.json (OSM Bright,
// tương thích schema OpenMapTiles) trỏ về Martin + sprite nội bộ, áp dụng
// bằng ol-mapbox-style. Không gọi ra ngoài internet lúc chạy: nhãn dùng web
// font đã bundle sẵn (@fontsource/noto-sans, xem main.tsx), không phải file
// glyph PBF hay font CDN ngoài. Chỉ fallback về tile OpenStreetMap công cộng
// khi CHƯA cấu hình VITE_MAP_STYLE_URL, dành cho dev local lúc chưa dựng
// tile server nội bộ — KHÔNG dùng fallback này khi triển khai thật.
function createBaseLayer(): BaseLayer {
  const styleUrl = import.meta.env.VITE_MAP_STYLE_URL;

  if (styleUrl) {
    const layer = new VectorTileLayer({ declutter: true });
    applyStyle(layer, styleUrl, { source: "openmaptiles" }).catch((err) =>
      console.error("[MapView] Không áp dụng được style bản đồ tự host:", err),
    );
    return layer;
  }

  console.warn(
    "[MapView] VITE_MAP_STYLE_URL chưa được cấu hình — đang fallback về tile OpenStreetMap công cộng " +
      "(chỉ dùng cho dev local). Xem map-tile-server/README.md để dựng tile server nội bộ.",
  );
  return new TileLayer({ source: new OSM() });
}

function MapView({
  cameras,
  alerts,
  onSelect,
  showHeatmap,
  showCamera,
  onMapReady,
  zones,
  selectedZone,
  onSelectZone,
  drawZone,
  onCreateZone,
  drawAnprArea,
  onCreateAnprArea,
  radiusMode,
  radiusCenter,
  radiusValue,
  onRadiusPick,
  routePoints,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  // Chỉ tạo Map 1 lần lúc mount — OpenLayers tự quản lý toàn bộ nội dung DOM
  // bên trong containerRef sau khi setTarget, nên div này KHÔNG được render
  // thêm JSX con nào cả (tránh xung đột React reconciliation với DOM do OL
  // tự chèn vào). Các layer/overlay component render dưới dạng anh em cùng
  // cấp, không lồng bên trong div này.
  useEffect(() => {
    if (!containerRef.current) return;

    const olMap = new Map({
      target: containerRef.current,
      layers: [createBaseLayer()],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
      // Chỉ bật đúng control ghi công nguồn bản đồ (bắt buộc theo giấy phép
      // ODbL của OSM + CC-BY của OpenMapTiles) — không dùng bộ control mặc
      // định của OL (zoom +/-...) vì app đã có MapToolbar riêng.
      // collapsible+collapsed=true: chỉ hiện icon "i" nhỏ ở góc, bấm vào mới
      // xổ ra dòng chữ ghi công đầy đủ — vẫn tuân thủ license (không giấu
      // hẳn/gỡ bỏ), chỉ giảm độ chiếm chỗ trên giao diện. Style thêm ở
      // App.css (.ol-attribution) để icon nhỏ/mờ hơn mặc định của OL.
      controls: [new Attribution({ collapsible: true, collapsed: true })],
    });

    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
      setMap(null);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {map && (
        <MapContext.Provider value={map}>
          <MapController onReady={onMapReady} />
          <ZoneEditor enabled={drawZone} onCreated={onCreateZone} />
          <ZoneEditor enabled={drawAnprArea} onCreated={onCreateAnprArea} />
          <ZoneLayer zones={zones} selectedZoneId={selectedZone} onSelect={onSelectZone} />
          <VnSovereigntyLayer />

          {radiusMode && !drawZone && !drawAnprArea && <MapClickHandler onClick={onRadiusPick} />}

          {radiusCenter && <ZoneCircle center={radiusCenter} radius={radiusValue} />}

          {routePoints.length > 0 && <PlateRouteLayer points={routePoints} />}

          {showHeatmap && <HeatmapLayer cameras={cameras} alerts={alerts} />}

          {showCamera && <CameraCluster cameras={cameras} onSelect={onSelect} />}
        </MapContext.Provider>
      )}
    </>
  );
}

export default MapView;
