import MarkerClusterGroup from "react-leaflet-cluster";

import CameraMarker from "./CameraMarker";

import type { Camera } from "../types/camera";

interface Props {
  cameras: Camera[];

  onSelect: (camera: Camera) => void;
}

function CameraCluster({ cameras, onSelect }: Props) {
  return (
    <MarkerClusterGroup chunkedLoading>
      {cameras.map((camera) => (
        <CameraMarker camera={camera} onSelect={onSelect} />
      ))}
    </MarkerClusterGroup>
  );
}

export default CameraCluster;
