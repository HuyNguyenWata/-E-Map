import { MapContainer, TileLayer } from "react-leaflet";

import CameraCluster from "./CameraCluster";
import HeatmapLayer from "./HeatmapLayer";
import MapController from "./MapController";
import ZoneLayer from "./ZoneLayer";

import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { Zone } from "../types/zone";

interface Props {
  cameras: Camera[];
  alerts: CameraAlert[];
  onSelect: (camera: Camera) => void;
  showHeatmap: boolean;
  showCamera: boolean;
  onMapReady: (map: any) => void;
  zones: Zone[];
}

function MapView({
  cameras,
  alerts,
  onSelect,
  showHeatmap,
  showCamera,
  onMapReady,
  zones,
}: Props) {
  return (
    <MapContainer
      center={[10.776889, 106.700806]}
      zoom={15}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <MapController onReady={onMapReady} />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <ZoneLayer zones={zones} />

      {showHeatmap && <HeatmapLayer cameras={cameras} alerts={alerts} />}

      {showCamera && <CameraCluster cameras={cameras} onSelect={onSelect} />}
    </MapContainer>
  );
}

export default MapView;
